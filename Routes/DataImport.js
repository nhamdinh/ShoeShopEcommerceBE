const express = require("express");
const asyncHandler = require("express-async-handler");

const users = require("../data/users");
const User = require("../Models/UserModel");
const products = require("../data/products");
const Product = require("../Models/ProductModel");

const ImportData = express.Router();

ImportData.post(
  "/users",
  asyncHandler(async (req, res) => {
    await User.remove({});
    const importUser = await User.insertMany(users);
    res.send({ importUser });
  })
);

ImportData.post(
  "/products",
  asyncHandler(async (req, res) => {
    await Product.remove({});
    const importProducts = await Product.insertMany(products);
    res.send({ importProducts });
  })
);

module.exports = ImportData;
