"use strict";
const util = require("util");
const logger = require("../log");
const ReviewModel = require("../Models/ReviewModel");
const { getUnSelectData } = require("../utils/getInfo");

const createReviewRepo = async (review) => {
  return await ReviewModel.create(review);
};

const findReviewsRepo = async (filter) => {
  logger.info(
    `filter ::: ${util.inspect(filter, {
      showHidden: false,
      depth: null,
      colors: false,
    })}`
  );
  let xxx = await ReviewModel.find(filter)
    .populate("userId")
    .populate("shopId")
    .sort({
      _id: -1,
    })
    .lean();

  logger.info(
    `xxx ::: ${util.inspect(xxx, {
      showHidden: false,
      depth: null,
      colors: false,
    })}`
  );
  return xxx;
};

const getReviewByIdRepo = async (id) => {
  return await ReviewModel.findById(id).populate("userId").lean();
};

module.exports = {
  createReviewRepo,
  findReviewsRepo,
  getReviewByIdRepo,
};
