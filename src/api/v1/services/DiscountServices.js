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
const { convertToObjectId, removeNullObject } = require("../utils/getInfo");
const { findAllProductsRepo } = require("../repositories/product.repo");

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
      discount_code: discount_code,
      discount_shopId: discount_shopId,
      discount_isActive: true,
    });

    if (!foundDiscount || !foundDiscount.discount_isActive)
      throw new ForbiddenRequestError(`Discount is not exist`, 404);

    const { discount_applyTo, discount_productIds } = foundDiscount;
    let products = [];

    if (discount_applyTo === "all") {
      products = await findAllProductsRepo({
        filter: {
          product_shop: discount_shopId,
          isPublished: true,
        },
        limit: 50,
        sort: "ctime",
        page: 1,
        select: [
          "product_shop",
          "product_name",
          "product_price",
          "product_thumb",
          "isPublished",
        ],
      });
    }

    if (discount_applyTo === "products_special") {
      products = await findAllProductsRepo({
        filter: {
          _id: { $in: discount_productIds },
          isPublished: true,
          product_shop: discount_shopId,
        },
        limit: 50,
        sort: "ctime",
        page: 1,
        select: [
          "product_shop",
          "product_name",
          "product_price",
          "product_thumb",
          "isDraft",
          "isPublished",
        ],
      });
    }
    return products;
  };

  static getAllDiscountsByShop = async ({
    limit = 50,
    sort = "ctime",
    page = 1,
    discount_shopId = convertToObjectId(discount_shopId),
    filter = {
      discount_isActive: true,
    },

    unSelect = ["__v"],
  }) => {
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

    return foundDiscounts;
  };

  static getDiscountsAmount = async ({
    discount_code,
    discount_shopId,
    discount_used_userId,
    products_order,
  }) => {
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
    } = foundDiscount;

    if (
      !discount_isActive ||
      discount_quantity === 0 ||
      new Date() > new Date(discount_end) ||
      new Date() < new Date(discount_start)
    )
      throw new ForbiddenRequestError(`Discount is out`);

    let orderTotalAmount = 0;
    if (discount_order_minValue > 0) {
      orderTotalAmount = products_order.reduce((acc, product) => {
        return acc + +product.price * +product.quantity;
      }, 0);

      if (+orderTotalAmount < discount_order_minValue)
        throw new ForbiddenRequestError(
          `orderTotalAmount require minimum is ${discount_order_minValue}`
        );

      /* check */
      if (discount_useMax_user > 0) {
        const userUsed = discount_used_users.find(
          (user) => user._id === discount_used_userId
        );
        if (userUsed) throw new ForbiddenRequestError(`Your turn is over`);
      }

      const discountAmount =
        discount_type === "fixed_amount"
          ? discount_value
          : ((+orderTotalAmount * discount_value) / 100).toFixed(0);

      return {
        orderTotalAmount,
        discountAmount: +discountAmount,
        orderTotalAmountPay: orderTotalAmount - discountAmount,
      };
    }
    return { orderTotalAmount };
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
    this.discount_code = discount_code;
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

    if (foundDiscount && foundDiscount.discount_isActive)
      throw new ForbiddenRequestError(`Discount is exist`);

    return await createDiscountRepo(objectParams);
  }
}

module.exports = DiscountServices;
