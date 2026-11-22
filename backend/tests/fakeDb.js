// tests/fakeDb.js
//
// A tiny in-memory stand-in for the Mongoose models, so the API can be exercised without MongoDB.
// installFakeDb() replaces the static methods the controllers use and returns the raw stores.

const mongoose = require("mongoose");
const StoreConfig = require("../models/StoreConfig");
const User = require("../models/User");

const oid = () => new mongoose.Types.ObjectId();

function installFakeDb() {
  const db = [];
  const users = [];

  const chain = (rows) => {
    const p = Promise.resolve(rows);
    const q = { sort: () => q, select: () => q, then: (a, b) => p.then(a, b), catch: (b) => p.catch(b) };
    return q;
  };
  const matches = (doc, f) =>
    Object.entries(f).every(([k, v]) => {
      if (v && typeof v === "object" && "$ne" in v) return String(doc[k]) !== String(v.$ne);
      return String(doc[k]) === String(v);
    });
  const wrap = (raw) => ({
    ...raw,
    toObject() {
      const o = { ...this };
      for (const k of ["toObject", "save"]) delete o[k];
      return JSON.parse(JSON.stringify(o));
    },
    async save() {
      this.updatedAt = new Date();
      return this;
    },
  });
  const validationError = async (data) => {
    try { await new StoreConfig(data).validate(); return null; } catch (e) { return e; }
  };

  StoreConfig.create = async (data) => {
    const err = await validationError(data);
    if (err) throw err;
    const doc = wrap({
      _id: oid(), createdAt: new Date(), updatedAt: new Date(), published: false,
      storeName: "My Storefront", navbar: {}, hero: {}, ...data,
    });
    db.push(doc);
    return doc;
  };
  StoreConfig.find = (f) => chain(db.filter((d) => matches(d, f)));
  StoreConfig.findOne = (f) => chain(db.find((d) => matches(d, f)) || null);
  StoreConfig.countDocuments = async (f) => db.filter((d) => matches(d, f)).length;
  StoreConfig.findOneAndUpdate = async (f, upd) => {
    const d = db.find((x) => matches(x, f));
    if (!d) return null;
    Object.assign(d, upd.$set, { updatedAt: new Date() });
    return d;
  };
  StoreConfig.findOneAndDelete = async (f) => {
    const i = db.findIndex((x) => matches(x, f));
    return i < 0 ? null : db.splice(i, 1)[0];
  };

  User.findOne = async (f) => {
    const ors = f.$or;
    return (
      users.find((u) =>
        f.email ? u.email === f.email : ors.some((c) => (c.email && u.email === c.email) || (c.username && u.username === c.username))
      ) || null
    );
  };
  User.create = async (d) => {
    const u = { _id: oid(), ...d };
    users.push(u);
    return u;
  };
  User.findById = async (id) => users.find((u) => String(u._id) === String(id)) || null;

  return { db, users, validationError };
}

module.exports = { installFakeDb, oid };
