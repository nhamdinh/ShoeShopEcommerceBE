"use strict";
const util = require("util");
const logger = require("../log");
const CartModel = require("../Models/CartModel");
const { getUnSelectData } = require("../utils/getInfo");

const findOneAndUpdateRepo = async (query, updateOrInsert, options) => {

  const xxx= await CartModel.findOneAndUpdate(query, updateOrInsert, options);

  logger.info(
    `xxx ::: ${util.inspect(
      xxx,
      {
        showHidden: false,
        depth: null,
        colors: false,
      }
    )}`
  );
  return xxx
};

const findOneRepo = async ({ filter }) => {
  return await CartModel.findOne({ filter });
};

const updateCartRepo = async (cart) => {
  return await CartModel.save(cart);
};
module.exports = {
  findOneAndUpdateRepo,
  findOneRepo,
  updateCartRepo,
};
