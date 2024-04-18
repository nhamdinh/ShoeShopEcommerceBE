"use strict";
const ReviewServices = require("./../services/ReviewServices");
const { OK } = require("../core/successResponse");

class ReviewController {
  getReviewsByShop = async (req, res) => {
    new OK({
      message: "getReviewsByShop OK",
      metadata: await ReviewServices.getReviewsByShop({
        shopId: req.user._id,
      }),
    }).send(res);
  };

  getReviewsByProduct = async (req, res) => {
    new OK({
      message: "getReviewsByProduct OK",
      metadata: await ReviewServices.getReviewsByProduct({
        productId: req.params?.id,
      }),
    }).send(res);
  };
}

module.exports = new ReviewController();
