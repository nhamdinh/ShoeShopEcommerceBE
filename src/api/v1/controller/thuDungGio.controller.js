"use strict";
const { CREATED, OK } = require("../core/successResponse");
const ThuDungGioServices = require("../services/thuDungGio.services");
const util = require("util");
const logger = require("../log");
class ThuDungGioController {
  createThuDungGio = async (req, res) => {
    new CREATED({
      message: "createThuDungGio CREATED",
      metadata: await ThuDungGioServices.createThuDungGio(req),
    }).send(res);
  };

  getAllThuDungGios = async (req, res) => {
    new OK({
      message: "getAllThuDungGios OK",
      metadata: await ThuDungGioServices.getAllThuDungGios({
        isBan: req.query.isBan ?? true,
        limit: req.query.limit ?? 1000,
        skip: req.query.skip ?? 0,
        isPaid: req.query.isPaid ?? 0,
        keySearch: req.query.keySearch ?? "",
      }),
    }).send(res);
  };

  updatedOrderPay = async (req, res) => {
    new OK({
      message: "updatedOrderPay OK",
      metadata: await ThuDungGioServices.updatedOrderPay({ id: req.body.id }),
    }).send(res);
  };

  findThuDungGioById = async (req, res) => {
    new OK({
      message: "findThuDungGioById OK",
      metadata: await ThuDungGioServices.findThuDungGioById({
        id: req.body.id,
      }),
    }).send(res);
  };

  updatedOrderById = async (req, res) => {
    new OK({
      message: "updatedOrderById OK",
      metadata: await ThuDungGioServices.updatedOrderById({
        id: req.body.id,
        objectParams: req.body.objectParams,
      }),
    }).send(res);
  };
}

module.exports = new ThuDungGioController();
