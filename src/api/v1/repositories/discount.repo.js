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
  sort,
  page,
  filter,
  unSelect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const discounts = await DiscountModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean();

  // logger.info(
  //   `discounts ::: ${util.inspect(discounts, {
  //     showHidden: false,
  //     depth: null,
  //     colors: false,
  //   })}`
  // );

  return { totalCount: discounts?.length ?? 0, discounts };
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
