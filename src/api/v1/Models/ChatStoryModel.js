const mongoose = require("mongoose");

const chatStorySchema = mongoose.Schema(
  {
    fromTo: { type: Array, required: false },
    story: { type: Array, required: false },
    deletedAt: { type: Date, required: false, default: null },
  },
  {
    timestamps: true,
  }
);

const ChatStory = mongoose.model("ChatStory", chatStorySchema);

module.exports = ChatStory;
