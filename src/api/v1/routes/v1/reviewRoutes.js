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

module.exports = reviewRoutes;
