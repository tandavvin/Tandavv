// tests/run.js  -  `npm test`
//
// Self-contained backend checks (no MongoDB needed): model methods are replaced with an in-memory fake,
// so these tests cover validation, tenant isolation, publishing rules, sanitising and uploads.

const assert = require("node:assert/strict");
const os = require("node:os");
const path = require("node:path");
const fs = require("node:fs");

process.env.JWT_SECRET = "test-secret-test-secret-test-secret";
process.env.UPLOAD_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "tandav-uploads-"));

const mongoose = require("mongoose");
const StoreConfig = require("../models/StoreConfig");
const User = require("../models/User");
const {
  sanitizeValue, buildStoreUpdate, slugify, validateSlug,
} = require("../utils/sanitize");
const config = require("../controllers/configController");
const pub = require("../controllers/publicController");
const auth = require("../controllers/authController");
const upload = require("../controllers/uploadController");
const { verifyToken } = require("../middleware/authMiddleware");

let passed = 0;
const results = [];
async function test(name, fn) {
  try { await fn(); passed += 1; results.push(`  ok   ${name}`); }
  catch (e) { results.push(`  FAIL ${name}\n       ${e.message}`); process.exitCode = 1; }
}

// ---------- tiny express-like helpers ----------
function res() {
  const r = { code: 200, body: null, headers: {} };
  r.status = (c) => { r.code = c; return r; };
  r.json = (b) => { r.body = b; return r; };
  r.setHeader = (k, v) => { r.headers[k] = v; };
  return r;
}
const oid = () => new mongoose.Types.ObjectId();

// ---------- in-memory fake of the models (see tests/fakeDb.js) ----------
const { installFakeDb } = require("./fakeDb");
const { db, users, validationError } = installFakeDb();

(async () => {
  // ========== sanitize ==========
  await test("sanitize strips $operators, dotted keys and prototype keys", () => {
    const out = sanitizeValue({ ok: 1, $where: "x", "a.b": 2, __proto__: { x: 1 }, nested: { $set: 1, fine: "y" } });
    assert.deepEqual(out, { ok: 1, nested: { fine: "y" } });
  });
  await test("sanitize blanks javascript: urls but keeps normal links", () => {
    assert.equal(sanitizeValue("javascript:alert(1)"), "");
    assert.equal(sanitizeValue("  JaVaScRiPt:alert(1)"), "");
    assert.equal(sanitizeValue("https://example.com/a"), "https://example.com/a");
    assert.equal(sanitizeValue("#products"), "#products");
  });
  await test("sanitize caps array length, depth and string size", () => {
    assert.equal(sanitizeValue(Array.from({ length: 500 }, (_, i) => i)).length, 200);
    assert.equal(sanitizeValue("a".repeat(50000)).length, 20000);
    let deep = {}; let cur = deep; for (let i = 0; i < 20; i++) { cur.n = {}; cur = cur.n; }
    assert.ok(JSON.stringify(sanitizeValue(deep)).length < JSON.stringify(deep).length);
  });
  await test("buildStoreUpdate only keeps known keys and validates section lists", () => {
    const u = buildStoreUpdate({
      storeName: "  My Shop  ", userId: "evil", published: true, slug: "hijack",
      navbar: { logoName: "X" }, hero: "not-an-object",
      sectionsOrder: [{ id: "hero", label: "Hero" }, { id: "BAD ID" }, { id: "hero" }, { id: "faq-1", label: "FAQ", type: "faq" }],
      customSections: { "faq-1": { type: "faq", items: [] }, "bad id": { x: 1 } },
    });
    assert.deepEqual(Object.keys(u).sort(), ["customSections", "navbar", "sectionsOrder", "storeName"]);
    assert.equal(u.storeName, "My Shop");
    assert.deepEqual(u.sectionsOrder.map((s) => s.id), ["hero", "faq-1"]);
    assert.deepEqual(Object.keys(u.customSections), ["faq-1"]);
  });
  await test("slugify / validateSlug", () => {
    assert.equal(slugify("Srusti's  Store!"), "srusti-s-store");
    assert.equal(validateSlug("my-shop"), null);
    assert.ok(validateSlug("ab"));
    assert.ok(validateSlug("My_Shop"));
    assert.ok(validateSlug("api"));
    assert.ok(validateSlug("a--b"));
  });

  // ========== schema ==========
  await test("StoreConfig schema accepts rich section JSON and rejects missing userId", async () => {
    const good = await validationError({
      userId: oid(), navbar: { logoName: "Z", navLinks: [{ name: "Home", href: "#" }] },
      hero: { variant: "slider", places: [{ title: "a" }] }, customSections: { "faq-1": { type: "faq" } },
      sectionsOrder: [{ id: "hero", label: "Hero" }],
    });
    assert.equal(good, null);
    assert.ok(await validationError({ navbar: {} }));
  });

  // ========== config controller + tenant isolation ==========
  const userA = { id: String(oid()) };
  const userB = { id: String(oid()) };

  let storeA1;
  await test("getAllStores auto-creates a first store", async () => {
    const r = res();
    await config.getAllStores({ user: userA, query: {} }, r);
    assert.equal(r.code, 200); assert.equal(r.body.count, 1);
    storeA1 = r.body.data[0];
  });
  await test("createStore accepts starter config and sanitises it", async () => {
    const r = res();
    await config.createStore({ user: userA, body: { storeName: "Second", templateId: "fashion", initial: { hero: { title: "Hi", $evil: 1 }, theme: { brand: "rose" } } } }, r);
    assert.equal(r.code, 201);
    assert.equal(r.body.data.storeName, "Second");
    assert.equal(r.body.data.hero.title, "Hi");
    assert.equal(r.body.data.hero.$evil, undefined);
    assert.equal(String(r.body.data.userId), userA.id);
  });
  await test("updateConfig saves allowed fields and ignores protected ones", async () => {
    const r = res();
    await config.updateConfig({ user: userA, query: { storeId: String(storeA1._id) }, body: { hero: { title: "New" }, userId: "x", slug: "evil", published: true } }, r);
    assert.equal(r.code, 200);
    assert.equal(r.body.data.hero.title, "New");
    assert.equal(r.body.data.published, false);
    assert.equal(r.body.data.slug, undefined);
  });
  await test("another user cannot read, update, duplicate, publish or delete my store", async () => {
    const id = String(storeA1._id);
    let r = res(); await config.getConfig({ user: userB, query: { storeId: id } }, r); assert.equal(r.code, 404);
    r = res(); await config.updateConfig({ user: userB, query: { storeId: id }, body: { hero: { title: "pwn" } } }, r); assert.equal(r.code, 404);
    r = res(); await config.duplicateStore({ user: userB, params: { id } }, r); assert.equal(r.code, 404);
    r = res(); await config.publishStore({ user: userB, params: { id }, body: { published: true } }, r); assert.equal(r.code, 404);
    r = res(); await config.deleteStore({ user: userB, params: { id } }, r); assert.ok([404, 409].includes(r.code));
    assert.equal(db.find((d) => String(d._id) === id).hero.title, "New");
  });
  await test("invalid ids and empty updates are rejected", async () => {
    let r = res(); await config.getConfig({ user: userA, query: { storeId: "nope" } }, r); assert.equal(r.code, 400);
    r = res(); await config.updateConfig({ user: userA, query: { storeId: String(oid()) }, body: {} }, r); assert.equal(r.code, 400);
    r = res(); await config.updateConfig({ user: userA, query: {}, body: { hero: {} } }, r); assert.equal(r.code, 400);
  });
  await test("duplicateStore copies content but not publish state", async () => {
    const r = res();
    await config.duplicateStore({ user: userA, params: { id: String(storeA1._id) } }, r);
    assert.equal(r.code, 201); assert.equal(r.body.data.hero.title, "New");
    assert.equal(r.body.data.published, false); assert.equal(r.body.data.slug, undefined);
  });
  await test("publish: slug rules, uniqueness, auto slug and unpublish", async () => {
    const id = String(storeA1._id);
    let r = res(); await config.publishStore({ user: userA, params: { id }, body: { published: true, slug: "api" } }, r); assert.equal(r.code, 400);
    r = res(); await config.publishStore({ user: userA, params: { id }, body: { published: "yes" } }, r); assert.equal(r.code, 400);
    r = res(); await config.publishStore({ user: userA, params: { id }, body: { published: true, slug: "my-shop" } }, r);
    assert.equal(r.code, 200); assert.equal(r.body.data.slug, "my-shop"); assert.equal(r.body.data.published, true);
    // second store of another user cannot take the same slug
    const b = await StoreConfig.create({ userId: userB.id, storeName: "B shop" });
    r = res(); await config.publishStore({ user: userB, params: { id: String(b._id) }, body: { published: true, slug: "my-shop" } }, r); assert.equal(r.code, 409);
    r = res(); await config.publishStore({ user: userB, params: { id: String(b._id) }, body: { published: true } }, r);
    assert.equal(r.code, 200); assert.match(r.body.data.slug, /^b-shop-[a-z0-9]{4}$/);
  });
  await test("public endpoint serves published stores only and hides private fields", async () => {
    let r = res(); await pub.getPublicStore({ params: { slug: "my-shop" } }, r);
    assert.equal(r.code, 200); assert.equal(r.body.data.userId, undefined); assert.equal(r.body.data.hero.title, "New");
    const hidden = db.find((d) => d.slug === "my-shop"); hidden.published = false;
    r = res(); await pub.getPublicStore({ params: { slug: "my-shop" } }, r); assert.equal(r.code, 404);
    hidden.published = true;
    r = res(); await pub.getPublicStore({ params: { slug: "does-not-exist" } }, r); assert.equal(r.code, 404);
  });
  await test("the last remaining store cannot be deleted; others can", async () => {
    const mine = db.filter((d) => String(d.userId) === userA.id);
    assert.ok(mine.length >= 3);
    let r = res(); await config.deleteStore({ user: userA, params: { id: String(mine[0]._id) } }, r); assert.equal(r.code, 200);
    const only = db.filter((d) => String(d.userId) === userB.id);
    r = res(); await config.deleteStore({ user: userB, params: { id: String(only[0]._id) } }, r);
    assert.equal(r.code, only.length > 1 ? 200 : 409);
  });

  // ========== auth ==========

  await test("signup validates input, hashes password, creates first store and returns a token", async () => {
    let r = res(); await auth.signupUser({ body: { name: "A", username: "a b", email: "x", password: "1" } }, r); assert.equal(r.code, 400);
    r = res(); await auth.signupUser({ body: { name: "Ann", username: "Ann_1", email: "ANN@Example.com", password: "secret1" } }, r);
    assert.equal(r.code, 201); assert.ok(r.body.token); assert.equal(r.body.user.email, "ann@example.com"); assert.equal(r.body.user.password, undefined);
    assert.notEqual(users[0].password, "secret1");
    assert.ok(db.some((d) => String(d.userId) === String(users[0]._id) && d.storeName === "Ann's Store"));
    r = res(); await auth.signupUser({ body: { name: "Ann", username: "ann_1", email: "other@example.com", password: "secret1" } }, r); assert.equal(r.code, 409);
  });
  await test("login works with any email casing and rejects wrong passwords", async () => {
    let r = res(); await auth.loginUser({ body: { email: " ANN@example.com ", password: "secret1" } }, r); assert.equal(r.code, 200);
    r = res(); await auth.loginUser({ body: { email: "ann@example.com", password: "wrong" } }, r); assert.equal(r.code, 401);
    r = res(); await auth.loginUser({ body: {} }, r); assert.equal(r.code, 400);
  });
  await test("verifyToken accepts real tokens and rejects bad ones", async () => {
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ id: "abc" }, process.env.JWT_SECRET);
    let called = false; const req = { headers: { authorization: `Bearer ${token}` } };
    verifyToken(req, res(), () => { called = true; });
    assert.ok(called); assert.equal(req.user.id, "abc");
    const r = res(); verifyToken({ headers: { authorization: "Bearer nope" } }, r, () => assert.fail("should not pass")); assert.equal(r.code, 401);
    const r2 = res(); verifyToken({ headers: {} }, r2, () => assert.fail("should not pass")); assert.equal(r2.code, 401);
  });

  // ========== uploads ==========
  const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(32)]);
  const mkReq = (type, body, user = userA) => ({ user, headers: { "content-type": type }, body, protocol: "http", get: () => "localhost:5000", params: {} });

  await test("upload accepts a real PNG and stores it under the user's folder", async () => {
    const r = res(); await upload.uploadImage(mkReq("image/png", png), r);
    assert.equal(r.code, 201); assert.match(r.body.url, new RegExp(`^http://localhost:5000/uploads/${userA.id}/\\d+-[a-f0-9]{12}\\.png$`));
    assert.ok(fs.existsSync(path.join(process.env.UPLOAD_DIR, userA.id, r.body.name)));
    const l = res(); await upload.listImages({ user: userA, params: {}, protocol: "http", get: () => "localhost:5000" }, l);
    assert.equal(l.body.data.length, 1);
    const d = res(); await upload.deleteImage({ user: userA, params: { name: r.body.name } }, d); assert.equal(d.code, 200);
  });
  await test("upload rejects disguised files, wrong types and path tricks", async () => {
    let r = res(); await upload.uploadImage(mkReq("image/png", Buffer.from("<script>alert(1)</script>")), r); assert.equal(r.code, 400);
    r = res(); await upload.uploadImage(mkReq("image/svg+xml", Buffer.from("<svg/>")), r); assert.equal(r.code, 415);
    r = res(); await upload.uploadImage(mkReq("image/png", undefined), r); assert.equal(r.code, 400);
    r = res(); await upload.deleteImage({ user: userA, params: { name: "../../etc/passwd" } }, r); assert.equal(r.code, 400);
  });

  console.log(results.join("\n"));
  console.log(`\n${passed}/${results.length} backend checks passed`);
  fs.rmSync(process.env.UPLOAD_DIR, { recursive: true, force: true });
})();
