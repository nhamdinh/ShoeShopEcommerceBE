"use strict";
const util = require("util");
const logger = require("../log");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const { ForbiddenRequestError } = require("../core/errorResponse");

const { convertToObjectId } = require("../utils/getInfo");
const {
  findUserByEmailRepo,
  findUserByIdLeanRepo,
} = require("../repositories/user.repo");
const {
  createOtpRepo,
  findOneAndUpdateOtpRepo,
} = require("../repositories/otp.repo");
const { createSpuRepo } = require("../repositories/spu.repo");
const { randomName } = require("../utils/functionHelpers");
const SkuServices = require("./sku.service");

class SpuServices {
  static createSpu = async ({ body, user }) => {
    const {
      product_name,
      product_thumb,
      product_description,
      product_price,
      product_quantity,
      product_categories,
      product_attributes,
      product_variants,
      sku_list = [],
    } = body;
    const product_shop = user._id;

    logger.info(
      `product_shop ::: ${util.inspect(product_shop, {
        showHidden: false,
        depth: null,
        colors: false,
      })}`
    );

    // 1. check shop exists
    const foundShop = await findUserByIdLeanRepo({
      id: convertToObjectId(product_shop),
    });
    if (!foundShop) throw new ForbiddenRequestError("Shop not Found");

    // 2. create newSpu

    const newSpu = await createSpuRepo({
      product_name,
      product_thumb,
      product_description,
      product_price,
      product_quantity,
      product_shop,
      product_categories,
      product_attributes,
      product_variants,
    });

    logger.info(
      `newSpu ::: ${util.inspect(newSpu, {
        showHidden: false,
        depth: null,
        colors: false,
      })}`
    );

    if (newSpu && sku_list.length) {
      // 3. create new Skus
      await SkuServices.createSkus({
        sku_product_id: newSpu._id,
        sku_product_shop: newSpu.product_shop,
        sku_list,
      });
    }

    // 4. sycn data via elasticsearch

    // 5. response

    return !!newSpu;
  };
}

module.exports = SpuServices;
