"use strict";

const SkuModel = require("../Models/sku.model");
const { getSelectData, getUnSelectData } = require("../utils/getInfo");

const createSkusRepo = async (skus) => {
  return await SkuModel.create(skus);
};

const findSkusRepo = async ({ limit, sort, page, filter, unSelect = [] }) => {
  const skip = (page < 1 ? 1 : page - 1) * limit;
  // const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const sortBy = Object.keys(sort).length ? { ...sort } : { _id: -1 };

  const count = await SkuModel.countDocuments({
    ...filter,
  });

  const skus = await SkuModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    // .populate({ path: "sku_product_id" })
    .select(getUnSelectData(unSelect))
    .lean();

  return {
    totalCount: +count ?? 0,
    totalPages: Math.ceil(count / limit),
    page: +page,
    limit: +limit,
    skus,
  };
};

const findSkuByIdRepo = async ({ id, unSelect = [] }) => {
  return await SkuModel.findById(id)
    // .populate({ path: "sku_product_id" })
    .select(getUnSelectData(unSelect))
    .lean();
};

module.exports = {
  createSkusRepo,
  findSkusRepo,
  findSkuByIdRepo,
};
