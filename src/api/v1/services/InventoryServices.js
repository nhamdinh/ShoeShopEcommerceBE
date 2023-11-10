"use strict";
const util = require("util");
const logger = require("../log");

const { ForbiddenRequestError } = require("../core/errorResponse");
const { createInventoryRepo } = require("../repositories/inventory.repo");

class InventoryServices {
  static createInventory = async (inventory) => {
    return await createInventoryRepo(inventory);
  };
}

module.exports = InventoryServices;
