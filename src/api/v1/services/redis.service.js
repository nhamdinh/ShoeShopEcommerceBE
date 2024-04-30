"use strict";
const util = require("util");
const logger = require("../log");

const redis = require("redis");
const { promisify } = require("util");
const { reservationInventory } = require("./InventoryServices");
const { updateProductByIdRepo } = require("../repositories/product.repo");
const { convertToObjectId } = require("../utils/getInfo");
const { updateSkuByIdRepo } = require("../repositories/sku.repo");

const redisClient = redis.createClient();

redisClient.ping((err, result) => {
  if (err) {
    console.error("Error connecting redisClient", err);
  } else {
    console.log(" connecting to redisClient");
  }
});

const pexpire = promisify(redisClient.PEXPIRE).bind(redisClient);
const setnxAsync = promisify(redisClient.SETNX).bind(redisClient);

const getAsync = promisify(redisClient.GET).bind(redisClient);
const setAsync = promisify(redisClient.SET).bind(redisClient);

const acquireLock = async (productId, quantity, cartId, sku_id) => {
  const key = `lock_v2024_${sku_id}`;
  const retryTimes = 10;
  const expireTimer = 3000; // 3 seconds lock
  const waitTimer = 100;

  for (let i = 0; i < retryTimes; i++) {
    // tao 1 key, thang nao giu dc vao thanh toan
    const result = await setnxAsync(key, expireTimer);

    if (result === 1) {
      //thao tac voi inventory
      const reversation = await reservationInventory({
        productId,
        quantity: +quantity,
        cartId,
      });

      const bodyUpdate = {
        $inc: {
          product_quantity: -quantity,
          product_sold: +quantity,
        },
      };

      const bodyUpdateSku = {
        $inc: {
          sku_stock: -quantity,
          sku_sold: +quantity,
        },
      };

      await updateProductByIdRepo("product", {
        product_id: convertToObjectId(productId),
        bodyUpdate,
      });

      await updateSkuByIdRepo({
        id: convertToObjectId(sku_id),
        bodyUpdate: bodyUpdateSku,
      });

      await releaseLock(key); /* ko update dc Inventory */
      if (reversation) {
        // await pexpire(key, expireTimer);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, waitTimer));
    }
  }

  return null;
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.DEL).bind(redisClient);
  return delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
  setAsync,
  getAsync,
};
