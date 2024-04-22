"use strict";

const OtpModel = require("../Models/otp.model");
const { getSelectData } = require("../utils/getInfo");

const createOtpRepo = async (otp) => {
  return await OtpModel.create(otp);
};
const findOneOtpRepo = async ({
  filter,
  select = {
    // name: 1,
    // email: 1,
    // password: 1,
    // phone: 1,
    // isAdmin: 1,
    // createdAt: 1,
  },
}) => {
  return await OtpModel.findOne(filter).select(select).exec();
};

const findOneAndUpdateOtpRepo = async ({
  filter,
  updateSet,
  options = {
    upsert: false /* tao ban ghi moi */,
    new: true,
  },
}) => {
  return await OtpModel.findOneAndUpdate(filter, updateSet, options);
};

module.exports = {
  createOtpRepo,
  findOneOtpRepo,
  findOneAndUpdateOtpRepo,
};
