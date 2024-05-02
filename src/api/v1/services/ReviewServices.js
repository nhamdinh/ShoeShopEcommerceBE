"use strict";
const util = require("util");
const logger = require("../log");

const { ForbiddenRequestError } = require("../core/errorResponse");
const { convertToObjectId } = require("../utils/getInfo");
const { findReviewsRepo } = require("../repositories/review.repo");

class ReviewServices {
  static getReviewsByShop = async ({ query, user }) => {
    const {
      shopId,
      limit = 50,
      page = 1,
      sort = { _id: -1 },
      unSelect = [
        // "product_name",
        // "product_shop",
        // "product_price",
        // "product_original_price",
        // "product_thumb",
        // "isDraft",
        // "isPublished",
      ],
    } = query;

    if (user?._id.toString() !== shopId?.toString())
      throw new ForbiddenRequestError("You are not Owner", 403);

    // logger.info(
    //   `user ::: ${util.inspect(user, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );

    return await findReviewsRepo({
      filter: { shopId: convertToObjectId(shopId) },
      limit,
      sort,
      page,
      unSelect,
    });
  };
  static getReviewsByProduct = async ({ productId, query }) => {
    const {
      limit = 50,
      page = 1,
      sort = { _id: -1 },
      unSelect = [
        // "product_name",
        // "product_shop",
        // "product_price",
        // "product_original_price",
        // "product_thumb",
        // "isDraft",
        // "isPublished",
      ],
    } = query;

    return await findReviewsRepo({
      filter: { productId: convertToObjectId(productId) },
      limit,
      sort,
      page,
      unSelect,
    });
  };
}

module.exports = ReviewServices;
