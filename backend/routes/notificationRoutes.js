
const express = require("express");
const router = express.Router();

const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
} = require("../controllers/notificationController");

const { verifyToken } = require("../middleware/authMiddleware");

// All notification APIs require authentication
router.use(verifyToken);

router.get("/unread-count", getUnreadCount);
router.get("/", getNotifications);

router.patch("/read-all", markAllAsRead);
router.patch("/:notificationId/read", markAsRead);

module.exports = router;
