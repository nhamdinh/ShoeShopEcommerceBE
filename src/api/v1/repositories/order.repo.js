"use strict";
const util = require("util");
const logger = require("../log");
const OrderModel = require("../Models/OrderModel");
const { getUnSelectData } = require("../utils/getInfo");

const createOrderRepo = async (order) => {
  return await OrderModel.create(order);
};

const findOrdersRepo = async (filter) => {
  return await OrderModel.find(filter)
    .populate("userId")
    .populate("shopId")
    .populate("cartId")
    .populate("shippingAddress")
    .sort({
      _id: -1,
    })
    .lean();
};

const getOrderByIdRepo = async (id) => {
  return await OrderModel.findById(id)
    .populate("userId")
    .populate("shopId")
    .populate("cartId")
    .populate("shippingAddress")
    .lean();
};

module.exports = {
  createOrderRepo,
  findOrdersRepo,
  getOrderByIdRepo,
};
