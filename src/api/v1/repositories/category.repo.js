"use strict";

const BrandModel = require("../Models/BrandModel");
const { getSelectData, getUnSelectData } = require("../utils/getInfo");

const getBrandsRepo = async ({ limit, page, sort, filter, unSelect }) => {
  const skip = (page - 1) * limit;
  const sortBy = Object.keys(sort).length ? { ...sort } : { _id: -1 };

  const count = await BrandModel.countDocuments({
    ...filter,
  });

  const brands = await BrandModel.find(filter)
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
    brands,
  };
};

module.exports = {
  getBrandsRepo,
};
