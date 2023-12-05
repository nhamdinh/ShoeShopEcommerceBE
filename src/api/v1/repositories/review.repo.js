"use strict";
const util = require("util");
const logger = require("../log");
const ReviewModel = require("../Models/ReviewModel");
const { getUnSelectData } = require("../utils/getInfo");

const createReviewRepo = async (review) => {
  return await ReviewModel.create(review);
};

const findReviewsRepo = async (filter) => {
  return await ReviewModel.find(filter)
    .populate("userId")
    .populate("productId")
    .sort({
      _id: -1,
    })
    .lean();
};

const getReviewByIdRepo = async (id) => {
  return await ReviewModel.findById(id).populate("userId").lean();
};

module.exports = {
  createReviewRepo,
  findReviewsRepo,
  getReviewByIdRepo,
};
