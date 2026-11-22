// routes/configRoutes.js

const express = require("express");
const {
  getAllStores,
  getConfig,
  createStore,
  updateConfig,
  deleteStore,
  duplicateStore,
  publishStore,
  exportStoreData,
} = require("../controllers/configController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(verifyToken);

router.get("/all", getAllStores);
router.get("/export", exportStoreData);
router.get("/", getConfig);
router.post("/create", createStore);
router.put("/", updateConfig);

router.delete("/:id", deleteStore);
router.post("/:id/duplicate", duplicateStore);
router.patch("/:id/publish", publishStore);

module.exports = router;