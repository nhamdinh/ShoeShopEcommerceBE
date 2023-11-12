"use strict";

const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const generateRefreshToken = require("../utils/generateRefreshToken");
const crypto = require("node:crypto");

const { validationResult } = require("express-validator");

const ChatStory = require("../Models/ChatStoryModel");
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
      metadata: await DiscountServices.createDiscount(req.body),
    }).send(res);
  };

  getAllDiscountsByShop = async (req, res, next) => {
    new OK({
      message: "getAllDiscountsByShop OK",
      metadata: await DiscountServices.getAllDiscountsByShop({
        discount_shopId: req.user._id,
      }),
    }).send(res);
  };

  getAllProductsByDiscount = async (req, res, next) => {
    new OK({
      message: "getAllProductsByDiscount OK",
      metadata: await DiscountServices.getAllProductsByDiscount({
        discount_shopId: req.user._id,
        discount_code: req.body.discount_code,
      }),
    }).send(res);
  };

  // getProfile = async (req, res) => {
  //   new OK({
  //     message: "getProfile OK",
  //     metadata: await UserServices.getProfile(req),
  //   }).send(res);
  // };
  // login = async (req, res) => {
  //   new OK({
  //     message: "login OK",
  //     metadata: await UserServices.login(req),
  //   }).send(res);
  // };
}

module.exports = new DiscountController();
