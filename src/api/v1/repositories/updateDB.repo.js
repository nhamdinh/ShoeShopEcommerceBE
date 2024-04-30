"use strict";
const { model } = require("mongoose");
const util = require("util");
const { uid } = require("uid");
const bcrypt = require("bcrypt");

const logger = require("../log");
const { convertToObjectId } = require("../utils/getInfo");
const SkuServices = require("../services/sku.service");

const updateAllRepo = async () => {
  const Model = model("Product");
  const Inventory = model("Inventory");

  const models = await Model.find({}).sort({
    _id: -1,
  });

  // for (let i = 0; i < models.length; i++) {
  //   const item = models[i];
  //   item.product_slug = toNonAccentVietnamese(item.product_name).replaceAll(" ","-=");
  //   await item.update(item);
  // }

  const startTime = performance.now();

  // const arr = await Promise.all(
  //   models.map(async (mmm) => {
  //     return mmm._id.toString();
  //   })
  // );

  // logger.info(
  //   `arr ::: ${util.inspect(arr, {
  //     showHidden: false,
  //     depth: null,
  //     colors: false,
  //   })}`
  // );

  await Promise.all(
    models.map(async (mmm) => {
      //       mmm.product_slug = toNonAccentVietnamese(mmm.product_name).replaceAll(" ","-");
      //   const zz  =  +mmm.product_price * ( (Math.random() * (50 - 10) + 10) +100    )/100
      // const quantity = Math.floor(Math.random() * (505 - 10) + 11);

      // mmm.user_salt = salt
      // mmm.password = await bcrypt.hash('123456', salt);

      mmm.product_variants = [
        {
          images: [],
          name: "COLOR",
          values: ["RED", "BLUE"],
        },
        {
          images: [],
          name: "SIZE",
          values: ["X", "M"],
        },
      ];
      mmm.product_brand = "65e1a1c4d75a0c8024c427be";

      mmm.product_categories = [
        "6556e44e29492dc19f5e037e",
        "6556e1595cb85c4e250f542d",
      ];
      mmm.product_attributes = [
        {
          attribute_id: "abc123",
          attribute_values: [
            {
              value_id: "value11",
            },
            {
              value_id: "value2",
            },
          ],
        },
      ];
      const sku_list = [
        {
          sku_price: Math.floor(Math.random() * (100 - 10) + 10),
          sku_stock: Math.floor(Math.random() * (1000 - 200) + 200),
          sku_tier_index: [0, 0],
          sku_values: {
            COLOR: "RED",
            SIZE: "X",
          },
        },
        {
          sku_price: Math.floor(Math.random() * (100 - 10) + 10),
          sku_stock: Math.floor(Math.random() * (1000 - 200) + 200),
          sku_tier_index: [0, 1],
          sku_values: {
            COLOR: "RED",
            SIZE: "M",
          },
        },
        {
          sku_price: Math.floor(Math.random() * (100 - 10) + 10),
          sku_stock: Math.floor(Math.random() * (1000 - 200) + 200),
          sku_tier_index: [1, 0],
          sku_values: {
            COLOR: "BLUE",
            SIZE: "X",
          },
        },
        {
          sku_price: Math.floor(Math.random() * (100 - 10) + 10),
          sku_stock: Math.floor(Math.random() * (1000 - 200) + 200),
          sku_tier_index: [1, 1],
          sku_values: {
            COLOR: "BLUE",
            SIZE: "M",
          },
        },
      ];

      const totalQuantity = sku_list.reduce(
        (accumulator, item) => +accumulator + +item?.sku_stock,
        [0]
      );

      const priceArr = sku_list.filter(({ sku_price }) => sku_price > 0);
      priceArr.sort((aa, bb) => aa.sku_price - bb.sku_price);

      mmm.product_quantity = +totalQuantity;
      mmm.product_price = +priceArr[0]?.sku_price;
      const max = +priceArr[priceArr.length - 1]?.sku_price;
      mmm.product_original_price = +(
        (+max * (Math.random() * (40 - 1) + 1 + 100)) /
        100
      ).toFixed(2);

      // await mmm.update(mmm);
      // await SkuServices.createSkus({
      //   sku_product_id: mmm._id,
      //   sku_list,
      //   sku_slug: mmm.product_slug,
      // });

      //       const filter = {
      //     inven_productId: convertToObjectId(mmm._id),
      //   },
      //   updateSet = {
      //     inven_stock: quantity,
      //   },
      //   options = {
      //     upsert: false,
      //     new: true,
      //   }; /* upsert: them moi(true); new: return du lieu moi */
      // await Inventory.findOneAndUpdate(filter, updateSet, options);
    })
  );

  const endTime = performance.now();

  logger.info(
    `endTime - startTime ::: ${util.inspect(endTime - startTime, {
      showHidden: false,
      depth: null,
      colors: false,
    })}`
  );
};

module.exports = {
  updateAllRepo,
};
