// controllers/adminProductController.js


const mongoose = require("mongoose");
const crypto = require("crypto");

const StoreConfig = require("../models/StoreConfig");

// Get product items safely.
const getProductItems = (store) => {
    const items = store.products?.items;
    return Array.isArray(items) ? items : [];
};

// Assign permanent IDs to legacy products.
// Save the updated product list only when an ID is missing.
const ensureProductIds = async (store) => {
    const products = store.products || {};
    const items = getProductItems(store);

    let changed = false;

    const updatedItems = items.map((product) => {
        if (product._id) return product;

        changed = true;

        return {
            ...product,
            _id: crypto.randomUUID(),
            updatedAt: new Date(),
        };
    });

    if (changed) {
        store.set("products", {
            ...products,
            items: updatedItems,
        });

        store.markModified("products");
        await store.save();
    }

    return updatedItems;
};

// Format product with store information.
const formatProduct = (store, product) => ({
    ...product,
    _id: String(product._id),
    storeId: String(store._id),
    storeName: store.storeName,
    storeSlug: store.slug,
    storeStatus: store.status || "active",
});

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
    try {
        const {
            search = "",
            category = "",
            storeId = "",
            page = 1,
            limit = 10,
        } = req.query;

        const currentPage = Math.max(1, Number(page) || 1);
        const perPage = Math.min(100, Math.max(1, Number(limit) || 10));

        const filter = {};

        if (storeId) {
            if (!mongoose.Types.ObjectId.isValid(storeId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid store ID.",
                });
            }

            filter._id = storeId;
        }

        const stores = await StoreConfig.find(filter).select("storeName slug status products");

        let products = [];

        for (const store of stores) {
            const items = await ensureProductIds(store);

            items.forEach((product) => {
                products.push(formatProduct(store, product));
            });
        }

        if (search.trim()) {
            const searchText = search.trim().toLowerCase();

            products = products.filter((product) =>
                [
                    product.name,
                    product.category,
                    product.storeName,
                ].some((value) =>
                    String(value || "").toLowerCase().includes(searchText)
                )
            );
        }

        if (category) {
            products = products.filter(
                (product) => product.category === category
            );
        }

        products.sort((a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );

        const total = products.length;
        const startIndex = (currentPage - 1) * perPage;

        const paginatedProducts = products.slice(
            startIndex,
            startIndex + perPage
        );

        const stats = {
            totalProducts: total,
            activeProducts: products.filter(
                (product) => product.status !== "inactive"
            ).length,
            inactiveProducts: products.filter(
                (product) => product.status === "inactive"
            ).length,
            totalStores: stores.length,
        };

        return res.status(200).json({
            success: true,
            data: paginatedProducts,
            stats,
            pagination: {
                total,
                page: currentPage,
                limit: perPage,
                totalPages: Math.ceil(total / perPage),
            },
        });
    } catch (error) {
        console.error("Get all products error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch products.",
        });
    }
};

// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {
        const {
            storeId,
            name,
            category,
            price,
            image,
            badge,
            link,
            description,
        } = req.body;

        if (!storeId || !mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({
                success: false,
                message: "A valid store is required.",
            });
        }

        if (!name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Product name is required.",
            });
        }

        if (
            price === undefined ||
            price === null ||
            String(price).trim() === "" ||
            !Number.isFinite(Number(price)) ||
            Number(price) < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid product price.",
            });
        }

        const store = await StoreConfig.findById(storeId);

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found.",
            });
        }

        if (store.status === "suspended") {
            return res.status(403).json({
                success: false,
                message: "Cannot add products to a suspended store.",
            });
        }

        const products = store.products || {};
        const items = await ensureProductIds(store);

        const newProduct = {
            _id: crypto.randomUUID(),
            name: name.trim(),
            description: description?.trim() || "",
            category: category?.trim() || "Uncategorized",
            price: String(price).trim(),
            image: image?.trim() || "",
            badge: badge?.trim() || "",
            link: link?.trim() || "#",
            status: "active",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        store.set("products", {
            ...products,
            items: [...items, newProduct],
        });

        store.markModified("products");
        await store.save();

        return res.status(201).json({
            success: true,
            message: "Product created successfully.",
            data: formatProduct(store, newProduct),
        });
    } catch (error) {
        console.error("Create product error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create product.",
        });
    }
};

// GET SINGLE PRODUCT
const getProductDetails = async (req, res) => {
    try {
        const { storeId, productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid store ID.",
            });
        }

        const store = await StoreConfig.findById(storeId);

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found.",
            });
        }

        const items = await ensureProductIds(store);

        const product = items.find(
            (item) => String(item._id) === productId
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: formatProduct(store, product),
        });
    } catch (error) {
        console.error("Get product details error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch product details.",
        });
    }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const { storeId, productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid store ID.",
            });
        }

        const allowedFields = [
            "name",
            "description",
            "category",
            "price",
            "image",
            "badge",
            "link",
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (
            updates.name !== undefined &&
            (typeof updates.name !== "string" || !updates.name.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Product name cannot be empty.",
            });
        }

        if (updates.price !== undefined) {
            if (
                updates.price === null ||
                String(updates.price).trim() === "" ||
                !Number.isFinite(Number(updates.price)) ||
                Number(updates.price) < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Enter a valid product price.",
                });
            }

            updates.price = String(updates.price).trim();
        }

        if (updates.name !== undefined) {
            updates.name = updates.name.trim();
        }

        if (updates.description !== undefined) {
            if (typeof updates.description !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product description.",
                });
            }

            updates.description = updates.description.trim();
        }

        const store = await StoreConfig.findById(storeId);

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found.",
            });
        }

        const products = store.products || {};
        const items = await ensureProductIds(store);

        const index = items.findIndex(
            (item) => String(item._id) === productId
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        items[index] = {
            ...items[index],
            ...updates,
            updatedAt: new Date(),
        };

        store.set("products", {
            ...products,
            items,
        });

        store.markModified("products");
        await store.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            data: formatProduct(store, items[index]),
        });
    } catch (error) {
        console.error("Update product error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update product.",
        });
    }
};

// UPDATE PRODUCT STATUS
const updateProductStatus = async (req, res) => {
    try {
        const { storeId, productId } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid store ID.",
            });
        }

        if (!["active", "inactive"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product status.",
            });
        }

        const store = await StoreConfig.findById(storeId);

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found.",
            });
        }

        const products = store.products || {};
        const items = await ensureProductIds(store);

        const index = items.findIndex(
            (item) => String(item._id) === productId
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        items[index] = {
            ...items[index],
            status,
            updatedAt: new Date(),
        };

        store.set("products", {
            ...products,
            items,
        });

        store.markModified("products");
        await store.save();

        return res.status(200).json({
            success: true,
            message: `Product ${status === "active" ? "activated" : "deactivated"} successfully.`,
            data: formatProduct(store, items[index]),
        });
    } catch (error) {
        console.error("Update product status error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update product status.",
        });
    }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const { storeId, productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid store ID.",
            });
        }

        const store = await StoreConfig.findById(storeId);

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found.",
            });
        }

        const products = store.products || {};
        const items = await ensureProductIds(store);

        const filteredItems = items.filter(
            (item) => String(item._id) !== productId
        );

        if (filteredItems.length === items.length) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        store.set("products", {
            ...products,
            items: filteredItems,
        });

        store.markModified("products");
        await store.save();

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully.",
        });
    } catch (error) {
        console.error("Delete product error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete product.",
        });
    }
};

module.exports = {
    getAllProducts,
    getProductDetails,
    createProduct,
    updateProduct,
    updateProductStatus,
    deleteProduct,
};
