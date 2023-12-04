"use strict";
const { Schema, model } = require("mongoose"); // Erase if already required
//!dmbg
const DOCUMENT_NAME = "Review";
const COLLECTION_NAME = "Reviews";
// Declare the Schema of the Mongo model
const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      // required: true,
      default: 4,
      min: [1, "Rating must be above 1"],
      max: [5, "Rating must be below 5"],
      // set: (val) => {
      //   Math.round(val * 10) / 10;
      // },
    },
    comment: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    shopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, reviewSchema);
