"use strict";

const SkuModel = require("../Models/sku.model");
const { getSelectData } = require("../utils/getInfo");

const createSkusRepo = async (skus) => {
  return await SkuModel.create(skus);
};

module.exports = {
  createSkusRepo,
};
