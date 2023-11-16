"use strict";
const express = require("express");
const asyncHandler = require("express-async-handler");

const { protect, admin } = require("./../../Middleware/AuthMiddleware");
const orderController = require("../../controller/order.controller");
const orderRoute = express.Router();

// // GET ALL INVENTORY
// orderRoute.get("/all", asyncHandler(inventoryController.getAllInventories));

// CHECKOUT-CART
orderRoute.post(
  "/checkout-cart",
  protect,
  asyncHandler(orderController.checkoutReviewCart)
);

// CHECKOUT-ORDER
orderRoute.post(
  "/checkout-order",
  protect,
  asyncHandler(orderController.checkoutOrder)
);
module.exports = orderRoute;

// const express = require("express");

// const { protect, admin } = require("./../../Middleware/AuthMiddleware");

// const {
//   getAllOrderByAdmin,
//   getAllOrder,
//   getAllOrderByUser,
//   getOrderById,
//   createOrder,
//   orderIsPaid,
//   orderIsDelivered,
// } = require("../../controller/order.controller");

// const orderRouter = express.Router();

// // GET ALL ORDERS
// orderRouter.get("/get-all", getAllOrder);

// // ADMIN GET ALL ORDERS
// orderRouter.get("/all-admin", protect, admin, getAllOrderByAdmin);

// // GET ALL ORDERS BY USER
// orderRouter.get("/all", protect, getAllOrderByUser);

// // CREATE ORDER
// orderRouter.post("/create-order", protect, createOrder);

// // GET ORDER BY ID
// orderRouter.get("/detail/:id", protect, getOrderById);

// // ORDER IS PAID
// orderRouter.put("/:id/pay", protect, orderIsPaid);

// // ORDER IS DELIVERED
// orderRouter.put("/:id/delivered", protect, admin, orderIsDelivered);

// module.exports = orderRouter;
