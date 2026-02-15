const mongoose = require("mongoose");

const PasteSchema = new mongoose.Schema(
  {
    pasteId: {
      type: String,
      required: true,
      unique: true,
    },
    
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isAnonymous: {
      type: Boolean,
      default: true,
    },

    type: {
      type: String,
      enum: ["text", "file"],
      required: true,
    },

    content: {
      type: String,
      default: null,
    },

    fileUrl: {
      type: String,
      default: null,
    },

    fileMeta: {
      filename: String,
      filesize: Number,
      mimetype: String,
    },

    expiresAt: {
      type: Date,
      default: null,
      index: { expires: 0 },
    },

    isExpired: {
      type: Boolean,
      default: false,
    },

    passwordHash: {
      type: String,
      default: null,
    },

    oneTimeView: {
      type: Boolean,
      default: false,
    },

    maxViews: {
      type: Number,
      default: null,
    },

    currentViews: {
      type: Number,
      default: 0,
    },

    deleteToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Paste", PasteSchema);
