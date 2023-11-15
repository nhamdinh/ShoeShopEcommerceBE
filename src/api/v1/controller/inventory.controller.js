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
}

module.exports = new InventoryController();
