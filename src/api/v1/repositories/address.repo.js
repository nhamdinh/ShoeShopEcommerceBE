"use strict";
const util = require("util");
const logger = require("../log");
const AddressModel = require("../Models/Address");
const { getUnSelectData } = require("../utils/getInfo");

const findAddressByUserRepo = async ({ userId }) => {
  return await AddressModel.find({
    user: userId,
  });
};

module.exports = {
  findAddressByUserRepo,
};
