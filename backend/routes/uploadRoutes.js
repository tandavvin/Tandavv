// routes/uploadRoutes.js

const express = require("express");
const { uploadImage, listImages, deleteImage } = require("../controllers/uploadController");
const { verifyToken } = require("../middleware/authMiddleware");
const { rateLimit } = require("../utils/rateLimit");

const router = express.Router();

router.use(verifyToken);

const rawImage = express.raw({
  type: ["image/png", "image/jpeg", "image/gif", "image/webp"],
  limit: "5mb",
});

router.post("/", rateLimit({ windowMs: 10 * 60 * 1000, max: 60, message: "Too many uploads, slow down a little." }), rawImage, uploadImage);
router.get("/", listImages);
router.delete("/:name", deleteImage);

module.exports = router;
