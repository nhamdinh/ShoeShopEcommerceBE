"use strict";
const { promisify } = require("util");

const redis = require("redis");
const redisClient = redis.createClient();
