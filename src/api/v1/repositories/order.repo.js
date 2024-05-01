"use strict";
const util = require("util");
const logger = require("../log");
const OrderModel = require("../Models/OrderModel");
const { getUnSelectData, getSelectData } = require("../utils/getInfo");
const { updateAllRepo } = require("./updateDB.repo");

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

const findOrdersByShopRepo = async ({
  limit,
  sort,
  page,
  filter,
  select = [],
}) => {
  // updateAllRepo();

  const skip = (page < 1 ? 1 : page - 1) * limit;
  // const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const sortBy = Object.keys(sort).length ? { ...sort } : { _id: -1 };
  const { shopId } = filter;

  const count = await OrderModel.countDocuments({
    ...filter,
  });

  const countAll = await OrderModel.countDocuments({
    shopId,
  });

  const isPaid = await OrderModel.countDocuments({
    shopId,
    isPaid: true,
  });

  const isDelivered = await OrderModel.countDocuments({
    shopId,
    isDelivered: true,
  });

  const isCanceled = await OrderModel.countDocuments({
    shopId,
    isCanceled: true,
  });

  const isRefunded = await OrderModel.countDocuments({
    shopId,
    isRefunded: true,
  });

  const isNotPaid = await OrderModel.countDocuments({
    shopId,
    isPaid: false,
  });

  const orders = await OrderModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    // .populate({ path: "shopId" })
    .select(getSelectData(select))
    .lean();

  return {
    countAll: +countAll ?? 0,
    totalCount: +count ?? 0,
    isDelivered: +isDelivered ?? 0,
    isPaid: +isPaid ?? 0,
    isCanceled: +isCanceled ?? 0,
    isRefunded: +isRefunded ?? 0,
    isNotPaid: +isNotPaid ?? 0,
    totalPages: Math.ceil(count / limit),
    page: +page,
    limit: +limit,
    orders: orders,
  };
};

module.exports = {
  createOrderRepo,
  findOrdersRepo,
  getOrderByIdRepo,
  findOrdersByShopRepo,
};
