const express = require("express");
const asyncHandler = require("express-async-handler");
const commentController = require("../../controller/comment.controller");

const { validate } = require("../../validations");
const { protect } = require("../../Middleware/AuthMiddleware");
const commentRoute = express.Router();

commentRoute.post(
  "/create",
  asyncHandler(commentController.createComment)
);

commentRoute.get(
  "/getCommentByParentId",
  asyncHandler(commentController.getCommentByParentId)
);

commentRoute.delete(
  // "/deleteComments/:cmt_productId/:cmt_userId/:cmt_id",
  "/deleteComments",
  // protect,
  asyncHandler(commentController.deleteComments)
);

module.exports = commentRoute;
