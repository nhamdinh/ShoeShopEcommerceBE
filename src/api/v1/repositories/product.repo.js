"use strict";

const ProductModel = require("../Models/ProductModel");

const createProductRepo = async (product) => {
  return await ProductModel.product.create({ ...product });
};
const createProductTypeRepo = async (type, product) => {
  return await ProductModel[type].create({ ...product });
};

module.exports = {
  createProductTypeRepo,
  createProductRepo,
};
