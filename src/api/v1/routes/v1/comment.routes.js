const express = require("express");
const asyncHandler = require("express-async-handler");
const commentController = require("../../controller/comment.controller");

const { validate } = require("../../validations");
const commentRoute = express.Router();

commentRoute.post(
  "/create",
  asyncHandler(commentController.createComment)
);

commentRoute.get(
  "/getCommentByParentId",
  asyncHandler(commentController.getCommentByParentId)
);

module.exports = commentRoute;
