"use strict";
const util = require("util");
const logger = require("../log");
const { CREATED, OK } = require("../core/successResponse");
const DiscountServices = require("../services/DiscountServices");

class DiscountController {
  createDiscount = async (req, res) => {
    new CREATED({
      message: "createDiscount CREATED",
      metadata: await DiscountServices.createDiscount({
        ...req.body,
        discount_shopId: req.user._id,
      }),
    }).send(res);
  };

  getAllDiscountsByShop = async (req, res) => {
    new OK({
      message: "getAllDiscountsByShop OK",
      metadata: await DiscountServices.getAllDiscountsByShop({
        query: req.query,
        body: req.body,
      }),
    }).send(res);
  };

  getAllDiscountsByShops = async (req, res) => {
    new OK({
      message: "getAllDiscountsByShops OK",
      metadata: await DiscountServices.getAllDiscountsByShops({
        discount_shopIds: req.body?.discount_shopIds,
      }),
    }).send(res);
  };

  getAllProductsByDiscount = async (req, res) => {
    new OK({
      message: "getAllProductsByDiscount OK",
      metadata: await DiscountServices.getAllProductsByDiscount({
        discount_shopId: req.user._id,
        discount_code: req.body.discount_code.toUpperCase(),
        byShop: req.body.byShop ?? false,
      }),
    }).send(res);
  };

  getDiscountsAmount = async (req, res) => {
    new OK({
      message: "getDiscountsAmount OK" /* BO; dung de checkout cart */,
      metadata: await DiscountServices.getDiscountsAmount({
        discount_used_userId: req.user._id,
        discount_code: req.body.discount_code.toUpperCase(),
        discount_shopId: req.body.discount_shopId,
        products_order: req.body.products_order,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
