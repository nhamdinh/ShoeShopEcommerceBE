"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

//!dmbg
const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = Schema(
  {
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
    cartId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Cart",
    },
    shippingAddress: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Address",
    },
    // orderItems: [
    //   {
    //     name: { type: String, required: true },
    //     qty: { type: Number, required: true },
    //     image: { type: String, required: true },
    //     price: { type: Number, required: true },
    //     product: {
    //       type: String,
    //       required: true,
    //       ref: "Product",
    //     },
    //   },
    // ],
    orderItems: {
      type: Array,
      default: [],
    },
    shopDiscounts: {
      type: Array,
      default: [],
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "Paypal",
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    feeShip: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalAmountPay: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalDiscount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: { type: Date, required: false, default: null },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, orderSchema);
