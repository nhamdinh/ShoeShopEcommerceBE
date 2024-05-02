"use strict";
const util = require("util");
const logger = require("../log");
const ReviewModel = require("../Models/ReviewModel");
const { getUnSelectData, getSelectData } = require("../utils/getInfo");
const { UserUnSelectData } = require("../utils/constant");

const createReviewRepo = async (review) => {
  return await ReviewModel.create(review);
};

const findReviewsRepo = async ({
  limit,
  sort,
  page,
  filter,
  unSelect = [],
}) => {
  const skip = (page < 1 ? 1 : page - 1) * limit;
  // const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const sortBy = Object.keys(sort).length ? { ...sort } : { _id: -1 };
  const count = await ReviewModel.countDocuments(filter);

  const reviews = await ReviewModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .populate({
      path: "userId",
      select: getUnSelectData(UserUnSelectData),
    })
    .populate("productId")
    .select(getUnSelectData(unSelect))
    .lean();

  return {
    totalCount: +count ?? 0,
    totalPages: Math.ceil(count / limit),
    page: +page,
    limit: +limit,
    reviews,
  };
};

const getReviewByIdRepo = async (id) => {
  return await ReviewModel.findById(id).populate("userId").lean();
};

module.exports = {
  createReviewRepo,
  findReviewsRepo,
  getReviewByIdRepo,
};
