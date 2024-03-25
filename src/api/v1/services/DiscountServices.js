"use strict";
const util = require("util");
const logger = require("../log");

const { ForbiddenRequestError } = require("../core/errorResponse");
const {
  createDiscountRepo,
  findOneDiscountRepo,
  getAllDiscountsByShopRepo,
  deleteDiscountByShopRepo,
} = require("../repositories/discount.repo");
const { convertToObjectId } = require("../utils/getInfo");
const { findAllProductsRepo } = require("../repositories/product.repo");
const ProductServices = require("./ProductServices");
const { removeNullObject } = require("../utils/functionHelpers");

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
    discount_code,
    discount_shopId = convertToObjectId(discount_shopId),
  }) => {
    const foundDiscount = await findOneDiscountRepo({
      discount_code,
      discount_shopId,
      discount_isActive: true,
    });

    if (!foundDiscount || !foundDiscount.discount_isActive)
      throw new ForbiddenRequestError(`Discount is not exist`, 404);

    const { discount_applyTo, discount_productIds } = foundDiscount;

    const filter = {
      product_shop: discount_shopId,
      isPublished: true,
    };

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
        "product_thumb",
        "isDraft",
        "isPublished",
      ],
    });
  };

  static getAllDiscountsByShop = async ({
    discount_shopId = convertToObjectId(discount_shopId),
    filter = {
      discount_isActive: true,
    },
    unSelect = ["__v"],
    body,
  }) => {
    const {
      sortKey = "_id",
      sortVal = -1,
      page = +(body?.page ?? 1),
      limit = +(body?.limit ?? 50),

      discount_code = body?.discount_code ?? "",
      discount_start = body?.discount_start ?? "",
      discount_end = body?.discount_end ?? "",
      select = [
        // "product_name",
        // "product_shop",
        // "product_price",
        // "product_thumb",
        // "isDraft",
        // "isPublished",
      ],
    } = body;

    const sort = {};
    sort[sortKey] = sortVal;

    if (discount_start)
      filter.discount_start = {
        $gte: new Date(discount_start),
      };
    if (discount_end) {
      filter.discount_end = {
        $lte: new Date(discount_end),
      };
    } /* else {
      filter.discount_end = {
        $gte: new Date(),
      };
    } */

    if (discount_code) {
      const regexSearch = new RegExp(discount_code, "i");
      filter.discount_code = { $regex: regexSearch };
    }

    const metadataProducts = await ProductServices.findAllPublishedByShop({
      product_shop: discount_shopId,
    });
    const { totalCount, products } = metadataProducts;
    if (!totalCount)
      throw new ForbiddenRequestError(`No Products In Shop`, 404);

    const foundDiscounts = await getAllDiscountsByShopRepo({
      limit: +limit,
      page: +page,
      sort,
      filter: {
        ...filter,
        discount_shopId,
      },
      unSelect,
    });

    if (!foundDiscounts)
      throw new ForbiddenRequestError(`Discount is not exist`, 404);

    /* check products in discounts*/
    const discounts = foundDiscounts?.discounts;
    discounts.map((ddd) => {
      const productsIds = ddd?.discount_productIds ?? [];

      if (productsIds.length > 0) {
        const productsDiscount = [];

        for (let i = 0; i < productsIds.length; i++) {
          const _id = productsIds[i];

          const product = products.find((item) => item._id.toString() === _id);

          if (product) {
            productsDiscount.push(product);
          }
        }

        ddd.discount_productIds = productsDiscount;
      }
    });

    return foundDiscounts;
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
      if (!checkDiscount) {
        throw new ForbiddenRequestError(`Discount is not exist`, 404);
      }
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

  static getDiscountsAmount = async ({ discount_used_userId, body }) => {
    const {
      discount_code = body.discount_code.toUpperCase(),
      discount_shopId,
      products_order,
    } = body;

    const foundDiscount = await findOneDiscountRepo({
      discount_code: discount_code,
      discount_shopId: convertToObjectId(discount_shopId),
      discount_isActive: true,
    });
    if (!foundDiscount)
      throw new ForbiddenRequestError(`Discount is not exist`, 404);

    const {
      discount_isActive,
      discount_quantity,
      discount_start,
      discount_end,
      discount_order_minValue,
      discount_useMax_user,
      discount_used_users,
      discount_type,
      discount_value,
      discount_applyTo,
      discount_productIds,
    } = foundDiscount;

    // if (
    //   !discount_isActive ||
    //   discount_quantity === 0 ||
    //   new Date() > new Date(discount_end) ||
    //   new Date() < new Date(discount_start)
    // )
    //   throw new ForbiddenRequestError(`Discount is out`);

    if (discount_order_minValue <= 0)
      throw new ForbiddenRequestError(`discount_order_minValue <= 0`, 404);
    {
      /* check */
      if (discount_useMax_user > 0) {
        const userUsed = discount_used_users.find(
          (user) => user._id === discount_used_userId
        );
        if (userUsed) throw new ForbiddenRequestError(`Your turn is over`);
      }

      const orderTotalAmount = products_order.reduce((acc, product) => {
        return +acc + +product.price * +product.quantity;
      }, 0);

      if (+orderTotalAmount < discount_order_minValue)
        throw new ForbiddenRequestError(
          `orderTotalAmount require minimum is ${discount_order_minValue}`
        );

      /* => tinh lai discount cho tung mon */
      if (discount_applyTo === "products_special") {
        const productsDiscount = products_order.filter((order) => {
          return discount_productIds.includes(order.product_id);
        });

        if (productsDiscount.length > 0) {
          let discountAmount = 0;
          if (discount_type === "fixed_amount") {
            discountAmount = productsDiscount.reduce((acc, product) => {
              return +acc + +(+product?.quantity * discount_value).toFixed(0);
            }, 0);
          }
          if (discount_type === "percent") {
            discountAmount = productsDiscount.reduce((acc, product) => {
              return (
                +acc +
                +(
                  (+product?.quantity * +product?.price * discount_value) /
                  100
                ).toFixed(0)
              );
            }, 0);
          }
          return {
            orderTotalAmount,
            discountAmount: +discountAmount,
            orderTotalAmountPay:
              orderTotalAmount - discountAmount < 1
                ? 1
                : orderTotalAmount - discountAmount,
          };
        }
        return { orderTotalAmount, discountAmount: 0, orderTotalAmountPay: 0 };
      }

      if (discount_applyTo === "all") {
        const discountAmount =
          discount_type === "fixed_amount"
            ? discount_value
            : ((+orderTotalAmount * discount_value) / 100).toFixed(0);

        return {
          orderTotalAmount,
          discountAmount: +discountAmount,
          orderTotalAmountPay:
            orderTotalAmount - discountAmount < 1
              ? 1
              : orderTotalAmount - discountAmount,
        };
      }
    }
    return { orderTotalAmount, discountAmount: 0, orderTotalAmountPay: 0 };

    throw new ForbiddenRequestError(`Discount is out`);
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
