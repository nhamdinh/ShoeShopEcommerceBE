"use strict";
const util = require("util");
const logger = require("../log");
const { ForbiddenRequestError } = require("../core/errorResponse");

const {
  getAllThuDungGiosRepo,
  createThuDungGioRepo,
} = require("../repositories/thuDungGio.repo");

class ThuDungGioServices {
  static getAllThuDungGios = async () => {
    return await getAllThuDungGiosRepo({});
  };

  static createThuDungGio = async (req) => {
    const newModelArr = req.body;

    logger.info(
      `newModelArr register ::: ${util.inspect(newModelArr, {
        showHidden: false,
        depth: null,
        colors: false,
      })}`
    );


    const newThuDungGios = await Promise.all(
      newModelArr.map(async (item, index) => {
        const { buyName, sellDate, orderItems, isPaid, isDelivered, metadata } =
          item;

        const newThuDungGio = await createThuDungGioRepo({
          buyName,
          sellDate,
          orderItems,
          isPaid,
          isDelivered,
          metadata,
        });
        if (!newThuDungGio) {
          throw new ForbiddenRequestError("Invalid ThuDungGio Data__" + index);
        }

        logger.info(
          `newThuDungGio register ::: ${util.inspect(newThuDungGio, {
            showHidden: false,
            depth: null,
            colors: false,
          })}`
        );
        return newThuDungGio;
      })
    );

    return newThuDungGios;
  };
}
module.exports = ThuDungGioServices;
