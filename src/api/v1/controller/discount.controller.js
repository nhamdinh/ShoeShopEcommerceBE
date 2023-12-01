"use strict";

const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const generateRefreshToken = require("../utils/generateRefreshToken");
const crypto = require("node:crypto");

const { validationResult } = require("express-validator");

const ChatStory = require("../Models/ChatStoryModel");
const util = require("util");
const logger = require("../log");
const { COOKIE_REFRESH_TOKEN } = require("../utils/constant");
const KeyTokenServices = require("../services/KeyTokenServices");
const { createToken } = require("../utils/authUtils");
const { getInfoData } = require("../utils/getInfo");
const { ForbiddenRequestError } = require("../core/errorResponse");
const { CREATED, OK } = require("../core/successResponse");
const DiscountServices = require("../services/DiscountServices");

class DiscountController {
  createDiscount = async (req, res, next) => {
    new CREATED({
      message: "createDiscount CREATED",
      metadata: await DiscountServices.createDiscount({
        ...req.body,
        discount_shopId: req.user._id,
      }),
    }).send(res);
  };

  getAllDiscountsByShop = async (req, res, next) => {
    // logger.info(
    //   `req.body ::: ${util.inspect(req.body, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );

    new OK({
      message: "getAllDiscountsByShop OK",
      metadata: await DiscountServices.getAllDiscountsByShop({
        discount_shopIds: req.body?.discount_shopIds,
      }),
    }).send(res);
  };

  getAllProductsByDiscount = async (req, res, next) => {
    new OK({
      message: "getAllProductsByDiscount OK",
      metadata: await DiscountServices.getAllProductsByDiscount({
        discount_shopId: req.user._id,
        discount_code: req.body.discount_code.toUpperCase(),
      }),
    }).send(res);
  };

  getDiscountsAmount = async (req, res, next) => {
    new OK({
      message: "getDiscountsAmount OK",
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
