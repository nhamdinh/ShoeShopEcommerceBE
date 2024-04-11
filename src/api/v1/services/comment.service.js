"use strict";
const util = require("util");
const logger = require("../log");

const { ForbiddenRequestError } = require("../core/errorResponse");
const {
  createCommentRepo,
  getAllInventoriesRepo,
  findOneAndUpdateCommentRepo,
  findOneRightRepo,
  findCommentByIdRepo,
  updateManyCommentRepo,
  findCommentsRepo,
} = require("../repositories/comment.repo");
const { convertToObjectId } = require("../utils/getInfo");

class CommentServices {
  static createComment = async ({ commentBody }) => {
    const {
      cmt_productId,
      cmt_userId,
      cmt_parentId = null,
      cmt_content,
    } = commentBody;

    const comment = {
      cmt_productId,
      cmt_userId,
      cmt_parentId,
      cmt_content,
    };

    let rightVal;

    if (cmt_parentId) {
      // reply cm

      const parentComment = await findCommentByIdRepo(
        convertToObjectId(cmt_parentId)
      );

      if (!parentComment) throw new Error("Comment not Found", 404);

      rightVal = parentComment.cmt_right;

      await updateManyCommentRepo({
        cmt_productId: convertToObjectId(cmt_productId),
        rightVal,
      });
      // update many comments
    } else {
      const maxRightVal = await findOneRightRepo({
        cmt_productId: convertToObjectId(cmt_productId),
      });

      if (maxRightVal) {
        rightVal = maxRightVal.right + 1;
      } else {
        rightVal = 1;
      }
    }

    comment.cmt_left = rightVal;
    comment.cmt_right = rightVal + 1;
    return await createCommentRepo(comment);
  };

  static getCommentByParentId = async ({ query }) => {
    const { cmt_productId, cmt_parentId = null, limit = 50, page = 1 } = query;

    const select = ["cmt_left", "cmt_right", "cmt_content", "cmt_parentId"];
    if (cmt_parentId) {
      const parentComment = await findCommentByIdRepo(
        convertToObjectId(cmt_parentId)
      );

      if (!parentComment) throw new Error("Comment not Found", 404);

      const metadata = await findCommentsRepo({
        limit,
        page,
        sort: {
          cmt_left: 1,
        },
        filter: {
          cmt_productId: convertToObjectId(cmt_productId),
          cmt_left: {
            $gt: parentComment.cmt_left,
          },
          cmt_right: {
            $lte: parentComment.cmt_right,
          },
        },
        select,
      });

      return metadata;
    }

    const metadata = await findCommentsRepo({
      limit,
      page,
      sort: {
        cmt_left: 1,
      },
      filter: {
        cmt_productId: convertToObjectId(cmt_productId),
        cmt_parentId: null,
      },
      select,
    });

    return metadata;
  };

  static findOneAndUpdateComment = async ({ filter = {}, updateSet = {} }) => {
    return await findOneAndUpdateCommentRepo({ filter, updateSet });
  };
}

module.exports = CommentServices;
