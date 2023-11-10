"use strict";
const util = require("util");
const logger = require("../log");

const {} = require("../core/errorResponse");
const {
  createDiscountRepo,
  findOneDiscountRepo,
} = require("../repositories/discount.repo");
const { convertToObjectId } = require("../utils/getInfo");
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
  constructor({
    discount_name,
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
    discount_applyTo,
    discount_productIds,
  }) {
    this.discount_name = discount_name;
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
    this.discount_applyTo = discount_applyTo;
    this.discount_productIds =
      this.discount_applyTo === "all" ? [] : discount_productIds;
  }

  static createDiscount = async () => {
    if (
      new Date() < new Date(this.discount_start) ||
      new Date() > new Date(this.discount_end)
    )
      throw new ForbiddenRequestError(`Discount code has expired`);

    if (new Date(this.discount_end) <= new Date(this.discount_start))
      throw new ForbiddenRequestError(`Start date must be before End date`);

    const foundDiscount = await findOneDiscountRepo({
      discount_code: this.discount_code,
      discount_shopId: this.discount_shopId,
    });

    if (foundDiscount && foundDiscount.discount_isActive)
      throw new ForbiddenRequestError(`Discount is exist`);

    return await createDiscountRepo(this);
  };

  static getAllProductsByDiscount = async () => {
    const foundDiscount = await findOneDiscountRepo({
      discount_code: this.discount_code,
      discount_shopId: this.discount_shopId,
    });

    if (!foundDiscount || !foundDiscount.discount_isActive)
      throw new ForbiddenRequestError(`Discount is not exist`);

    const { discount_applyTo, discount_productIds } = foundDiscount;
    let products = [];

    if (discount_applyTo === "all") {
      products = await findAllProductsRepo({
        filter: {
          product_shop: this.discount_shopId,
          isPublished: true,
        },
        limit: 50,
        sort: "ctime",
        page: 1,
        select: [
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
        },
        limit: 50,
        sort: "ctime",
        page: 1,
        select: [
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
}

module.exports = DiscountServices;
