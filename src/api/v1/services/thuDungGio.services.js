"use strict";
const util = require("util");
const logger = require("../log");
const { ForbiddenRequestError } = require("../core/errorResponse");
const {
  convertToObjectId,
  updateNestedObjectParser,
  removeNullObject,
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

  static getAllThuDungGios = async () => {
    return await getAllThuDungGiosRepo({ isBan: true }, { createdAt: -1 });
  };

  static createThuDungGio = async (req) => {
    const { newModelArr } = req.body;

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
    } = newModelArr;
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
