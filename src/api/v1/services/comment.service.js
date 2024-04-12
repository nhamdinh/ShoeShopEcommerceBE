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
  findOneCommentRepo,
  deleteManyCommentRepo,
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

      if (!parentComment) throw new ForbiddenRequestError("Comment not Found", 404);

      rightVal = parentComment.cmt_right;

      // update many comments
      await updateManyCommentRepo({
        filter: {
          cmt_productId: convertToObjectId(cmt_productId),
          cmt_right: { $gte: rightVal },
        },
        update: {
          $inc: {
            cmt_right: 2,
          },
        },
      });

      await updateManyCommentRepo({
        filter: {
          cmt_productId: convertToObjectId(cmt_productId),
          cmt_left: { $gt: rightVal },
        },
        update: {
          $inc: {
            cmt_left: 2,
          },
        },
      });
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

      if (!parentComment) throw new ForbiddenRequestError("Comment not Found", 404);

      const metadata = await findCommentsRepo({
        limit,
        page,
        sort: {
          cmt_left: 1,
        },
        filter: {
          cmt_idDel: false,
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
        cmt_idDel: false,
        cmt_productId: convertToObjectId(cmt_productId),
        cmt_parentId: null,
      },
      select,
    });

    return metadata;
  };

  static deleteComments = async ({ body }) => {
    const { cmt_productId, cmt_userId, cmt_id } = body;

    const foundComment = await findOneCommentRepo({
      filter: {
        _id: convertToObjectId(cmt_id),
        cmt_userId: convertToObjectId(cmt_userId),
      },
    });

    if (!foundComment) throw new ForbiddenRequestError("Comment not Found", 404);
    logger.info(
      `foundComment ::: ${util.inspect(foundComment, {
        showHidden: false,
        depth: null,
        colors: false,
      })}`
    );
    // 1. xac dinh left va right
    const rightVal = foundComment.cmt_right;
    const leftVal = foundComment.cmt_left;

    // 2. tinh width

    const width = +rightVal - +leftVal + 1;
    // 3. xoa all comment id con

    await deleteManyCommentRepo({
      filter: {
        cmt_productId: convertToObjectId(cmt_productId),
        cmt_left: { $gte: leftVal, $lte: rightVal },
      },
    });

    // await updateManyCommentRepo({
    //   filter: {
    //     cmt_productId: convertToObjectId(cmt_productId),
    //     cmt_left: { $gte: leftVal, $lte: rightVal },
    //   },
    //   update: {
    //     cmt_idDel: true,
    //   },
    // });

    // 4. cap nhat right left con lai
    await updateManyCommentRepo({
      filter: {
        cmt_productId: convertToObjectId(cmt_productId),
        cmt_right: { $gt: rightVal },
      },
      update: {
        $inc: {
          cmt_right: -width,
        },
      },
    });

    await updateManyCommentRepo({
      filter: {
        cmt_productId: convertToObjectId(cmt_productId),
        cmt_left: { $gt: rightVal },
      },
      update: {
        $inc: {
          cmt_left: -width,
        },
      },
    });

    return true;
  };

  static findOneAndUpdateComment = async ({ filter = {}, updateSet = {} }) => {
    return await findOneAndUpdateCommentRepo({ filter, updateSet });
  };
}

module.exports = CommentServices;
