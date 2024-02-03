const express = require("express");
const asyncHandler = require("express-async-handler");

const { protect, admin } = require("./../../Middleware/AuthMiddleware");

const { validate } = require("../../validations");
const thuDungGioController = require("../../controller/thuDungGio.controller");

const thuDungGioRouter = express.Router();

// CREATE ThuDungGio
thuDungGioRouter.post(
  "/create",
  admin,
  validate.validateRegisterUser(),
  asyncHandler(thuDungGioController.createThuDungGio)
);

// findThuDungGioById ThuDungGio
thuDungGioRouter.post(
  "/detail",
  admin,

  asyncHandler(thuDungGioController.findThuDungGioById)
);

// updatedOrderPay ThuDungGio
thuDungGioRouter.put(
  "/updatedOrderPay",
  admin,

  asyncHandler(thuDungGioController.updatedOrderPay)
);

// updatedOrderById ThuDungGio
thuDungGioRouter.put(
  "/updatedOrderById",
  admin,
  asyncHandler(thuDungGioController.updatedOrderById)
);

// // ADMIN GET ALL ThuDungGio
thuDungGioRouter.get(
  "/all-admin",
  admin,
  thuDungGioController.getAllThuDungGios
);

// GET ALL ThuDungGio
thuDungGioRouter.get("/get-all", admin, thuDungGioController.getAllThuDungGios);

module.exports = thuDungGioRouter;
