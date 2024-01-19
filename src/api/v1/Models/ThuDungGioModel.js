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
    },
    orderItems: {
      type: Array,
      default: [],
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    metadata: {
      type: String,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, thuDungGioSchema);
