"use strict";
const util = require("util");
const logger = require("../log");
const { CREATED, OK } = require("../core/successResponse");
const InventoryServices = require("../services/InventoryServices");

class InventoryController {
  getAllInventories = async (req, res, next) => {
    new OK({
      message: "getAllInventories OK",
      metadata: await InventoryServices.getAllInventories({}),
    }).send(res);
  };

  getSkusByShop = async (req, res, next) => {
    new OK({
      message: "getSkusByShop OK",
      metadata: await InventoryServices.getSkusByShop({
        body: req.body,
        user: req.user,
      }),
    }).send(res);
  };

  updateStatusSkusByShop = async (req, res, next) => {
    new OK({
      message: "updateStatusSkusByShop OK",
      metadata: await InventoryServices.updateStatusSkusByShop({
        user: req.user,
        body: req.body,
      }),
      options: {
        // product_shop: req.body.product_shop,
      },
    }).send(res);
  };

}

module.exports = new InventoryController();
