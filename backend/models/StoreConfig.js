// models/StoreConfig.js


const mongoose = require("mongoose");

const { Schema } = mongoose;
const mixed = () => ({ type: Schema.Types.Mixed, default: () => ({}) });

const sectionOrderSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, default: "" },
    type: { type: String },
  },
  { _id: false }
);

const storeConfigSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    storeName: { type: String, default: "My Storefront", trim: true, maxlength: 80 },
    storeEmail: { type: String, default: "" },

    // ---- platform store management ----
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
      index: true,
    },
    suspendedAt: {
      type: Date,
      default: null,
    },
    suspensionReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    // ---- publishing ----
    slug: { type: String, lowercase: true, trim: true, unique: true, sparse: true },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },

    // which starter template this store began from (informational)
    templateId: { type: String, default: "default" },

    // ---- page sections (shape owned by the frontend editor) ----
    navbar: mixed(),
    hero: mixed(),
    products: mixed(),
    about: mixed(),
    testimonials: mixed(),
    footer: mixed(),
    theme: mixed(),
    seo: mixed(),

    // order + labels of every section on the page (core and custom)
    sectionsOrder: { type: [sectionOrderSchema], default: [] },
    // settings of user-added sections, keyed by section id
    customSections: mixed(),
  },
  { timestamps: true, minimize: false }
);

module.exports = mongoose.model("StoreConfig", storeConfigSchema);
