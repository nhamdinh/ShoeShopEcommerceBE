const express = require("express");
const asyncHandler = require("express-async-handler");

const { protect, admin } = require("./../../Middleware/AuthMiddleware");

const ReviewController = require("../../controller/review.controller");

const reviewRoutes = express.Router();

// GET REVIEWS BY SHOP
reviewRoutes.get(
  "/get-by-shop",
  protect,
  asyncHandler(ReviewController.getReviewsByShop)
);

// GET REVIEWS BY PRODUCT
reviewRoutes.get(
  "/get-by-product/:id",
  asyncHandler(ReviewController.getReviewsByProduct)
);

module.exports = reviewRoutes;
