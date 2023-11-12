"use strict";

const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect, admin } = require("./../../Middleware/AuthMiddleware");

const { validate } = require("../../validations");
const discountController = require("../../controller/discount.controller");

const DiscountRouter = express.Router();

// REGISTER
DiscountRouter.post(
  "/create",
  protect,
  asyncHandler(discountController.createDiscount)
);

// GET ALL DISCOUNTS BY SHOP
DiscountRouter.get(
  "/get-all-by-shop",
  protect,
  asyncHandler(discountController.getAllDiscountsByShop)
);

// GET ALL PRODUCTS BY DISCOUNT
DiscountRouter.post(
  "/get-products-by-discount",
  protect,
  asyncHandler(discountController.getAllProductsByDiscount)
);

// GET-DISCOUNT-AMOUNT
DiscountRouter.post(
  "/get-discount-amount",
  protect,
  asyncHandler(discountController.getDiscountsAmount)
);

module.exports = DiscountRouter;
