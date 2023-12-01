"use strict";
const util = require("util");
const logger = require("../log");
const OrderModel = require("../Models/OrderModel");
const { getUnSelectData } = require("../utils/getInfo");

const createOrderRepo = async (order) => {
  return await OrderModel.create(order);
};

module.exports = {
  createOrderRepo,
};
