"use strict";
const { Schema, model } = require("mongoose"); // Erase if already required
// const slugify = require("slugify");

const { PRODUCT_TYPE } = require("../utils/constant");
const { toNonAccentVietnamese } = require("../utils/functionHelpers");
const DOCUMENT_NAME = "Spu";
const COLLECTION_NAME = "Spus";

// product_id: { type: String, default: "" },
const spusSchema = new Schema(
  {
    product_name: { type: String, required: true, trim: true },
    product_slug: String,
    product_thumb: { type: String, required: true },
    product_thumb_small: { type: String, trim: true },
    product_description: { type: String, default: "" },
    product_original_price: { type: Number, default: 0 },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_sold: { type: Number, default: 0 },
    // product_type: {
    //   type: String,
    //   required: true,
    //   enum: [...PRODUCT_TYPE],
    // },
    product_shop: { type: Schema.Types.ObjectId, ref: "User" },
    product_attributes: { type: Array, default: [], required: false },
    /* 
    {
        attribute_id:"abc123",
        attribute_values:[
            {
                value_id:"value123"
            }
        ],
    }
     */
    product_ratings: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1"],
      max: [5, "Rating must be below 5"],
      // set: (val) => {
      //   Math.round(val * 10) / 10;
      // },
    },
    product_variants: {
      type: Array,
      default: [],
    },

    /* 
    tier_variants: [
        {
            images:[],
            name:"color",
            value:["red", "green", "blue"],
        },
        {
            images:[],
            name:"size",
            value:["X", "M", "L"],
        },
    ]
    */
    product_categories: {
      type: Array,
      default: [],
    },
    isDraft: { type: Boolean, default: false, index: true },
    isDelete: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true, index: true }, //, select: T/F: always selected/not
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, spusSchema);
