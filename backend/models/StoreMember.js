const mongoose = require("mongoose");

const storeMemberSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StoreConfig",
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    role: {
      type: String,
      enum: ["owner", "admin", "manager", "employee", "viewer"],
      default: "employee"
    },
    permissions: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ["active", "pending", "deactivated"],
      default: "active"
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Ensure a user can only have one membership record per store
storeMemberSchema.index({ storeId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("StoreMember", storeMemberSchema);