const express = require("express");
const asyncHandler = require("express-async-handler");

const { protect, admin } = require("../../Middleware/AuthMiddleware");

const Order = require("../../Models/OrderModel");
const Cart = require("../../Models/CartModel");

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
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
      return;
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
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

      console.log(cart1);

      if (cart1) {
        cart1.deletedAt = Date.now();
        const updatedCart = await cart1.save();
      } else {
        res.status(404);
        throw new Error("User not found");
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
    const orders = await Order.find({})
      .sort({ _id: -1 })
      .populate("user", "id name email")
      .populate("shippingAddress", "id street city postalCode country");

    res.json(orders);
  })
);
// USER LOGIN ORDERS
orderRouter.get(
  "/all",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.find({ user: req.user._id }).sort({ _id: -1 });
    res.json(order);
  })
);

// GET ORDER BY ID
orderRouter.get(
  "/detail/:id",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("shippingAddress", "id street city postalCode country");

    if (order) {
      res.json(order);
    } else {
      res.status(404);
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
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order Not Found");
    }
  })
);

// ORDER IS PAID
orderRouter.put(
  "/:id/delivered",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order Not Found");
    }
  })
);

// GET ALL ORDERS
orderRouter.get(
  "/get-all",
  asyncHandler(async (req, res) => {
    const count = await Order.countDocuments({});
    const orders = await Order.find({})
      .sort({ _id: -1 })
      .populate("user", "id name email")
      .populate("shippingAddress", "id street city postalCode country");
    res.json({ count, orders });
  })
);

module.exports = orderRouter;
