const express = require("express");
const asyncHandler = require("express-async-handler");

const Cart = require("../../src/api/v1/Models/CartModel");
const { protect } = require("../../src/api/v1/Middleware/AuthMiddleware");

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
    let createCart = { cartItems: [] };
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
      cartArr[0].cartItems?.map((caDb) => {
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
      res.status(404).json({ message: "Cart not Found" });
      throw new Error("Cart not Found");
    }
  })
);
// REMOVE ITEM FROM CART
cartRoute.put(
  "/:id/remove",
  protect,
  asyncHandler(async (req, res) => {
    const { product } = req.body;
    const cart = await Cart.findById(req.params.id);
    if (cart) {
      let cartItems = cart?.cartItems;
      let cartItems_temp = [];
      cartItems?.map((it) => {
        if (it?.product.toString() !== product?.toString()) {
          cartItems_temp.push(it);
        }
      });
      cart.cartItems = cartItems_temp;
      const updateCart = await cart.save();

      res.json(updateCart);
    } else {
      res.status(404).json({ message: "Cart not Found" });
      throw new Error("Cart not Found");
    }
  })
);

module.exports = cartRoute;
