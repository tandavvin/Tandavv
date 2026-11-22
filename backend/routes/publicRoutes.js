// routes/publicRoutes.js

const express = require("express");
const { getPublicStore } = require("../controllers/publicController");
const { rateLimit } = require("../utils/rateLimit");

const router = express.Router();

router.get("/:slug", rateLimit({ windowMs: 60 * 1000, max: 120 }), getPublicStore);

module.exports = router;
