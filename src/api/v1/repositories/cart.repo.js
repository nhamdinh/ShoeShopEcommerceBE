"use strict";
const util = require("util");
const logger = require("../log");
const CartModel = require("../Models/CartModel");
const { getUnSelectData } = require("../utils/getInfo");

const createCartRepo = async (cart) => {
  return await CartModel.create(cart);
};

const findOneRepo = async ({ filter }) => {
  return await CartModel.findOne({ filter });
};
module.exports = {
  createCartRepo,
  findOneRepo,
};
