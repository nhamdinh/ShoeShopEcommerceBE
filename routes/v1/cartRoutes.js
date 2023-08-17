const express = require("express");
const asyncHandler = require("express-async-handler");

const PAGE_SIZE = require("../../common/constant");
const Cart = require("../../Models/CartModel");
const protect = require("../../Middleware/AuthMiddleware");

const cartRoute = express.Router();

// GET ALL CART
cartRoute.get(
  "/get-all",
  asyncHandler(async (req, res) => {
    const count = await Cart.countDocuments({});
    const carts = await Cart.find({});
    res.json({ count, carts });
  })
);

// CREATE CART
cartRoute.post(
  "/create-cart",
  protect,
  asyncHandler(async (req, res) => {
    const cartArr = await Cart.find({ user: req.user._id });

    let createCart;
    if (cartArr.length > 0) {
      createCart = cartArr[0];
    } else {
      const cart = new Cart({ user: req.user._id });
      createCart = await cart.save();
    }
    res.status(201).json(createCart);
  })
);

// GET SINGLE CART
cartRoute.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const cart = await Cart.findById(req.params.id);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404);
      throw new Error("Cart not Found");
    }
  })
);

module.exports = cartRoute;
