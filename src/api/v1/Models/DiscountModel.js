"use strict";
const { Schema, model } = require("mongoose"); // Erase if already required
//!dmbg
const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";
// Declare the Schema of the Mongo model
const discountSchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: {
      type: String,
      required: true,
      enum: ["fixed_amount", "percent"],
      default: "fixed_amount",
    },
    discount_value: { type: Number, required: true },

    discount_code: { type: String, required: true },
    discount_start: { type: Date, required: true },
    discount_end: { type: Date, required: true },
    discount_quantity: { type: Number, required: true },
    discount_used: { type: Number, required: true, default: 0 },
    discount_used_users: { type: Array, default: [] },
    discount_useMax_user: { type: Number, required: true, default: 1 },
    discount_order_minValue: { type: Number, required: true, default: 1 },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    discount_isActive: { type: Boolean, default: true },
    discount_applyTo: {
      type: String,
      require: true,
      enum: ["all", "products_special"],
      default: "all",
    },
    discount_productIds: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
