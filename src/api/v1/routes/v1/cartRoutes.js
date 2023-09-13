const express = require("express");
const { protect } = require("./../../Middleware/AuthMiddleware");
const {
  getAllCart,
  checkCart,
  createCart,
  getCartById,
  deleteItemFromCart,
} = require("../../controller/cart.controller");

const cartRoute = express.Router();

// GET ALL CART
cartRoute.get("/get-all", getAllCart);

// CHECK EXIST CART
cartRoute.get("/check-cart", protect, checkCart);

// CREATE CART
cartRoute.post("/create-cart", protect, createCart);

// GET SINGLE CART
cartRoute.get("/:id", getCartById);

// REMOVE ITEM FROM CART
cartRoute.put("/:id/remove", protect, deleteItemFromCart);

module.exports = cartRoute;
