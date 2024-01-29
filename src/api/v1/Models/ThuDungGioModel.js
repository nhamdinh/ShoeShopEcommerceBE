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
    address: {
      type: String,
    },
    phone: {
      type: String,
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
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, thuDungGioSchema);
