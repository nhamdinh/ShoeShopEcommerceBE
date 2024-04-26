"use strict";

const SpuModel = require("../Models/spu.model");
const { getSelectData } = require("../utils/getInfo");

const createSpuRepo = async (spu) => {
  return await SpuModel.create(spu);
};

module.exports = {
  createSpuRepo,
};
