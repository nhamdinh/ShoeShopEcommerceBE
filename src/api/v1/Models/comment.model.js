"use strict";
const { Schema, model } = require("mongoose"); // Erase if already required
//!dmbg
const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";
// Declare the Schema of the Mongo model
const reviewSchema = new Schema(
  {
    cmt_productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    cmt_userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cmt_parentId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME,
    },
    cmt_content: { type: String, default: "" },
    cmt_left: { type: Number, default: 0 },
    cmt_right: { type: Number, default: 0 },
    cmt_idDel: { type: Boolean, default: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, reviewSchema);
