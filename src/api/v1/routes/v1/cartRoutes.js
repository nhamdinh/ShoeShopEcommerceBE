const express = require("express");
const asyncHandler = require("express-async-handler");

const { protect } = require("./../../Middleware/AuthMiddleware");
const cartController = require("../../controller/cart.controller");
// const {
//   getAllCart,
//   checkCart,
//   createCart,
//   getCartById,
//   deleteItemFromCart,
// } = require("../../controller/cart.controller");

const cartRouter = express.Router();

// ADD-TO-CART
cartRouter.post(
  "/add-to-cart",
  protect,
  asyncHandler(cartController.addProductToCart)
);

// // GET ALL CART
// cartRoute.get("/get-all", getAllCart);

// // CHECK EXIST CART
// cartRoute.get("/check-cart", protect, checkCart);

// // CREATE CART
// cartRoute.post("/create-cart", protect, createCart);

// // GET SINGLE CART
// cartRoute.get("/:id", getCartById);

// // REMOVE ITEM FROM CART
// cartRoute.put("/:id/remove", protect, deleteItemFromCart);

module.exports = cartRouter;
