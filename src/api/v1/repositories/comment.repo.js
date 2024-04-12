"use strict";

const CommentModel = require("../Models/comment.model");
const { getSelectData } = require("../utils/getInfo");

const createCommentRepo = async (comment) => {
  return await CommentModel.create(comment);
};

const findCommentByIdRepo = async (id) => {
  return await CommentModel.findById(id);
};

const findCommentsRepo = async ({ limit, sort, page, filter, select = [] }) => {
  const skip = (page - 1) * limit;
  // const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const sortBy = Object.keys(sort).length ? { ...sort } : { _id: -1 };

  const count = await CommentModel.countDocuments({
    ...filter,
  });

  const comments = await CommentModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    // .populate({ path: "product_shop" })
    .select(getSelectData(select))
    .lean();

  return {
    totalCount: +count ?? 0,
    totalPages: Math.ceil(count / limit),
    page: +page,
    limit: +limit,
    comments,
  };
};

const updateManyCommentRepo = async ({ filter, update }) => {
  await CommentModel.updateMany(filter, update);
};

const deleteManyCommentRepo = async ({ filter }) => {
  await CommentModel.deleteMany(filter);
};

const getAllInventoriesRepo = async ({ filter }) => {
  const inventories = await CommentModel.find(filter).sort({
    createdAt: -1,
  });
  return {
    totalCount: inventories?.length ?? 0,
    inventories,
  };
};

const findOneAndUpdateCommentRepo = async ({
  filter,
  updateSet,
  options = { upsert: false, new: true },
  /* upsert: them moi(true); new: return du lieu moi */
}) => {
  return await CommentModel.findOneAndUpdate(filter, updateSet, options);
};

const findOneRightRepo = async ({ cmt_productId }) => {
  return await CommentModel.findOne(
    {
      cmt_productId,
    },
    "cmt_right",
    {
      sort: {
        cmt_right: -1,
      },
    }
  );
};

const findOneCommentRepo = async ({ filter }) => {
  return await CommentModel.findOne(filter).lean();
};
module.exports = {
  createCommentRepo,
  getAllInventoriesRepo,
  findOneAndUpdateCommentRepo,
  findOneRightRepo,
  findCommentByIdRepo,
  updateManyCommentRepo,
  findCommentsRepo,
  findOneCommentRepo,
  deleteManyCommentRepo,
};
