"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

//!dmbg
const DOCUMENT_NAME = "ThuDungGio";
const COLLECTION_NAME = "ThuDungGios";

const thuDungGioSchema = Schema(
  {
    sellDate: {
      type: String,
    },
    buyName: {
      type: String,
      trim: true,
    },
    buyNameEng: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    phone: {
      type: String,
      trim: true,
    },
    orderItems: {
      type: Array,
      default: [],
    },
    isGif: {
      type: Boolean,
      required: true,
      default: false,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    isPaidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    metadata: {
      type: String,
    },
    isBan: {
      type: Boolean,
      required: true,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, thuDungGioSchema);
