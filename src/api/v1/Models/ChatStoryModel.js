"use strict";
const { Schema, model } = require("mongoose"); // Erase if already required
//!dmbg
const DOCUMENT_NAME = "ChatStory";
// Declare the Schema of the Mongo model
const chatStorySchema = new Schema(
  {
    fromTo: { type: Array, required: false },
    story: { type: Array, required: false },
    deletedAt: { type: Date, required: false, default: null },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, chatStorySchema);
