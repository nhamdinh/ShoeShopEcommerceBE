"use strict";
const express = require("express");
const asyncHandler = require("express-async-handler");

const { protect, admin } = require("./../../Middleware/AuthMiddleware");
const inventoryController = require("../../controller/inventory.controller");
const InventoryRoute = express.Router();

// GET ALL INVENTORY
InventoryRoute.get("/all", asyncHandler(inventoryController.getAllInventories));

// GET ALL SKU BY SHOP
InventoryRoute.put(
  "/get-skus-by-shop",
  protect,
  asyncHandler(inventoryController.getSkusByShop)
);

// UPDATE-STATUS-SKUS-BY-SHOP
InventoryRoute.put(
    "/update-status-skus-by-shop",
    protect,
    asyncHandler(inventoryController.updateStatusSkusByShop)
  );

module.exports = InventoryRoute;
