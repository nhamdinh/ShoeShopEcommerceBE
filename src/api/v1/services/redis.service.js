"use strict";
const util = require("util");
const logger = require("../log");

const redis = require("redis");
const { promisify } = require("util");
const { reservationInventory } = require("./InventoryServices");

const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2024_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000; // 3 seconds lock

  for (let i = 0; i < retryTimes; i++) {
    // tao 1 key, thang nao giu dc vao thanh toan
    const result = await setnxAsync(key, expireTime);

    logger.info(
      `result :::${productId} ${util.inspect(result, {
        showHidden: false,
        depth: null,
        colors: false,
      })}`
    );

    if (result === 1) {
      //thao tac voi inventory
      const reversation = await reservationInventory({
        productId,
        quantity: +quantity,
        cartId,
      });
      logger.info(
        `reversation ::: ${util.inspect(reversation, {
          showHidden: false,
          depth: null,
          colors: false,
        })}`
      );

      await releaseLock(key);/* ko update dc Inventory */
      if (reversation) {
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return null;
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
