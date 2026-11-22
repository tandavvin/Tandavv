
const mongoose = require("mongoose");
const Notification = require("../models/Notification");

const isValidId = (id) => mongoose.isValidObjectId(id);

// ======================================
// GET ALL NOTIFICATIONS
// GET /api/notifications
// ======================================
const getNotifications = async (req, res) => {
    try {
        const page = Math.max(
            1,
            Number.parseInt(req.query.page, 10) || 1
        );

        const limit = Math.min(
            50,
            Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
        );

        const skip = (page - 1) * limit;

        const [notifications, total, unreadCount] = await Promise.all([
            Notification.find({
                userId: req.user.id,
            })
                .populate("storeId", "storeName slug")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            Notification.countDocuments({
                userId: req.user.id,
            }),

            Notification.countDocuments({
                userId: req.user.id,
                readAt: null,
            }),
        ]);

        return res.status(200).json({
            success: true,
            data: notifications,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            unreadCount,
        });
    } catch (error) {
        console.error("Get notifications error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
        });
    }
};

// ======================================
// GET UNREAD NOTIFICATION COUNT
// GET /api/notifications/unread-count
// ======================================
const getUnreadCount = async (req, res) => {
    try {
        const unreadCount = await Notification.countDocuments({
            userId: req.user.id,
            readAt: null,
        });

        return res.status(200).json({
            success: true,
            unreadCount,
        });
    } catch (error) {
        console.error("Get unread notification count error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch unread notification count",
        });
    }
};

// ======================================
// MARK ONE NOTIFICATION AS READ
// PATCH /api/notifications/:notificationId/read
// ======================================
const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;

        if (!isValidId(notificationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification ID",
            });
        }

        const notification = await Notification.findOneAndUpdate(
            {
                _id: notificationId,
                userId: req.user.id,
            },
            {
                $set: {
                    readAt: new Date(),
                },
            },
            {
                new: true,
            }
        ).lean();

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification,
        });
    } catch (error) {
        console.error("Mark notification as read error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update notification",
        });
    }
};

// ======================================
// MARK ALL NOTIFICATIONS AS READ
// PATCH /api/notifications/read-all
// ======================================
const markAllAsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            {
                userId: req.user.id,
                readAt: null,
            },
            {
                $set: {
                    readAt: new Date(),
                },
            }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        console.error("Mark all notifications as read error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update notifications",
        });
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
};
