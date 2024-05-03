"use strict";
const util = require("util");
const logger = require("../log");

const { ForbiddenRequestError } = require("../core/errorResponse");
const { convertToObjectId } = require("../utils/getInfo");

const {
  createSkusRepo,
  findSkusRepo1,
  updateSkuByIdRepo,
} = require("../repositories/sku.repo");
const { randomName } = require("../utils/functionHelpers");

class SkuServices {
  static createSkus = async ({ sku_product_id, sku_list = [], sku_slug }) => {
    const convert_sku_list = sku_list.map((sku, index) => {
      return {
        ...sku,
        sku_product_id: sku_product_id,
        sku_id: sku_product_id.toString() + "." + randomName() + index,
        sku_slug,
      };
    });
    const newSkus = await createSkusRepo(convert_sku_list);
    return newSkus;
  };

  static updateSkus = async ({ sku_product_id, sku_list = [], sku_slug }) => {
    const convert_sku_list = sku_list.map((sku) => {
      return {
        ...sku,
        sku_slug,
      };
    });

    const filter = {
      sku_product_id: convertToObjectId(sku_product_id),
      isDelete: false,
    };

    const skusDb = await findSkusRepo1({
      sort: { _id: 1 },
      filter,
    });

    const lllDb = skusDb.length;
    const lllNew = convert_sku_list.length;
    if (lllDb >= lllNew) {
      const skusDbUpdate = skusDb.map((sku, index) => {
        if (index < lllNew) {
          const { sku_price, sku_stock, sku_tier_index, sku_values, sku_slug } =
            convert_sku_list[index];
          /**
             * update 5 field
            sku_price: sku_price ?? sku?.sku_price,
            sku_stock: sku_stock ?? sku?.sku_stock,
            sku_tier_index: sku_tier_index ?? sku?.sku_tier_index,
            sku_values: sku_values ?? sku?.sku_values,
            sku_slug: sku_slug ?? sku?.sku_slug,
             * 
             */
          return {
            ...sku,
            sku_price: sku_price ?? sku?.sku_price,
            sku_stock: sku_stock ?? sku?.sku_stock,
            sku_tier_index: sku_tier_index ?? sku?.sku_tier_index,
            sku_values: sku_values ?? sku?.sku_values,
            sku_slug: sku_slug ?? sku?.sku_slug,
          };
        }
        return {
          ...sku,
          isDelete: true,
        };
      });

      await Promise.all(
        skusDbUpdate.map(async (mmm, index) => {
          return await updateSkuByIdRepo({
            id: mmm._id,
            bodyUpdate: mmm,
          });
        })
      );
    } else {
      const skusDbUpdateAndCreate = convert_sku_list.map((sku, index) => {
        if (index < lllDb) {
          const { sku_price, sku_stock, sku_tier_index, sku_values, sku_slug } =
            convert_sku_list[index];
          /* update */

          return {
            ...sku,
            _id: skusDb[index]?._id,
            sku_price: sku_price ?? sku?.sku_price,
            sku_stock: sku_stock ?? sku?.sku_stock,
            sku_tier_index: sku_tier_index ?? sku?.sku_tier_index,
            sku_values: sku_values ?? sku?.sku_values,
            sku_slug: sku_slug ?? sku?.sku_slug,
          };
        }
        /* create */
        return {
          ...sku,
          sku_product_id: sku_product_id,
          sku_id: sku_product_id.toString() + "." + randomName() + index,
          sku_slug,
        };
      });

      await Promise.all(
        skusDbUpdateAndCreate.map(async (mmm, index) => {
          if (mmm._id)
            return await updateSkuByIdRepo({
              id: mmm._id,
              bodyUpdate: mmm,
            });
          return await createSkusRepo(mmm);
        })
      );
    }

    return true;
  };
}

module.exports = SkuServices;
