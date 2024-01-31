"use strict";
const util = require("util");
const logger = require("../log");
const { ForbiddenRequestError } = require("../core/errorResponse");
const {
  convertToObjectId,
  updateNestedObjectParser,
  removeNullObject,
  toNonAccentVietnamese,
} = require("../utils/getInfo");

const {
  getAllThuDungGiosRepo,
  createThuDungGioRepo,
  findByIdRepo,
  findByIdAndUpdateRepo,
} = require("../repositories/thuDungGio.repo");

class ThuDungGioServices {
  static findThuDungGioById = async ({ id }) => {
    const order = await findByIdRepo(convertToObjectId(id));
    if (!order) {
      throw new ForbiddenRequestError("Order not found", 404);
    }
    return order;
  };

  static updatedOrderPay = async ({ id }) => {
    const order = await findByIdRepo(convertToObjectId(id));
    if (!order) {
      throw new ForbiddenRequestError("Order not found", 404);
    }

    order.isPaid = !order?.isPaid;
    order.isPaidAt = Date.now();

    const updatedOrder = await order.save();
    return updatedOrder;
  };

  static getAllThuDungGios = async ({
    isBan,
    limit = 10,
    skip = 0,
    isPaid = 0,
    keySearch,
  }) => {
    const regexSearch = new RegExp(toNonAccentVietnamese(keySearch), "i");
    // logger.info(
    //   `regexSearch  ::: ${util.inspect(regexSearch, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );

    const query = {
      isBan,
      isPaid: {
        $in: +isPaid === 1 ? [true] : +isPaid === -1 ? [false] : [true, false],
      },
      buyNameEng: { $regex: regexSearch },
    };

    return await getAllThuDungGiosRepo({
      query,
      limit,
      skip,
    });
  };

  static createThuDungGio = async (req) => {
    const { newModel } = req.body;

    const {
      buyName,
      sellDate,
      address,
      phone,
      orderItems,
      isPaid,
      isDelivered,
      metadata,
      isBan,
      isGif,
      discount,
    } = newModel;
    const newThuDungGio = await createThuDungGioRepo({
      buyName,
      sellDate,
      orderItems,
      isPaid,
      isDelivered,
      metadata,
      address,
      phone,
      isBan,
      isGif,
      discount,
      buyNameEng: toNonAccentVietnamese(buyName),
    });
    if (!newThuDungGio) {
      throw new ForbiddenRequestError("Invalid ThuDungGio Data");
    }

    // logger.info(
    //   `newThuDungGio register ::: ${util.inspect(newThuDungGio, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );
    return newThuDungGio;
  };

  static updatedOrderById = async ({ id, objectParams }) => {
    return await findByIdAndUpdateRepo({
      id: convertToObjectId(id),
      objectParams: removeNullObject(objectParams),
    });
  };
}
module.exports = ThuDungGioServices;
