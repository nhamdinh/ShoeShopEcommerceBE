"use strict";

const UserModel = require("../Models/UserModel");

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

const findUserByIdRepo = async (id) => {
  return await UserModel.findById(id);
  /* 
  lean(): giam size OBJECT, 
   tra ve 1 obj js original,
    neu k trar ve nhieu thong tin hon
  exec(): async await trong db
  */
};
const findAllAdminUsersRepo = async (select = { email: 1, phone: 2 }) => {
  return await UserModel.find({ isAdmin: true }).select(select).lean().exec();
};

const createUserRepo = async (user) => {
  return await UserModel.create({ ...user });
};

const getAllUsersRepo = async () => {
  const users = await UserModel.find({ status: "active" }).lean();
  return {
    totalCount: users.length ?? 0,
    users,
  };
};

module.exports = {
  findUserByEmailRepo,
  findByIdAndUpdateTokenRepo,
  findUserByIdRepo,
  findAllAdminUsersRepo,
  createUserRepo,
  getAllUsersRepo,
};
