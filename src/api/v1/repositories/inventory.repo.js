"use strict";

const InventoryModel = require("../Models/InventoryModel");

const createInventoryRepo = async (inventory) => {
  return await InventoryModel.create(inventory);
};

const getAllInventoriesRepo = async ({ filter }) => {
  const inventories = await InventoryModel.find(filter).sort({
    createdAt: -1,
  });
  return {
    totalCount: inventories?.length ?? 0,
    inventories,
  };
};

module.exports = {
  createInventoryRepo,
  getAllInventoriesRepo,
};
