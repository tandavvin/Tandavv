// controllers/configController.js


const mongoose = require("mongoose");

const StoreConfig = require("../models/StoreConfig");
const { buildStoreUpdate, slugify, validateSlug, sanitizeValue, isPlainObject } = require("../utils/sanitize");

const isValidId = (id) => typeof id === "string" && mongoose.isValidObjectId(id);

// what the owner sees (never leaks anything about other users)
const toOwnerJSON = (doc) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  delete obj.__v;
  return obj;
};

const SUMMARY_FIELDS =
  "storeName slug published publishedAt templateId createdAt updatedAt hero.title hero.variant theme.brand navbar.logoName navbar.logoImg";

// ======================================
// GET ALL STORES FOR LOGGED-IN USER
//   ?summary=1  -> light list for the dashboard
// ======================================
const getAllStores = async (req, res) => {
  try {
    const summary = req.query.summary === "1";
    let query = StoreConfig.find({ userId: req.user.id }).sort({ createdAt: 1 });
    if (summary) query = query.select(SUMMARY_FIELDS);
    let stores = await query;

    // first visit: create a default store so the editor always has something to open
    if (stores.length === 0) {
      const created = await StoreConfig.create({ userId: req.user.id, storeName: "My First Store" });
      stores = [created];
    }

    return res.status(200).json({ success: true, count: stores.length, data: stores.map(toOwnerJSON) });
  } catch (error) {
    console.error("Get all stores error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch stores" });
  }
};

// ======================================
// GET ONE STORE   ?storeId=<id>
// ======================================
const getConfig = async (req, res) => {
  try {
    const { storeId } = req.query;
    let config = null;

    if (storeId !== undefined) {
      if (!isValidId(storeId)) return res.status(400).json({ success: false, message: "Invalid store id" });
      config = await StoreConfig.findOne({ _id: storeId, userId: req.user.id });
      if (!config) return res.status(404).json({ success: false, message: "Store not found" });
    } else {
      config = await StoreConfig.findOne({ userId: req.user.id }).sort({ createdAt: 1 });
      if (!config) config = await StoreConfig.create({ userId: req.user.id, storeName: "My First Store" });
    }

    return res.status(200).json({ success: true, data: toOwnerJSON(config) });
  } catch (error) {
    console.error("Get config error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch store configuration" });
  }
};

// ======================================
// CREATE STORE   body: { storeName, templateId?, initial? }
//   `initial` is an optional starter-template config (navbar, hero, ... sectionsOrder, customSections)
// ======================================
const createStore = async (req, res) => {
  try {
    const { storeName, templateId, initial } = req.body || {};

    const doc = {
      userId: req.user.id,
      storeName: (typeof storeName === "string" && storeName.trim().slice(0, 80)) || "New Store",
      templateId: typeof templateId === "string" ? templateId.slice(0, 40) : "default",
    };
    if (isPlainObject(initial)) Object.assign(doc, buildStoreUpdate(initial), { storeName: doc.storeName });

    const store = await StoreConfig.create(doc);
    return res.status(201).json({ success: true, message: "Store created successfully", data: toOwnerJSON(store) });
  } catch (error) {
    console.error("Create store error:", error);
    return res.status(500).json({ success: false, message: "Failed to create store" });
  }
};

// ======================================
// UPDATE STORE   PUT /?storeId=<id>
// ======================================
const updateConfig = async (req, res) => {
  try {
    const { storeId } = req.query;
    if (!storeId) return res.status(400).json({ success: false, message: "Store ID is required" });
    if (!isValidId(storeId)) return res.status(400).json({ success: false, message: "Invalid store id" });

    const update = buildStoreUpdate(req.body || {});
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ success: false, message: "Nothing to update" });
    }

    // CRITICAL: only update when _id matches AND the store belongs to this user
    const updated = await StoreConfig.findOneAndUpdate(
      { _id: storeId, userId: req.user.id },
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Store not found or access denied" });

    return res.status(200).json({ success: true, message: "Configuration saved successfully", data: toOwnerJSON(updated) });
  } catch (error) {
    console.error("Update config error:", error);
    return res.status(500).json({ success: false, message: "Failed to update configuration" });
  }
};

// ======================================
// DELETE STORE   DELETE /:id   (the last remaining store cannot be deleted)
// ======================================
const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ success: false, message: "Invalid store id" });

    const count = await StoreConfig.countDocuments({ userId: req.user.id });
    if (count <= 1) {
      return res.status(409).json({ success: false, message: "You need at least one store. Create another before deleting this one." });
    }

    const deleted = await StoreConfig.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ success: false, message: "Store not found" });

    return res.status(200).json({ success: true, message: "Store deleted" });
  } catch (error) {
    console.error("Delete store error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete store" });
  }
};

// ======================================
// DUPLICATE STORE   POST /:id/duplicate   (copy is unpublished and has no slug)
// ======================================
const duplicateStore = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ success: false, message: "Invalid store id" });

    const source = await StoreConfig.findOne({ _id: id, userId: req.user.id });
    if (!source) return res.status(404).json({ success: false, message: "Store not found" });

    const data = toOwnerJSON(source);
    const copy = await StoreConfig.create({
      userId: req.user.id,
      storeName: `${data.storeName} (copy)`.slice(0, 80),
      templateId: data.templateId,
      navbar: data.navbar,
      hero: data.hero,
      products: data.products,
      about: data.about,
      testimonials: data.testimonials,
      footer: data.footer,
      theme: data.theme,
      seo: data.seo,
      sectionsOrder: data.sectionsOrder,
      customSections: data.customSections,
    });

    return res.status(201).json({ success: true, message: "Store duplicated", data: toOwnerJSON(copy) });
  } catch (error) {
    console.error("Duplicate store error:", error);
    return res.status(500).json({ success: false, message: "Failed to duplicate store" });
  }
};

// ======================================
// PUBLISH / UNPUBLISH   PATCH /:id/publish   body: { published: boolean, slug?: string }
// ======================================
const publishStore = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ success: false, message: "Invalid store id" });

    const { published, slug } = req.body || {};
    if (typeof published !== "boolean") {
      return res.status(400).json({ success: false, message: "`published` must be true or false" });
    }

    const store = await StoreConfig.findOne({ _id: id, userId: req.user.id });
    if (!store) return res.status(404).json({ success: false, message: "Store not found" });

    if (typeof slug === "string" && slug.trim()) {
      const cleanSlug = slug.trim().toLowerCase();
      const problem = validateSlug(cleanSlug);
      if (problem) return res.status(400).json({ success: false, message: problem });

      const taken = await StoreConfig.findOne({ slug: cleanSlug, _id: { $ne: store._id } }).select("_id");
      if (taken) return res.status(409).json({ success: false, message: "That address is already taken" });
      store.slug = cleanSlug;
    }

    if (published) {
      if (!store.slug) {
        // auto-generate from the store name, adding a short random suffix to keep it unique
        const base = slugify(store.storeName) || "store";
        const candidate = `${base}-${Math.random().toString(36).slice(2, 6)}`;
        store.slug = validateSlug(candidate) ? `store-${Math.random().toString(36).slice(2, 8)}` : candidate;
      }
      store.publishedAt = new Date();
    }
    store.published = published;

    await store.save();
    return res.status(200).json({
      success: true,
      message: published ? "Your store is live" : "Your store is no longer public",
      data: toOwnerJSON(store),
    });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: "That address is already taken" });
    console.error("Publish store error:", error);
    return res.status(500).json({ success: false, message: "Failed to update publish status" });
  }
};


// ======================================
// EXPORT STORE DATA   GET /export?storeId=<id>
// ======================================
const exportStoreData = async (req, res) => {
  try {
    const { storeId } = req.query;
    let storeData = null;

    if (storeId !== undefined) {
      if (!isValidId(storeId)) return res.status(400).json({ success: false, message: "Invalid store id" });
      storeData = await StoreConfig.findOne({ _id: storeId, userId: req.user.id });
      if (!storeData) return res.status(404).json({ success: false, message: "Store not found" });
    } else {
      storeData = await StoreConfig.findOne({ userId: req.user.id }).sort({ createdAt: 1 });
      if (!storeData) return res.status(404).json({ success: false, message: "No stores found to export" });
    }

    res.setHeader("Content-Disposition", `attachment; filename=tandav-store-export-${storeData._id}.json`);
    res.setHeader("Content-Type", "application/json");

    return res.status(200).send(JSON.stringify(toOwnerJSON(storeData), null, 2));
  } catch (error) {
    console.error("Export store error:", error);
    return res.status(500).json({ success: false, message: "Failed to export store data" });
  }
};


const addOrUpdatePage = async (req, res) => {
  try {
    const { storeId } = req.query;
    const { name, href, content } = req.body;

    if (!storeId) return res.status(400).json({ success: false, message: "Store ID is required" });

    const store = await StoreConfig.findOne({ _id: storeId, userId: req.user.id });
    if (!store) return res.status(404).json({ success: false, message: "Store not found" });

    // Initialize navbar or custom pages array if missing
    if (!store.navbar) store.navbar = { navLinks: [] };
    if (!store.navbar.navLinks) store.navbar.navLinks = [];

    // Push new page link
    store.navbar.navLinks.push({ name, href });
    await store.save();

    return res.status(200).json({ success: true, message: "Page created successfully", data: store });
  } catch (error) {
    console.error("Add page error:", error);
    return res.status(500).json({ success: false, message: "Failed to create page" });
  }
};

module.exports = {
  getAllStores,
  getConfig,
  createStore,
  updateConfig,
  deleteStore,
  duplicateStore,
  publishStore,
  exportStoreData,
  sanitizeValue,
  addOrUpdatePage,
};