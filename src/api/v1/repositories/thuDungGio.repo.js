"use strict";

const ThuDungGioModel = require("../Models/ThuDungGioModel");

const createThuDungGioRepo = async (thuDungGio) => {
  return await ThuDungGioModel.create({ ...thuDungGio });
};

const getAllThuDungGiosRepo = async (query) => {
  const thuDungGios = await ThuDungGioModel.find({ ...query }).lean();
  return {
    totalCount: thuDungGios.length ?? 0,
    thuDungGios,
  };
};

module.exports = {
  createThuDungGioRepo,
  getAllThuDungGiosRepo,
};
