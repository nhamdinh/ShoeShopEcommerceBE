const express = require("express");
const asyncHandler = require("express-async-handler");

const users = require("../../data/users");
const User = require("../../Models/UserModel");

const products = require("../../data/products");
const Product = require("../../Models/ProductModel");

const categorys = require("../../data/categorys");
const Category = require("../../Models/CategoryModel");

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
ImportData.post(
  "/categorys",
  asyncHandler(async (req, res) => {
    await Category.remove({});
    const importCategorys = await Category.insertMany(categorys);
    res.send({ importCategorys });
  })
);

module.exports = ImportData;
