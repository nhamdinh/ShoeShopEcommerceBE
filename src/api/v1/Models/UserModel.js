const { Schema, model } = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const { AVATAR } = require("../utils/constant");
const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userSchema = Schema(
  {
    productShopName: {
      type: String,
      required: false,
      trim: true,
      maxLength: 150,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: false,
      trim: true,
    },
    avatar: {
      type: String,
      required: false,
      unique: false,
      trim: true,
      default: AVATAR,
    },
    password: {
      type: String,
      required: true,
    },
    user_salt: {
      type: String,
      required: false,
    },
    countChat: {
      type: Number,
      required: false,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isShop: {
      type: Boolean,
      required: true,
      default: false,
    },
    buyer: {
      type: Array,
      required: false,
      default: [],
    },
    refreshToken: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    verify: {
      type: Boolean,
      default: true,
    },
    roles: {
      type: Array,
      default: [],
    },
    // passwordChangedAt: Date,
    // passwordResetToken: String,
    // passwordResetExpires: Date,
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// // Login
// userSchema.methods.matchPassword = async function (enterPassword) {
//   return await bcrypt.compare(enterPassword, this.password);
// };

// Register
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(8);
  this.password = await bcrypt.hash(this.password, salt);
  this.user_salt = salt;
});

module.exports = model(DOCUMENT_NAME, userSchema);
