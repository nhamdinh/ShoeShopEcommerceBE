"use strict";
const { model } = require("mongoose");
const util = require("util");
const logger = require("../log");
const { convertToObjectId } = require("../utils/getInfo");

const updateAllRepo = async () => {
  const Model = model("Product");

  const products1 = await Model.find({}).sort({
    _id: -1,
  });

  // for (let i = 0; i < products1.length; i++) {
  //   const item = products1[i];
  //   item.product_slug = toNonAccentVietnamese(item.product_name).replaceAll(" ","-=");
  //   await item.update(item);
  // }

  const startTime = performance.now();

  await Promise.all(
    products1.map(async (product) => {
      //       product.product_slug = toNonAccentVietnamese(product.product_name).replaceAll(" ","-");
      //   const zz  =  +product.product_price * ( (Math.random() * (50 - 10) + 10) +100    )/100
      //       await product.update(product);
      //   const filter = {
      //       inven_productId: convertToObjectId(productId),
      //       inven_stock: { $gte: quantity },
      //     },
      //     updateSet = {
      //       $inc: {
      //         inven_stock: -quantity,
      //       },
      //       $push: {
      //         inven_reservations: {
      //           cartId,
      //           quantity,
      //           createdOn: new Date(),
      //         },
      //       },
      //     },
      //     options = {
      //       upsert: false,
      //       new: true,
      //     }; /* upsert: them moi(true); new: return du lieu moi */
      //   await Model.findOneAndUpdate(filter, updateSet, options);
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
