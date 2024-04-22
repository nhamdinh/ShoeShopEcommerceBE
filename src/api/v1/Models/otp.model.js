"use strict";
const { Schema, model } = require("mongoose"); // Erase if already required
//!dmbg
const DOCUMENT_NAME = "Otp";
const COLLECTION_NAME = "Otps";
// Declare the Schema of the Mongo model
const otpSchema = new Schema(
  {
    otp_token: { type: String, require: true, default: "" },
    otp_email: { type: String, require: true, default: "" },
    otp_status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "block"],
    },
    otp_expireAt: { type: Date, default: Date.now, expires: 60 * 5 }, // if 'expireAt' is set, then document expires at expireAt + 11 seconds
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, otpSchema);
