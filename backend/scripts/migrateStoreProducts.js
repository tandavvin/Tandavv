
require("dotenv").config();

const mongoose = require("mongoose");
const crypto = require("crypto");

const StoreConfig = require("../models/StoreConfig");

const migrateStoreProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB.");

        const stores = await StoreConfig.find({});

        let migratedProducts = 0;
        let skippedProducts = 0;

        for (const store of stores) {
            const products = store.products || {};

            if (!Array.isArray(products.items)) {
                continue;
            }

            let storeChanged = false;

            const updatedItems = products.items.map((product) => {
                if (!product._id) {
                    storeChanged = true;
                    migratedProducts++;

                    return {
                        ...product,
                        _id: crypto.randomUUID(),
                        status: product.status || "active",
                        createdAt: product.createdAt || new Date(),
                        updatedAt: new Date(),
                    };
                }

                skippedProducts++;
                return product;
            });

            if (storeChanged) {
                store.set("products", {
                    ...products,
                    items: updatedItems,
                });

                store.markModified("products");

                await store.save();

                console.log(`Migrated: ${store.storeName}`);
            }
        }

        console.log("\nMigration completed!");
        console.log(`Products migrated: ${migratedProducts}`);
        console.log(`Products already having IDs: ${skippedProducts}`);

    } catch (error) {
        console.error("Migration failed:", error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

migrateStoreProducts();
