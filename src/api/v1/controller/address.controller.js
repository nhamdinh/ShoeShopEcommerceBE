const asyncHandler = require("express-async-handler");

const Address = require("../Models/Address");

const getAllAddress = asyncHandler(async (req, res) => {
  try {
    const count = await Address.countDocuments({});
    const address = await Address.find({});
    res.json({ count, address });
  } catch (error) {
    throw new Error(error);
  }
});

const checkExistAddress = asyncHandler(async (req, res) => {
  try {
    const addressArr = await Address.find({ user: req.user._id });
    let createAddress = {};
    if (addressArr.length > 0) {
      createAddress = addressArr[0];
    } else {
      createAddress = { error: "User have Address YET" };
    }
    res.status(201).json(createAddress);
  } catch (error) {
    throw new Error(error);
  }
});

const createAddress = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    throw new Error(error);
  }
});

const getAddressById = asyncHandler(async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (address) {
      res.json(address);
    } else {
      res.status(404).json({ message: "Address not Found" });
      throw new Error("Address not Found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  getAllAddress,
  checkExistAddress,
  createAddress,
  getAddressById,
};
