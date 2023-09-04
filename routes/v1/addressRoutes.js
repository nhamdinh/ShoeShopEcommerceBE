const express = require("express");
const asyncHandler = require("express-async-handler");

const { PAGE_SIZE } = require("../../common/constant");
const Address = require("../../Models/Address");
const { protect } = require("../../Middleware/AuthMiddleware");

const addressRoute = express.Router();

// GET ALL ADDRESS
addressRoute.get(
  "/get-all",
  asyncHandler(async (req, res) => {
    const count = await Address.countDocuments({});
    const address = await Address.find({});
    res.json({ count, address });
  })
);

// CHECK EXIST ADDRESS

addressRoute.get(
  "/check-address",
  protect,
  asyncHandler(async (req, res) => {
    const addressArr = await Address.find({ user: req.user._id });
    let createAddress = {};
    if (addressArr.length > 0) {
      createAddress = addressArr[0];
    } else {
      createAddress = { error: "User have Address YET" };
    }
    res.status(201).json(createAddress);
  })
);

// CREATE ADDRESS
addressRoute.post(
  "/create-address",
  protect,
  asyncHandler(async (req, res) => {
    const { street, city, postalCode, country } = req.body;
    const addressArr = await Address.find({ user: req.user._id });
    let createAddress;
    if (addressArr.length > 0) {
      createAddress = addressArr[0];

      createAddress.street = street || createAddress.street;
      createAddress.city = city || createAddress.city;
      createAddress.postalCode = postalCode || createAddress.postalCode;
      createAddress.country = country || createAddress.country;

      createAddress = await createAddress.save();
    } else {
      const address = new Address({
        user: req.user._id,
        street,
        city,
        postalCode,
        country,
      });
      createAddress = await address.save();
    }
    res.status(201).json(createAddress);
  })
);

// GET SINGLE ADDRESS
addressRoute.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const address = await Address.findById(req.params.id);
    if (address) {
      res.json(address);
    } else {
      res.status(404).json({ message: "Address not Found" });
      throw new Error("Address not Found");
    }
  })
);


// CREATE ADDRESS










module.exports = addressRoute;
