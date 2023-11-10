"use strict";

const InventoryModel = require("../Models/InventoryModel");

const createInventoryRepo = async (inventory) => {
  return await InventoryModel.create(inventory);
};

module.exports = {
  createInventoryRepo,
};
