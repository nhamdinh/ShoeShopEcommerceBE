const express = require("express");
const asyncHandler = require("express-async-handler");

const { protect, admin } = require("./../../Middleware/AuthMiddleware");

const { validate } = require("../../validations");
const thuDungGioController = require("../../controller/thuDungGio.controller");

const thuDungGioRouter = express.Router();

// CREATE ThuDungGio
thuDungGioRouter.post(
  "/create",
  protect,
  validate.validateRegisterUser(),
  asyncHandler(thuDungGioController.createThuDungGio)
);

// findThuDungGioById ThuDungGio
thuDungGioRouter.post(
  "/detail",
  protect,

  asyncHandler(thuDungGioController.findThuDungGioById)
);

// updatedOrderPay ThuDungGio
thuDungGioRouter.put(
  "/updatedOrderPay",
  protect,
  asyncHandler(thuDungGioController.updatedOrderPay)
);

// updatedOrderById ThuDungGio
thuDungGioRouter.put(
  "/updatedOrderById",
  protect,
  asyncHandler(thuDungGioController.updatedOrderById)
);

// // ADMIN GET ALL ThuDungGio
thuDungGioRouter.get(
  "/all-admin",
  protect,
  asyncHandler(thuDungGioController.getAllThuDungGios)
);

// GET ALL ThuDungGio
thuDungGioRouter.get(
  "/get-all",
  protect,
  asyncHandler(thuDungGioController.getAllThuDungGios)
);

module.exports = thuDungGioRouter;
