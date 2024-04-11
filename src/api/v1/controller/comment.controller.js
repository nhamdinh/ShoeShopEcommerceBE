"use strict";
const util = require("util");
const logger = require("../log");
const { CREATED, OK } = require("../core/successResponse");
const CommentServices = require("../services/comment.service");

class CommentController {
  createComment = async (req, res, next) => {
    new CREATED({
      message: "createComment OK",
      metadata: await CommentServices.createComment({
        commentBody: req.body,
      }),
    }).send(res);
  };


  getCommentByParentId = async (req, res, next) => {
    new OK({
      message: "getCommentByParentId OK",
      metadata: await CommentServices.getCommentByParentId({
        query: req.query,
      }),
    }).send(res);
  };
}

module.exports = new CommentController();
