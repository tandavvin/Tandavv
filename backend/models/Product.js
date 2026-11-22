//models/Product.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        slug: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        compareAtPrice: {
            type: Number,
            default: null,
            min: 0,
        },

        images: {
            type: [String],
            default: [],
        },

        category: {
            type: String,
            trim: true,
            default: "Uncategorized",
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },

        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StoreConfig",
            required: true,
            index: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

productSchema.index({ storeId: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);
