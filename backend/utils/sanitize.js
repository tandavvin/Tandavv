// utils/sanitize.js
//
// Everything the editor sends is user-controlled JSON that is stored in MongoDB and later
// rendered on a PUBLIC page. This module keeps that data safe and bounded:
//   - removes keys MongoDB / JS treat specially ($operators, dotted keys, __proto__ ...)
//   - caps depth, array length, key count and string length
//   - blanks "javascript:" / "vbscript:" strings so they can never become a clickable payload

const MAX_DEPTH = 8;
const MAX_ARRAY = 200;
const MAX_KEYS = 200;
const MAX_STRING = 20000;

const BAD_KEYS = new Set(["__proto__", "constructor", "prototype"]);
const DANGEROUS_PROTOCOL = /^\s*(javascript|vbscript)\s*:/i;

function sanitizeValue(value, depth = 0) {
  if (depth > MAX_DEPTH) return undefined;

  if (value === null) return null;

  switch (typeof value) {
    case "string": {
      if (DANGEROUS_PROTOCOL.test(value)) return "";
      return value.length > MAX_STRING ? value.slice(0, MAX_STRING) : value;
    }
    case "number":
      return Number.isFinite(value) ? value : 0;
    case "boolean":
      return value;
    case "object": {
      if (Array.isArray(value)) {
        return value
          .slice(0, MAX_ARRAY)
          .map((item) => sanitizeValue(item, depth + 1))
          .filter((item) => item !== undefined);
      }
      const out = {};
      let count = 0;
      for (const [key, val] of Object.entries(value)) {
        if (count >= MAX_KEYS) break;
        if (key.startsWith("$") || key.includes(".") || BAD_KEYS.has(key)) continue;
        const clean = sanitizeValue(val, depth + 1);
        if (clean === undefined) continue;
        out[key] = clean;
        count += 1;
      }
      return out;
    }
    default:
      return undefined; // functions, symbols, undefined, bigint
  }
}

const isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

const SECTION_ID = /^[a-z0-9][a-z0-9_-]{0,39}$/;

// [{ id, label, type? }] -> cleaned list (unique ids)
function sanitizeSectionsOrder(list) {
  if (!Array.isArray(list)) return null;
  const seen = new Set();
  const out = [];
  for (const item of list.slice(0, 60)) {
    if (!isPlainObject(item) || typeof item.id !== "string" || !SECTION_ID.test(item.id)) continue;
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    const entry = { id: item.id, label: String(item.label ?? item.id).slice(0, 60) };
    if (typeof item.type === "string" && SECTION_ID.test(item.type)) entry.type = item.type;
    out.push(entry);
  }
  return out;
}

// { [id]: { type, ...fields } } -> cleaned map
function sanitizeCustomSections(map) {
  if (!isPlainObject(map)) return null;
  const out = {};
  for (const [id, cfg] of Object.entries(map).slice(0, 60)) {
    if (!SECTION_ID.test(id) || !isPlainObject(cfg)) continue;
    out[id] = sanitizeValue(cfg, 1);
  }
  return out;
}

const OBJECT_SECTIONS = ["navbar", "hero", "products", "about", "testimonials", "footer", "theme", "seo"];

// Turns an arbitrary request body into the exact $set document we are willing to store.
function buildStoreUpdate(body = {}) {
  const update = {};

  if (typeof body.storeName === "string") {
    const name = body.storeName.trim().slice(0, 80);
    if (name) update.storeName = name;
  }

  for (const key of OBJECT_SECTIONS) {
    if (isPlainObject(body[key])) update[key] = sanitizeValue(body[key]);
  }

  const order = sanitizeSectionsOrder(body.sectionsOrder);
  if (order) update.sectionsOrder = order;

  const custom = sanitizeCustomSections(body.customSections);
  if (custom) update.customSections = custom;

  return update;
}

// ---------- slugs ----------
const RESERVED_SLUGS = new Set([
  "api", "admin", "login", "signup", "dashboard", "editor", "s", "store", "stores", "uploads",
  "assets", "static", "public", "app", "www", "help", "support", "null", "undefined",
]);

function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
}

// returns an error message, or null when the slug is fine
function validateSlug(slug) {
  if (typeof slug !== "string") return "Slug is required";
  if (slug.length < 3 || slug.length > 40) return "Slug must be 3-40 characters";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return "Use only lowercase letters, numbers and single hyphens";
  if (RESERVED_SLUGS.has(slug)) return "This address is reserved, please choose another";
  return null;
}

module.exports = {
  sanitizeValue,
  sanitizeSectionsOrder,
  sanitizeCustomSections,
  buildStoreUpdate,
  slugify,
  validateSlug,
  isPlainObject,
  RESERVED_SLUGS,
};
