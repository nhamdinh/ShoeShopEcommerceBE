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
    const carts = await Cart.find({}).sort({ createdAt: -1 });
    res.json({ count, carts });
  })
);

// CHECK EXIST CART
cartRoute.get(
  "/check-cart",
  protect,
  asyncHandler(async (req, res) => {
    const cartArr = await Cart.find({ user: req.user._id, deletedAt: null });
    let createCart = {};
    if (cartArr.length > 0) {
      createCart = cartArr[0];
    }
    res.status(201).json(createCart);
  })
);

// CREATE CART
cartRoute.post(
  "/create-cart",
  protect,
  asyncHandler(async (req, res) => {
    const { cartItems } = req.body;

    const cartArr = await Cart.find({ user: req.user._id, deletedAt: null });

    let createCart;
    if (cartArr.length > 0) {
      let hasItem = false;
      cartArr[0].cartItems.map((caDb) => {
        if (caDb?.product === cartItems[0]?.product) {
          caDb.qty = cartItems[0]?.qty;
          hasItem = true;
        }
      });

      if (!hasItem)
        cartArr[0].cartItems = [...cartItems, ...cartArr[0].cartItems];
      createCart = await cartArr[0].save();
    } else {
      const cart = new Cart({ user: req.user._id, cartItems });
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
