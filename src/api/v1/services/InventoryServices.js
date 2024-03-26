"use strict";
const util = require("util");
const logger = require("../log");

const { ForbiddenRequestError } = require("../core/errorResponse");
const {
  createInventoryRepo,
  getAllInventoriesRepo,
  findOneAndUpdateInventoryRepo,
} = require("../repositories/inventory.repo");
const { convertToObjectId } = require("../utils/getInfo");

class InventoryServices {
  static createInventory = async (inventory) => {
    return await createInventoryRepo(inventory);
  };

  static getAllInventories = async () => {
    return await getAllInventoriesRepo({ filter: {} });
  };

  static findOneAndUpdateInventory = async ({
    filter = {},
    updateSet = {},
  }) => {
    return await findOneAndUpdateInventoryRepo({ filter, updateSet });
  };

  static reservationInventory = async ({ productId, quantity, cartId }) => {
    const filter = {
        inven_productId: convertToObjectId(productId),
        inven_stock: { $gte: quantity },
      },
      updateSet = {
        $inc: {
          inven_stock: -quantity,
        },
        $push: {
          inven_reservations: {
            cartId,
            quantity,
            createdOn: new Date(),
          },
        },
      };
    return await findOneAndUpdateInventoryRepo({ filter, updateSet });
  };
}

module.exports = InventoryServices;
