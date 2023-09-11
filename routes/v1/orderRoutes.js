const express = require("express");
const asyncHandler = require("express-async-handler");

const { protect, admin } = require("../../src/api/v1/Middleware/AuthMiddleware");

const Order = require("../../src/api/v1/Models/OrderModel");
const Cart = require("../../src/api/v1/Models/CartModel");
const User = require("../../src/api/v1/Models/UserModel");
const Product = require("../../src/api/v1/Models/ProductModel");

const orderRouter = express.Router();

// CREATE ORDER
orderRouter.post(
  "/create-order",
  protect,
  asyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      cart,
      shippingPrice,
      totalPriceItems,
      totalPrice,
      user,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: "No order items" });
      throw new Error("No order items");
      return;
    } else {
      const order = new Order({
        orderItems,
        user: {
          ...user,
          user: req.user._id,
        },
        userId: req.user._id,
        shippingAddress,
        paymentMethod,
        taxPrice,
        cart,
        shippingPrice,
        totalPriceItems,
        totalPrice,
      });
      const createOrder = await order.save();
      const cart1 = await Cart.findById(cart);

      if (cart1) {
        cart1.deletedAt = Date.now();
        const updatedCart = await cart1.save();
      } else {
        res.status(404).json({ message: "Cart not Found" });
        throw new Error("Cart not found");
      }

      res.status(201).json(createOrder);
    }
  })
);

// ADMIN GET ALL ORDERS
orderRouter.get(
  "/all-admin",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const searchBy = req.query?.searchBy || "email";

    const keyword = req.query?.keyword
      ? searchBy === "email"
        ? {
            "user.email": {
              $regex: req.query?.keyword,
              $options: "i",
            },
          }
        : {
            "user.phone": {
              $regex: req.query?.keyword,
              $options: "i",
            },
          }
      : {};

    const orders = await Order.find({ ...keyword }).sort({ createdAt: -1 });
    // .populate("user", "id name email phone")
    // .populate("shippingAddress", "id street city postalCode country");

    res.json(orders);
  })
);
// USER GET ALL ORDERS
orderRouter.get(
  "/all",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.find({ userId: req.user._id }).sort({ _id: -1 });
    res.json(order);
  })
);

// GET ORDER BY ID
orderRouter.get(
  "/detail/:id",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    // .populate("user", "name email phone")
    // .populate("shippingAddress", "id street city postalCode country");

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not Found" });
      throw new Error("Order Not Found");
    }
  })
);

// ORDER IS PAID
orderRouter.put(
  "/:id/pay",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();

      /* ADD  product TO user.buyer */
      const user = await User.findById(req.user._id);
      const buyerArr = user?.buyer;
      let orderItems = [];
      order?.orderItems?.map((or) => {
        orderItems.push(or?.product);
      });

      const arr = Array.from(new Set([...buyerArr, ...orderItems]));
      user.buyer = [...arr];
      await user.save();
      /* ADD  product TO user.buyer */

      let productList = [];

      /* UPDATE countInStock product */
      order?.orderItems?.map((or) => {
        productList.push({
          id: or?.product,
          qty: or?.qty,
        });
      });

      for (let i = 0; i < productList.length; i++) {
        const product = await Product.findById(productList[i]?.id);
        if (product) {
          product.countInStock =
            Number(product?.countInStock) - Number(productList[i]?.qty);
          await product.save();
        }
      }
      /* UPDATE countInStock product */

      res.status(201).json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not Found" });
      throw new Error("Order Not Found");
    }
  })
);

// ORDER IS PAID
orderRouter.put(
  "/:id/delivered",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not Found" });
      throw new Error("Order Not Found");
    }
  })
);

// GET ALL ORDERS
orderRouter.get(
  "/get-all",
  asyncHandler(async (req, res) => {
    const count = await Order.countDocuments({});
    const orders = await Order.find({}).sort({ createdAt: -1 });
    // .populate("user", "id name email phone")
    // .populate("shippingAddress", "id street city postalCode country");
    res.json({ count, orders });
  })
);

module.exports = orderRouter;
