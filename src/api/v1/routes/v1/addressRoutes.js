const express = require("express");
const { protect } = require("./../../Middleware/AuthMiddleware");

const {
  getAllAddress,
  checkExistAddress,
  createAddress,
  getAddressById,
} = require("../../controller/address.controller");

const addressRoute = express.Router();

// GET ALL ADDRESS
addressRoute.get("/get-all", getAllAddress);

// CHECK EXIST ADDRESS
addressRoute.get("/check-address", protect, checkExistAddress);

// CREATE ADDRESS
addressRoute.post("/create-address", protect, createAddress);

// GET SINGLE ADDRESS
addressRoute.get("/:id", getAddressById);

module.exports = addressRoute;
