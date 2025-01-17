"use strict";

const UserModel = require("../Models/UserModel");
const { getSelectData, getUnSelectData } = require("../utils/getInfo");

const findUserByEmailRepo = async ({
  email,
  select = {
    // name: 1,
    // email: 1,
    // password: 1,
    // phone: 1,
    // isAdmin: 1,
    // createdAt: 1,
  },
}) => {
  return await UserModel.findOne({ email }).select(select).exec();
};

const findByIdAndUpdateTokenRepo = async (id, refreshToken) => {
  return await UserModel.findByIdAndUpdate(id, {
    refreshToken: refreshToken,
  }).exec();
};

const findByIdAndUpdateUserRepo = async ({
  id,
  updateSet,
  options = { upsert: false, new: true },
}) => {
  return UserModel.findByIdAndUpdate(id, updateSet, options).exec();
};

const findUserByIdRepo = async (id) => {
  return await UserModel.findById(id);
  /* 
  lean(): giam size OBJECT, 
   tra ve 1 obj js original,
    neu k trar ve nhieu thong tin hon
  exec(): async await trong db
  */
};

const findUserByIdLeanRepo = async ({ id, unSelect = [] }) => {
  return await UserModel.findById(id).select(getUnSelectData(unSelect)).lean();
  /* 
  lean(): giam size OBJECT, 
   tra ve 1 obj js original,
    neu k trar ve nhieu thong tin hon
  exec(): async await trong db
  */
};

const findAllAdminUsersRepo = async ({ unSelect = [] }) => {
  return await UserModel.find({ isAdmin: true })
    .select(getUnSelectData(unSelect))
    .lean();
};

const createUserRepo = async (user) => {
  return await UserModel.create({ ...user });
};

const findAllUsersRepo = async ({ limit, sort, page, filter, select = [] }) => {
  const skip = (page - 1) * limit;
  const sortBy = Object.keys(sort).length ? { ...sort } : { _id: -1 };
  const count = await UserModel.countDocuments({
    ...filter,
  });

  const users = await UserModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return {
    totalCount: +count ?? 0,
    totalPages: Math.ceil(count / limit),
    page: +page,
    limit: +limit,
    users,
  };
};

const findAllUsersOrdersRepo = async (filter) => {
  return await UserModel.find(filter).select({ _id: 1 }).lean();
};

const findUsersRepo = async ({ filter, unSelect = [] }) => {
  return await UserModel.find(filter)
    .select(getUnSelectData(unSelect))
    // .populate("userId")
    // .populate("shopId")
    // .populate("cartId")
    // .populate("shippingAddress")
    .sort({
      _id: -1,
    })
    .lean();
};

module.exports = {
  findUserByEmailRepo,
  findByIdAndUpdateTokenRepo,
  findUserByIdRepo,
  findAllAdminUsersRepo,
  createUserRepo,
  findAllUsersRepo,
  findAllUsersOrdersRepo,
  findByIdAndUpdateUserRepo,
  findUserByIdLeanRepo,
  findUsersRepo,
};
