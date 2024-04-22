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

// GET ALL ORDERS BY USER
orderRoute.get(
  "/all",
  protect,
  asyncHandler(orderController.getAllOrderByUser)
);

// GET ORDER BY ID
orderRoute.get(
  "/detail/:id",
  protect,
  asyncHandler(orderController.getOrderById)
);

// ORDER IS PAID
orderRoute.put("/:id/pay", protect, asyncHandler(orderController.orderIsPaid));

// ORDER IS DELIVERED
orderRoute.put(
  "/:id/delivered",
  protect,
  admin,
  asyncHandler(orderController.orderIsDelivered)
);

// ADMIN GET ALL ORDERS
orderRoute.get(
  "/all-admin",
  protect,
  admin,
  asyncHandler(orderController.getAllOrderByAdmin)
);

// GET ORDERS BY SHOP
orderRoute.put(
  "/all-by-shop",
  // protect,
  asyncHandler(orderController.findAllOrdersByShop)
);


module.exports = orderRoute;

// const express = require("express");

// const { protect, admin } = require("./../../Middleware/AuthMiddleware");

// const {
//   getAllOrder,
// } = require("../../controller/order.controller");

// const orderRouter = express.Router();

// // GET ALL ORDERS
// orderRouter.get("/get-all", getAllOrder);

// module.exports = orderRouter;
