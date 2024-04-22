"use strict";
const util = require("util");
const logger = require("../log");
const { CREATED, OK } = require("../core/successResponse");
const OrderServices = require("../services/OrderServices");

class OrderController {
  checkoutReviewCart = async (req, res, next) => {
    new OK({
      message: "checkoutReviewCart OK",
      metadata: await OrderServices.checkoutReviewCart({
        userId: req.user._id,
        cartsReview: req.body,
      }),
    }).send(res);
  };

  checkoutOrder = async (req, res, next) => {
    new OK({
      message: "checkoutOrder OK",
      metadata: await OrderServices.checkoutOrder({
        userId: req.user._id,
        cartsReview: req.body,
      }),
    }).send(res);
  };
  getAllOrderByUser = async (req, res, next) => {
    new OK({
      message: "getAllOrderByUser OK",
      metadata: await OrderServices.getAllOrderByUser({
        userId: req.user._id,
      }),
    }).send(res);
  };
  getOrderById = async (req, res, next) => {
    new OK({
      message: "getOrderById OK",
      metadata: await OrderServices.getOrderById({
        id: req.params.id,
      }),
    }).send(res);
  };

  orderIsPaid = async (req, res, next) => {
    new OK({
      message: "orderIsPaid OK",
      metadata: await OrderServices.orderIsPaid({
        id: req.params.id,
        body: req.body,
      }),
    }).send(res);
  };

  orderIsDelivered = async (req, res, next) => {
    new OK({
      message: "orderIsDelivered OK",
      metadata: await OrderServices.orderIsDelivered({
        id: req.params.id,
      }),
    }).send(res);
  };

  getAllOrderByAdmin = async (req, res, next) => {
    new OK({
      message: "getAllOrderByAdmin OK",
      metadata: await OrderServices.getAllOrderByAdmin({
        query: req.query,
      }),
    }).send(res);
  };

  findAllOrdersByShop = async (req, res, next) => {
    new OK({
      message: "findAllOrdersByShop OK",
      metadata: await OrderServices.findAllOrdersByShop({
        user: req.user,
        body: req.body,
      }),
      options: {
        product_shop: req.body.product_shop,
      },
    }).send(res);
  };
}

module.exports = new OrderController();

// const asyncHandler = require("express-async-handler");

// const Order = require("../Models/OrderModel");
// const Cart = require("../Models/CartModel");
// const Product = require("../Models/ProductModel");
// const User = require("../Models/UserModel");

// const getAllOrder = asyncHandler(async (req, res) => {
//   try {
//     const count = await Order.countDocuments({});
//     const orders = await Order.find({}).sort({ createdAt: -1 });
//     // .populate("user", "id name email phone")
//     // .populate("shippingAddress", "id street city postalCode country");
//     res.json({ count, orders });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// module.exports = {
//   getAllOrder,
//   getOrderById,
// };
