"use strict";
const { Schema, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Brand";
const brandSchema = Schema(
  {
    brand: { type: String, required: true, unique: true },
    image: { type: String, required: false },
    br_category_ids: { type: Array, default: [] },
    deletedAt: { type: Date, required: false, default: null },
  },
  {
    timestamps: true,
  }
);

const Brand = model(DOCUMENT_NAME, brandSchema);

module.exports = Brand;
