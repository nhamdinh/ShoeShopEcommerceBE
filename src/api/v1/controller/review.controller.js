"use strict";

const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const generateRefreshToken = require("../utils/generateRefreshToken");
const crypto = require("node:crypto");

const { validationResult } = require("express-validator");

const User = require("../Models/UserModel");
const ChatStory = require("../Models/ChatStoryModel");
const logger = require("../log");
const { COOKIE_REFRESH_TOKEN } = require("../utils/constant");
const KeyTokenServices = require("../services/KeyTokenServices");
const { createToken } = require("../utils/authUtils");
const { getInfoData } = require("../utils/getInfo");
const { ForbiddenRequestError } = require("../core/errorResponse");
const ReviewServices = require("./../services/ReviewServices");
const { CREATED, OK } = require("../core/successResponse");

class ReviewController {
  getReviewsByShop = async (req, res) => {
    new OK({
      message: "getReviewsByShop OK",
      metadata: await ReviewServices.getReviewsByShop({
        shopId: req.user._id,
      }),
    }).send(res);
  };
}

module.exports = new ReviewController();
