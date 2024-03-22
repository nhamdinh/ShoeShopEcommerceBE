"use strict";
const util = require("util");
const logger = require("../log");

const { ForbiddenRequestError } = require("../core/errorResponse");
const {
  createInventoryRepo,
  getAllInventoriesRepo,
  findOneAndUpdateInventoryRepo,
} = require("../repositories/inventory.repo");

class InventoryServices {
  static createInventory = async (inventory) => {
    return await createInventoryRepo(inventory);
  };

  static getAllInventories = async () => {
    return await getAllInventoriesRepo({ filter: {} });
  };

  static findOneAndUpdateInventory = async ({ filter = {}, updateSet = {} }) => {
    return await findOneAndUpdateInventoryRepo({ filter, updateSet });
  };
}

module.exports = InventoryServices;
