// controllers/uploadController.js
//
// Image uploads without extra dependencies: the browser sends the raw file as the request body
// (Content-Type: image/png ...). We check size, declared type AND the file's magic bytes, then
// store it in uploads/<userId>/ and serve it from /uploads.
// NOTE: on hosts with an ephemeral disk (Heroku, some containers) use persistent storage or S3.

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const UPLOAD_ROOT = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads"));
const MAX_FILES_PER_USER = 200;

const TYPES = {
  "image/png": { ext: "png", magic: (b) => b.length > 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  "image/jpeg": { ext: "jpg", magic: (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/gif": { ext: "gif", magic: (b) => b.length > 6 && ["GIF87a", "GIF89a"].includes(b.subarray(0, 6).toString("ascii")) },
  "image/webp": { ext: "webp", magic: (b) => b.length > 12 && b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP" },
};

const userDir = (userId) => path.join(UPLOAD_ROOT, String(userId));

const publicBase = (req) => (process.env.PUBLIC_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");

const fileUrl = (req, userId, file) => `${publicBase(req)}/uploads/${userId}/${file}`;

// POST /api/upload
const uploadImage = async (req, res) => {
  try {
    const type = String(req.headers["content-type"] || "").split(";")[0].trim().toLowerCase();
    const spec = TYPES[type];
    if (!spec) {
      return res.status(415).json({ success: false, message: "Only PNG, JPEG, GIF or WebP images are allowed" });
    }

    const body = req.body;
    if (!Buffer.isBuffer(body) || body.length === 0) {
      return res.status(400).json({ success: false, message: "No image received" });
    }
    if (!spec.magic(body)) {
      return res.status(400).json({ success: false, message: "That file does not look like a valid image" });
    }

    const dir = userDir(req.user.id);
    await fs.promises.mkdir(dir, { recursive: true });

    const existing = await fs.promises.readdir(dir);
    if (existing.length >= MAX_FILES_PER_USER) {
      return res.status(413).json({ success: false, message: "Upload limit reached. Delete some images first." });
    }

    const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${spec.ext}`;
    await fs.promises.writeFile(path.join(dir, name), body);

    return res.status(201).json({ success: true, url: fileUrl(req, req.user.id, name), name });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ success: false, message: "Upload failed" });
  }
};

// GET /api/upload  - the user's own images, newest first
const listImages = async (req, res) => {
  try {
    const dir = userDir(req.user.id);
    let files = [];
    try {
      files = await fs.promises.readdir(dir);
    } catch {
      files = [];
    }
    const items = files
      .filter((f) => /\.(png|jpe?g|gif|webp)$/i.test(f))
      .sort()
      .reverse()
      .slice(0, MAX_FILES_PER_USER)
      .map((name) => ({ name, url: fileUrl(req, req.user.id, name) }));
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error("List images error:", error);
    return res.status(500).json({ success: false, message: "Could not list images" });
  }
};

// DELETE /api/upload/:name
const deleteImage = async (req, res) => {
  try {
    const name = String(req.params.name || "");
    if (!/^[0-9]+-[a-f0-9]{12}\.(png|jpg|gif|webp)$/.test(name)) {
      return res.status(400).json({ success: false, message: "Invalid file name" });
    }
    await fs.promises.unlink(path.join(userDir(req.user.id), name));
    return res.status(200).json({ success: true });
  } catch (error) {
    if (error.code === "ENOENT") return res.status(404).json({ success: false, message: "Image not found" });
    console.error("Delete image error:", error);
    return res.status(500).json({ success: false, message: "Could not delete image" });
  }
};

module.exports = { uploadImage, listImages, deleteImage, UPLOAD_ROOT };
