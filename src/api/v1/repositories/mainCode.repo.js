"use strict";
const util = require("util");
const logger = require("../log");
const MainCodeModel = require("../Models/MainCodeModel");

const createMainCodeRepo = async (mainCode) => {
  return await MainCodeModel.create(mainCode);
};

const getAllMainCodesRepo = async ({ filter }) => {
  const mainCodes = await MainCodeModel.find(filter).sort({
    createdAt: -1,
  });
  return {
    totalCount: mainCodes?.length ?? 0,
    mainCodes,
  };
};

module.exports = {
  createMainCodeRepo,
  getAllMainCodesRepo,
};
