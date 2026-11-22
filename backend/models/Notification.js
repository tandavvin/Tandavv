
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        // User who should receive this notification
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // Store related to this notification
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StoreConfig",
            required: true,
        },

        // Notification category
        type: {
            type: String,
            enum: [
                "store_suspended",
                "store_reactivated",
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },

        // Optional additional information
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: () => ({}),
        },

        // Null means unread; a date means read
        readAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Efficient notification queries for a particular user
notificationSchema.index({
    userId: 1,
    createdAt: -1,
});

notificationSchema.index({
    userId: 1,
    readAt: 1,
    createdAt: -1,
});

module.exports = mongoose.model("Notification", notificationSchema);
