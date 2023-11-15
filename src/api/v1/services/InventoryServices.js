"use strict";
const util = require("util");
const logger = require("../log");

const { ForbiddenRequestError } = require("../core/errorResponse");
const {
  createInventoryRepo,
  getAllInventoriesRepo,
} = require("../repositories/inventory.repo");

class InventoryServices {
  static createInventory = async (inventory) => {
    return await createInventoryRepo(inventory);
  };
  static getAllInventories = async () => {
    return await getAllInventoriesRepo({ filter: {} });
  };
}

module.exports = InventoryServices;
