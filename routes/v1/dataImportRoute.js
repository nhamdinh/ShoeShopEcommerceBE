const express = require("express");
const asyncHandler = require("express-async-handler");

const users = require("../../src/api/v1/dataMock/users");
const User = require("../../src/api/v1/Models/UserModel");

const products = require("../../src/api/v1/dataMock/products");
const Product = require("../../src/api/v1/Models/ProductModel");

const categorys = require("../../src/api/v1/dataMock/categorys");
const Category = require("../../src/api/v1/Models/CategoryModel");

const brands = require("../../src/api/v1/dataMock/brands");
const Brand = require("../../src/api/v1/Models/BrandModel");

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

ImportData.post(
  "/brands",
  asyncHandler(async (req, res) => {
    await Brand.remove({});
    const importBrands = await Brand.insertMany(brands);
    res.send({ importBrands });
  })
);

module.exports = ImportData;
