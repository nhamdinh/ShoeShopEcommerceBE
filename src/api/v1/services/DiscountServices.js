"use strict";
const util = require("util");
const logger = require("../log");

const {
  ForbiddenRequestError,
  NotFoundRequestError,
} = require("../core/errorResponse");
const {
  createDiscountRepo,
  findOneDiscountRepo,
  getAllDiscountsByShopRepo,
  deleteDiscountByShopRepo,
} = require("../repositories/discount.repo");
const { convertToObjectId } = require("../utils/getInfo");
const { findAllProductsRepo } = require("../repositories/product.repo");
const ProductServices = require("./ProductServices");
const {
  removeNullObject,
  checkNumber,
  toFixedNumber,
} = require("../utils/functionHelpers");

/**
 * 1. Generator Discount Code [Shop | Admin]
 * 2. Get all discount codes [User | Shop]
 * 3. Get all product by discount code [User]
 * 4. Get discount amount [User]
 * 5. Delete discount Code [Admin | Shop]
 * 6. Cancel discount Code [User]
 **/

class DiscountServices {
  static createDiscount = async (payload) => {
    return new Discount(payload).createDiscount();
  };

  static getAllProductsByDiscount = async ({
    discount_code = discount_code.toUpperCase(),
    discount_shopId = convertToObjectId(discount_shopId),
    byShop = false,
  }) => {
    const filterDiscount = {
      discount_code,
      discount_isActive: true,
      discount_start: {
        $lte: new Date(),
      },
      discount_end: {
        $gte: new Date(),
      },
    };
    if (byShop) filterDiscount.discount_shopId = discount_shopId;

    const foundDiscount = await findOneDiscountRepo(filterDiscount);

    if (!foundDiscount || !foundDiscount.discount_isActive)
      throw new NotFoundRequestError(`Discount is not exist OR expire`);

    const { discount_applyTo, discount_productIds } = foundDiscount;

    const filter = {
      isPublished: true,
    };
    if (byShop) filter.product_shop = discount_shopId;

    if (discount_applyTo === "products_special") {
      filter._id = { $in: discount_productIds };
    }
    if (discount_applyTo === "all") {
    }

    return await findAllProductsRepo({
      filter,
      limit: 50,
      page: 1,
      sort: { _id: -1 },
      select: [
        "product_shop",
        "product_name",
        "product_price",
        "product_original_price",
        "product_thumb",
        "isDraft",
        "isPublished",
      ],
    });
  };

  static getAllDiscountsByShops = async ({
    limit = 50,
    sort = { _id: -1 },
    page = 1,
    discount_shopIds = [],
    filter = {
      discount_isActive: true,
    },

    unSelect = ["__v"],
  }) => {
    const foundDiscounts = await Promise.all(
      discount_shopIds.map(async (id, index) => {
        const objDiscount = await getAllDiscountsByShopRepo({
          limit: +limit,
          page: +page,
          sort,
          filter: {
            ...filter,
            discount_shopId: convertToObjectId(id),
          },
          unSelect,
        });

        if (objDiscount) {
          return {
            ...objDiscount,
            discount_shopId: id,
          };
        }
      })
    );

    foundDiscounts.map((checkDiscount, index) => {
      if (!checkDiscount)
        throw new NotFoundRequestError(`Discount is not exist`);
    });

    // const metadataProducts = await ProductServices.findAllPublishedByShop({
    //   product_shop: discount_shopId,
    // });

    // let discounts = foundDiscounts?.discounts;
    // discounts.map((item) => {
    //   if (item?.discount_productIds.length > 0) {
    //     let productsIds = item?.discount_productIds;

    //     let productsDiscount = [];

    //     for (let i = 0; i < productsIds.length; i++) {
    //       let _id = productsIds[i];

    //       let product = metadataProducts.products.find(
    //         (item) => item._id.toString() === _id
    //       );

    //       if (product) {
    //         let mergedProduct = { ...product, _id };
    //         productsDiscount.push(mergedProduct);
    //       }
    //     }

    //     item.discount_productIds = productsDiscount;
    //   }
    // });

    return foundDiscounts;
  };

  static getAllDiscountsByShop = async ({
    limit = 50,
    sort = { _id: -1 },
    page = 1,
    filter = {
      discount_isActive: true,
    },
    unSelect = ["__v"],
    query,
    body,
  }) => {
    const { discount_shopId } = query;

    const foundDiscounts = await getAllDiscountsByShopRepo({
      limit: +limit,
      page: +page,
      sort,
      filter: {
        ...filter,
        discount_shopId: convertToObjectId(discount_shopId),
      },
      unSelect,
    });

    const metadataProducts = await ProductServices.findProductsByShop({
      queryShop: { product_shop: convertToObjectId(discount_shopId) },
      isPublished: true,
    });

    const discounts = foundDiscounts?.discounts.map((item) => {
      const final = { ...item };
      const productsIds = item?.discount_productIds;

      if (productsIds.length) {
        const productsDiscount = [];

        for (let i = 0; i < productsIds.length; i++) {
          const _id = productsIds[i];

          const product = metadataProducts.products.find(
            (item) => item._id.toString() === _id
          );
          if (product) productsDiscount.push({ ...product, _id });
        }

        final.discount_productIds = productsDiscount;
      }
      return final;
    });

    return { ...foundDiscounts, discounts };
  };

  static DiscountStrategy = {
    products_special: (props) =>
      DiscountServices.discountStrategySpecial(props),
    all: (props) => DiscountServices.discountStrategyAll(props),
  };

  static getDiscountStrategy = (type, props) => {
    return DiscountServices.DiscountStrategy[type](props);
  };

  static discountStrategySpecial = ({
    products_order,
    discount_type,
    discount_value,
    discount_productIds,
  }) => {
    const products_order_applied = [];

    products_order.map((product) => {
      const priceRawOne = +product.price * +product.quantity;
      let discountedOne = 0;
      let amountPayOne = checkNumber(+priceRawOne - +discountedOne);

      if (discount_productIds.includes(product.product_id)) {
        const discountEachProduct =
          discount_type === "fixed_amount"
            ? +discount_value
            : toFixedNumber((+product.price * discount_value) / 100, 1);

        discountedOne = toFixedNumber(
          discountEachProduct * +product?.quantity,
          1
        );

        amountPayOne = checkNumber(+priceRawOne - +discountedOne);
      }

      products_order_applied.push({
        ...product,
        summary: {
          priceRawOne,
          discountedOne,
          amountPayOne,
        },
      });
    });
    return products_order_applied;
  };

  static discountStrategyAll = ({
    products_order,
    discount_type,
    discount_value,
    discount_productIds,
  }) => {
    const products_order_applied = [];

    products_order.map((product) => {
      const priceRawOne = +product.price * +product.quantity;
      const discountEachProduct =
        discount_type === "fixed_amount"
          ? +discount_value
          : toFixedNumber((+product.price * discount_value) / 100, 1);

      const discountedOne = toFixedNumber(
        discountEachProduct * +product?.quantity,
        1
      );

      const amountPayOne = checkNumber(+priceRawOne - +discountedOne);
      products_order_applied.push({
        ...product,
        summary: {
          priceRawOne,
          discountedOne,
          amountPayOne,
        },
      });
    });
    return products_order_applied;
  };

  static getDiscountsAmount = async ({
    discount_used_userId,
    discount_code,
    discount_shopId,
    products_order,
  }) => {
    const foundDiscount = await findOneDiscountRepo({
      discount_code: discount_code,
      discount_shopId: convertToObjectId(discount_shopId),
      discount_isActive: true,
    });
    if (!foundDiscount) throw new NotFoundRequestError(`Discount is not exist`);

    const {
      discount_isActive,
      discount_quantity,
      discount_start,
      discount_end,
      discount_description,
      discount_order_minValue,
      discount_useMax_user,
      discount_used_users,
      discount_type,
      discount_value,
      discount_applyTo,
      discount_productIds,
    } = foundDiscount;

    /* check expire */
    if (
      !discount_isActive ||
      discount_quantity === 0 ||
      new Date() > new Date(discount_end) ||
      new Date() < new Date(discount_start)
    )
      throw new ForbiddenRequestError(`Discount has been expired`);
    /* check expire */

    if (discount_order_minValue <= 0)
      throw new ForbiddenRequestError(`discount_order_minValue <= 0`);
    {
      /* check Your turn */
      if (discount_useMax_user > 0) {
        const userUsed = discount_used_users.find(
          (user) => user._id === discount_used_userId
        );
        if (userUsed) throw new ForbiddenRequestError(`Your turn is over`);
      }
      /* check Your turn */

      const orderTotalAmount = products_order.reduce((acc, product) => {
        return +acc + +product.price * +product.quantity;
      }, 0);

      if (+orderTotalAmount < discount_order_minValue)
        throw new ForbiddenRequestError(
          `orderTotalAmount require minimum is ${discount_order_minValue}`
        );

      /* => tinh lai discount cho tung mon; ap ma nao cho tung pro */

      const products_order_applied = DiscountServices.getDiscountStrategy(
        discount_applyTo,
        {
          products_order,
          discount_type,
          discount_value,
          discount_productIds,
        }
      );

      const summary = products_order_applied.reduce((acc, product) => {
        acc.totalAmountForCoupon =
          +(acc.totalAmountForCoupon ?? 0) + +product.summary.priceRawOne;
        acc.totalDiscountedForCoupon =
          +(acc.totalDiscountedForCoupon ?? 0) + +product.summary.discountedOne;
        acc.totalPayForCoupon =
          +(acc.totalPayForCoupon ?? 0) + +product.summary.amountPayOne;

        return acc;
      }, {});

      return {
        ...summary,
        discount_code,
        discount_description,
        products_order_applied,
      };
    }
  };

  static deleteDiscountByShop = async ({ codeId, discount_shopId }) => {
    const deleted = await deleteDiscountByShopRepo({
      codeId: convertToObjectId(codeId),
      discount_shopId: convertToObjectId(discount_shopId),
    });
    return deleted;
  };

  static cancelDiscountBy = async () => {
    // const deleted = await deleteDiscountByShopRepo({
    //   codeId: convertToObjectId(codeId),
    //   discount_shopId: convertToObjectId(discount_shopId),
    // });
    return null;
  };
}

class Discount {
  constructor({
    discount_description,
    discount_type,
    discount_value,
    discount_code,
    discount_start,
    discount_end,
    discount_quantity,
    discount_used,
    discount_used_users,
    discount_useMax_user,
    discount_order_minValue,
    discount_shopId,
    discount_isActive,
    discount_isDelete,
    discount_applyTo,
    discount_productIds,
  }) {
    this.discount_description = discount_description;
    this.discount_type = discount_type;
    this.discount_value = discount_value;
    this.discount_code = discount_code.toUpperCase();
    this.discount_start = discount_start;
    this.discount_end = discount_end;
    this.discount_quantity = discount_quantity;
    this.discount_used = discount_used;
    this.discount_used_users = discount_used_users;
    this.discount_useMax_user = discount_useMax_user;
    this.discount_order_minValue = discount_order_minValue;
    this.discount_shopId = convertToObjectId(discount_shopId);
    this.discount_isActive = discount_isActive;
    this.discount_isDelete = discount_isDelete;
    this.discount_applyTo = discount_applyTo;
    this.discount_productIds =
      this.discount_applyTo === "all" ? [] : discount_productIds;
  }

  async createDiscount() {
    const objectParams = removeNullObject(this);
    // logger.info(
    //   `objectParams ::: ${util.inspect(objectParams, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );
    if (
      // new Date() > new Date(objectParams.discount_start) ||
      new Date() > new Date(objectParams.discount_end)
    )
      throw new ForbiddenRequestError(`Discount code has expired`);

    if (
      new Date(objectParams.discount_end) <=
      new Date(objectParams.discount_start)
    )
      throw new ForbiddenRequestError(`Start date must be before End date`);

    const foundDiscount = await findOneDiscountRepo({
      discount_code: objectParams.discount_code,
      discount_shopId: objectParams.discount_shopId,
      discount_isActive: true,
    });
    /* check product belong shop??? */
    if (foundDiscount && foundDiscount.discount_isActive)
      throw new ForbiddenRequestError(`Discount is exist`);

    return await createDiscountRepo(objectParams);
  }
}

module.exports = DiscountServices;
