const express = require("express");
const asyncHandler = require("express-async-handler");

const users = require("./../../dataMock/users");
const User = require("./../../Models/UserModel");

const products = require("./../../dataMock/products");
const ProductModel = require("../../Models/ProductModel");

const categorys = require("./../../dataMock/categorys");
const Category = require("./../../Models/CategoryModel");

const brands = require("./../../dataMock/brands");
const Brand = require("./../../Models/BrandModel");

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
    await ProductModel.product.remove({});
    const importProducts = await ProductModel.product.insertMany(products);
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
