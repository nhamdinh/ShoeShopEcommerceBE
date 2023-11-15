"use strict";
const express = require("express");
const asyncHandler = require("express-async-handler");

const { protect, admin } = require("./../../Middleware/AuthMiddleware");
const inventoryController = require("../../controller/inventory.controller");
const InventoryRoute = express.Router();

// GET ALL INVENTORY
InventoryRoute.get("/all", asyncHandler(inventoryController.getAllInventories));
module.exports = InventoryRoute;
