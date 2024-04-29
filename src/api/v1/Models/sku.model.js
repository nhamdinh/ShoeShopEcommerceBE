"use strict";
const { Schema, model } = require("mongoose"); // Erase if already required
// const slugify = require("slugify");

const { PRODUCT_TYPE } = require("../utils/constant");
const { toNonAccentVietnamese } = require("../utils/functionHelpers");
const DOCUMENT_NAME = "Sku";
const COLLECTION_NAME = "Skus";

const skusSchema = new Schema(
  {
    sku_id: { type: String, required: true, unique: true }, //{sku_id}-{shop_id}
    sku_product_id: { type: Schema.Types.ObjectId, ref: "Product" }, //ref Spu Products
    sku_tier_index: { type: Array, default: [0] }, //[1,0] | [1,1]
    /* 
    color: ["black","blue"] => [0,1]
    size: ["M","L"] => [0,1]
        */
    sku_stock: { type: Number, default: 0 },
    sku_price: { type: Number, default: 0 },
    sku_sold: { type: Number, default: 0 },
    sku_slug: { type: String, default: "" },
    sku_values: { type: Object, default: null },
    sku_default: { type: Boolean, default: false },
    sku_sort: { type: Number, default: 0 }, // ai trả tiền thì cho lên đầu

    isDraft: { type: Boolean, default: false, index: true },
    isDelete: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true, index: true }, //, select: T/F: always selected/not
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, skusSchema);
