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
const {
  findSkusByShopRepo,
  updateSkuByIdRepo,
} = require("../repositories/sku.repo");
const { toNonAccentVietnamese } = require("../utils/functionHelpers");

class InventoryServices {
  static createInventory = async (inventory) => {
    return await createInventoryRepo(inventory);
  };

  static getAllInventories = async () => {
    return await getAllInventoriesRepo({ filter: {} });
  };

  static getSkusByShop = async ({ body, user }) => {
    const {
      limit = 50,
      page = 1,
      orderByKey = "_id",
      orderByValue = -1,
      shopId,
      select = [],
      isPublished,
      // product_type,
      keyword,
    } = body;
    const selectProduct = [
      "_id",
      "product_name",
      "product_thumb",
      "product_thumb_small",
      "product_shop",
      "product_quantity",
      "product_sold",
    ];
    const sort = {};
    sort[orderByKey] = orderByValue;

    if (user?._id.toString() !== shopId?.toString())
      throw new ForbiddenRequestError("You are not Owner", 403);

    const filter = {
      sku_product_shop: convertToObjectId(shopId),
      isDelete: false,
    };
    if (typeof isPublished === "boolean") filter.isPublished = isPublished;

    if (keyword) {
      const regexSearch = new RegExp(
        toNonAccentVietnamese(keyword).replaceAll(" ", "-"),
        "i"
      );
      filter.sku_slug = { $regex: regexSearch };
    }

    return await findSkusByShopRepo({
      sort,
      filter,
      limit,
      page,
      selectProduct,
    });
  };

  static updateStatusSkusByShop = async ({ user, body }) => {
    const { product_shop, bodyUpdate, ids } = body;
    // updateAllRepo()

    if (user._id?.toString() !== product_shop?.toString())
      throw new ForbiddenRequestError("You are not Owner!!");

    if (!ids.length) return false;

    await Promise.all(
      ids.map(async (id) => {
        return await updateSkuByIdRepo({
          id: convertToObjectId(id),
          bodyUpdate,
        });
      })
    );

    return true;
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
