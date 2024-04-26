"use strict";
const util = require("util");
const logger = require("../log");

const { ForbiddenRequestError } = require("../core/errorResponse");
const { convertToObjectId } = require("../utils/getInfo");

const { createSkusRepo } = require("../repositories/sku.repo");
const { randomName } = require("../utils/functionHelpers");

class SkuServices {
  static createSkus = async ({ sku_product_id, sku_list = [] }) => {
    const convert_sku_list = sku_list.map((sku) => {
      return {
        ...sku,
        sku_product_id: sku_product_id,
        sku_id: sku_product_id.toString() + "." + randomName(),
      };
    });
    const newSkus = await createSkusRepo(convert_sku_list);
    return newSkus;
  };
}

module.exports = SkuServices;
