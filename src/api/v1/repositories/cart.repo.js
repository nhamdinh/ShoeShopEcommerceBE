"use strict";
const util = require("util");
const logger = require("../log");
const CartModel = require("../Models/CartModel");
const { getUnSelectData } = require("../utils/getInfo");

const findOneAndUpdateRepo = async (query, updateOrInsert, options) => {
  return await CartModel.findOneAndUpdate(query, updateOrInsert, options);
};

const findOneRepo = async ({ filter }) => {
  return await CartModel.findOne({ filter });
};

const findCartsRepo = async ({ filter }) => {
  return await CartModel.find(filter);
};

const createCartRepo = async (cart) => {
  return await CartModel.create(cart);
};

const updateCartRepo = async (cart) => {
  return await CartModel.save(cart);
};

const getAllCartRepo = async ({ filter }) => {
  const carts = await CartModel.find(filter).sort({
    createdAt: -1,
  });
  return {
    totalCount: carts?.length ?? 0,
    carts,
  };
};
module.exports = {
  findCartsRepo,
  findOneAndUpdateRepo,
  findOneRepo,
  updateCartRepo,
  createCartRepo,
  getAllCartRepo,
};
