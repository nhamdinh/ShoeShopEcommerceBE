"use strict";
const util = require("util");
const logger = require("../log");
const DiscountModel = require("../Models/DiscountModel");
const { getUnSelectData } = require("../utils/getInfo");

const createDiscountRepo = async (discount) => {
  return await DiscountModel.create(discount);
};

const findOneDiscountRepo = async (query) => {
  return await DiscountModel.findOne(query).lean();
};

const getAllDiscountsByShopRepo = async ({
  limit,
  page,
  sort,
  filter,
  unSelect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = Object.keys(sort).length ? { ...sort } : { _id: -1 };

  const count = await DiscountModel.countDocuments({
    ...filter,
  });

  const discounts = await DiscountModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean();

  return {
    totalCount: +count ?? 0,
    totalPages: Math.ceil(count / limit),
    page: +page,
    limit: +limit,
    discounts,
  };
};

const deleteDiscountByShopRepo = async ({ codeId, discount_shopId }) => {
  return null;
};

module.exports = {
  createDiscountRepo,
  findOneDiscountRepo,
  getAllDiscountsByShopRepo,
  deleteDiscountByShopRepo,
};
