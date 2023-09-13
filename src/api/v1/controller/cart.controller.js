const asyncHandler = require("express-async-handler");

const Cart = require("../Models/CartModel");

const getAllCart = asyncHandler(async (req, res) => {
  try {
    const count = await Cart.countDocuments({});
    const carts = await Cart.find({}).sort({ createdAt: -1 });
    res.json({ count, carts });
  } catch (error) {
    throw new Error(error);
  }
});

const getCartById = asyncHandler(async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not Found" });
      throw new Error("Cart not Found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const createCart = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    throw new Error(error);
  }
});

const deleteItemFromCart = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    throw new Error(error);
  }
});

const checkCart = asyncHandler(async (req, res) => {
  try {
    const cartArr = await Cart.find({ user: req.user._id, deletedAt: null });
    let createCart = { cartItems: [] };
    if (cartArr.length > 0) {
      createCart = cartArr[0];
    }
    res.status(201).json(createCart);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  getAllCart,
  checkCart,
  createCart,
  getCartById,
  deleteItemFromCart,
};
