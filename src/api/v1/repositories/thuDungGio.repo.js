"use strict";

const ThuDungGioModel = require("../Models/ThuDungGioModel");

const createThuDungGioRepo = async (thuDungGio) => {
  return await ThuDungGioModel.create({ ...thuDungGio });
};

const findByIdAndUpdateRepo = async ({ id, objectParams }) => {
  return await ThuDungGioModel.findByIdAndUpdate(id, objectParams, {
    new: false,
  });
};

const findByIdRepo = async (id) => {
  return await ThuDungGioModel.findById(id);
};

const getAllThuDungGiosRepo = async ({ query, sort, skip, limit }) => {
  const thuDungGios = await ThuDungGioModel.find({ ...query })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    totalCount: thuDungGios.length ?? 0,
    thuDungGios,
  };
};

module.exports = {
  createThuDungGioRepo,
  getAllThuDungGiosRepo,
  findByIdRepo,
  findByIdAndUpdateRepo,
};
