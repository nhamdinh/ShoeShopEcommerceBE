"use strict";
const util = require("util");
const logger = require("../log");
const SkuModel = require("../Models/sku.model");
const {
  getSelectData,
  getUnSelectData,
  convertToObjectId,
} = require("../utils/getInfo");

const createSkusRepo = async (skus) => {
  return await SkuModel.create(skus);
};

const findSkuRepo = async ({ filter, unSelect = [] }) => {
  const sku = await SkuModel.findOne(filter)
    // .populate({ path: "sku_product_id" })
    .select(getUnSelectData(unSelect))
    .lean();

  return sku;
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

const updateSkuByIdRepo = async ({
  id,
  bodyUpdate,
  options = { upsert: false, new: true },
}) => {
  return await SkuModel.findByIdAndUpdate(id, bodyUpdate, options);
};

const findSkusRepo1 = async ({ sort, filter, unSelect = [] }) => {
  const sortBy = Object.keys(sort).length ? { ...sort } : { _id: -1 };

  const skus = await SkuModel.find(filter)
    .sort(sortBy)
    // .populate({ path: "sku_product_id" })
    .select(getUnSelectData(unSelect))
    .lean();

  return skus;
};

const findSkusByShopRepo = async ({
  limit,
  sort,
  page,
  filter,
  select = [],
  selectProduct = ["_id"],
}) => {
  const { sku_product_shop } = filter;

  const skip = (page < 1 ? 1 : page - 1) * limit;
  // const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const sortBy = Object.keys(sort).length ? { ...sort } : { _id: -1 };
  const count = await SkuModel.countDocuments(filter);

  const countAll = await SkuModel.countDocuments({
    sku_product_shop,
    isDelete: false,
  });

  const isPublished = await SkuModel.countDocuments({
    sku_product_shop,
    isDelete: false,
    isPublished: true,
  });

  const isDraft = await SkuModel.countDocuments({
    sku_product_shop,
    isDelete: false,
    isPublished: false,
  });

  const skus = await SkuModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .populate({
      path: "sku_product_id",
      select: getSelectData(selectProduct),
      // match: { product_price: { $gte: 50 } },
      // populate: {
      //   path: "product_shop",
      //   select: getSelectData(["_id", "email"]),
      // },
    })
    .select(getSelectData(select))
    .lean();

  return {
    countAll: +countAll ?? 0,
    isPublished: +isPublished ?? 0,
    isDraft: +isDraft ?? 0,
    totalCount: +count ?? 0,
    totalPages: Math.ceil(count / limit),
    page: +page,
    limit: +limit,
    skus,
  };
};

module.exports = {
  createSkusRepo,
  findSkusRepo,
  findSkuRepo,
  findSkuByIdRepo,
  updateSkuByIdRepo,
  findSkusRepo1,
  findSkusByShopRepo,
};
