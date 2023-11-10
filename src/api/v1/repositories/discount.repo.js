"use strict";

const DiscountModel = require("../Models/DiscountModel");

const createDiscountRepo = async (discount) => {
  return await DiscountModel.create(discount);
};

const findOneDiscountRepo = async (query) => {
  return await DiscountModel.findOne(query).lean();
};

module.exports = {
  createDiscountRepo,
  findOneDiscountRepo,
};
