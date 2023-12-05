"use strict";
const util = require("util");
const logger = require("../log");

const { ForbiddenRequestError } = require("../core/errorResponse");
const { convertToObjectId } = require("../utils/getInfo");
const { findReviewsRepo } = require("../repositories/review.repo");

class ReviewServices {
  static getReviewsByShop = async ({ shopId }) => {
    return await findReviewsRepo({ shopId: convertToObjectId(shopId) });
  };
  static getReviewsByProduct = async ({ productId }) => {
    return await findReviewsRepo({ productId: convertToObjectId(productId) });
  };
}

module.exports = ReviewServices;
