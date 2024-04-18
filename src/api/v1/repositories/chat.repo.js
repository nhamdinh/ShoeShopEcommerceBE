"use strict";

const ChatStoryModel = require("../Models/ChatStoryModel");
const { getSelectData, getUnSelectData } = require("../utils/getInfo");

const createChatStoryRepo = async (chatStory) => {
  return await ChatStoryModel.create(chatStory);
};

const findOneCommentRepo = async ({ filter, unSelect }) => {
  return await ChatStoryModel.findOne(filter)
    .select(getUnSelectData(unSelect))
    .lean();
};

const findChatsRepo = async ({ filter, unSelect }) => {
  const comments = await ChatStoryModel.find(filter)
    .select(getUnSelectData(unSelect))
    .lean();
  return comments;
};

const findByIdAndUpdateChatRepo = async ({
  id,
  updateSet,
  options = { upsert: false, new: true },
}) => {
  return ChatStoryModel.findByIdAndUpdate(id, updateSet, options).exec();
};
module.exports = {
  findOneCommentRepo,
  findChatsRepo,
  findByIdAndUpdateChatRepo,
  createChatStoryRepo,
};
