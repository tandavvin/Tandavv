// controllers/publicController.js

const crypto = require("crypto");

const StoreConfig = require("../models/StoreConfig");
const { validateSlug } = require("../utils/sanitize");

const PUBLIC_FIELDS = [
    "storeName",
    "slug",
    "navbar",
    "hero",
    "products",
    "about",
    "testimonials",
    "footer",
    "theme",
    "seo",
    "sectionsOrder",
    "customSections",
    "updatedAt",
];

const getPublicStore = async (req, res) => {
    try {
        const slug = String(req.params.slug || "").toLowerCase();

        if (validateSlug(slug)) {
            return res.status(404).json({
                success: false,
                message: "Store not found",
            });
        }

        const store = await StoreConfig.findOne({ slug });

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found",
            });
        }

        if (store.status === "suspended") {
            res.setHeader("Cache-Control", "no-store");

            return res.status(403).json({
                success: false,
                code: "STORE_SUSPENDED",
                message: "This store is temporarily unavailable.",
            });
        }

        if (store.published !== true) {
            return res.status(404).json({
                success: false,
                message: "Store not found",
            });
        }

        // Ensure every product has a permanent ID.
        const products = store.products || {};
        const items = Array.isArray(products.items)
            ? products.items
            : [];

        let productsChanged = false;

        const normalizedItems = items.map((product) => {
            const updatedProduct = { ...product };

            if (!updatedProduct._id) {
                updatedProduct._id = crypto.randomUUID();
                productsChanged = true;
            }

            if (typeof updatedProduct.description !== "string") {
                updatedProduct.description = "";
                productsChanged = true;
            }

            return updatedProduct;
        });

        // Persist IDs so product URLs remain stable.
        if (productsChanged) {
            store.set("products", {
                ...products,
                items: normalizedItems,
            });

            store.markModified("products");

            await store.save();
        }

        // Prepare approved public store fields.
        const raw = store.toObject();
        const data = {};

        for (const key of PUBLIC_FIELDS) {
            if (raw[key] !== undefined) {
                data[key] = raw[key];
            }
        }

        res.setHeader("Cache-Control", "no-store");

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Public store error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load store",
        });
    }
};

module.exports = { getPublicStore };
