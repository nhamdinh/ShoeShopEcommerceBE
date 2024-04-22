"use strict";
const { model } = require("mongoose");
const util = require("util");
const { uid } = require("uid");
const bcrypt = require("bcrypt");

const logger = require("../log");
const { convertToObjectId } = require("../utils/getInfo");

const updateAllRepo = async () => {
  const Model = model("User");
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

  await Promise.all(
    models.map(async (mmm) => {
      //       mmm.product_slug = toNonAccentVietnamese(mmm.product_name).replaceAll(" ","-");
      //   const zz  =  +mmm.product_price * ( (Math.random() * (50 - 10) + 10) +100    )/100
        // const quantity  =  Math.floor( (Math.random() * (505 - 10) + 11)    )
        const salt = await bcrypt.genSalt(8);

            // mmm.user_salt = salt
            // mmm.password = await bcrypt.hash('123456', salt);
            // await mmm.update(mmm);


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
