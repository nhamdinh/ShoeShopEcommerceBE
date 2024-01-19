"use strict";
const { CREATED, OK } = require("../core/successResponse");
const ThuDungGioServices = require("../services/thuDungGio.services");

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
      metadata: await ThuDungGioServices.getAllThuDungGios(),
    }).send(res);
  };
}

module.exports = new ThuDungGioController();
