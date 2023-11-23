"use strict";
const express = require("express");
const asyncHandler = require("express-async-handler");

const { protect, admin } = require("./../../Middleware/AuthMiddleware");
const mainCodeController = require("../../controller/mainCode.controller");
const MainCodeRoutes = express.Router();

// GET ALL MAINCODES
MainCodeRoutes.get("/all", asyncHandler(mainCodeController.getAllMainCodes));

// CREATE MAINCODE
MainCodeRoutes.post(
  "/create",
  protect,
  asyncHandler(mainCodeController.createMainCode)
);
module.exports = MainCodeRoutes;
