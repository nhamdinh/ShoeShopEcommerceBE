"use strict";
const { Schema, model } = require("mongoose"); // Erase if already required
//!dmbg
const DOCUMENT_NAME = "MainCode";
const COLLECTION_NAME = "MainCodes";
// Declare the Schema of the Mongo model
const inventorySchema = new Schema(
  {
    mainCode_type: { type: String, require: true },
    mainCode_value: { type: String, require: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);
