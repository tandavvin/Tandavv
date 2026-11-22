// controllers/adminStoreController.js


const mongoose = require("mongoose");

const StoreConfig = require("../models/StoreConfig");
const User = require("../models/User");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");

const isValidId = (id) =>
    typeof id === "string" && mongoose.isValidObjectId(id);

const OWNER_FIELDS = "name username email status createdAt";

// Escape dynamic content before inserting it into an HTML email.
const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    })[char]);

// ======================================
// NOTIFY STORE OWNER
// ======================================
const notifyStoreOwner = async ({ store, type, reason = "" }) => {
    try {
        const ownerId = store.userId?._id || store.userId;

        const owner = await User.findById(ownerId).select("name email");

        if (!owner) {
            console.error("Store owner not found:", ownerId);
            return;
        }

        const isSuspended = type === "store_suspended";

        const title = isSuspended
            ? "Store Suspended"
            : "Store Reactivated";

        const message = isSuspended
            ? `Your store ${store.storeName} has been temporarily suspended.`
            : `Your store ${store.storeName} has been reactivated and is available again.`;

        // 1. Create persistent dashboard notification
        try {
            await Notification.create({
                userId: owner._id,
                storeId: store._id,
                type,
                title,
                message,
                metadata: {
                    storeName: store.storeName,
                    slug: store.slug,
                    ...(isSuspended ? { reason } : {}),
                },
            });
        } catch (notificationError) {
            console.error(
                "Failed to create store notification:",
                notificationError
            );
        }

        // 2. Send email separately
        // Email failure must never undo the store status change.
        if (!owner.email) {
            console.error("Store owner has no registered email:", owner._id);
            return;
        }

        const supportEmail = process.env.SUPPORT_EMAIL || "";

        const safeName = escapeHtml(owner.name || "Store Owner");
        const safeStoreName = escapeHtml(store.storeName);
        const safeReason = escapeHtml(reason || "No additional reason provided.");
        const safeSupportEmail = escapeHtml(supportEmail);

        const subject = isSuspended
            ? `Important: Your ${store.storeName} store has been suspended`
            : `Your ${store.storeName} store has been reactivated`;

        const html = isSuspended
            ? `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Store Suspension Notice</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, Helvetica, sans-serif; color:#111827;">
            <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
                Your Tandav store has been temporarily suspended.
            </div>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f3f4f6;">
                <tr>
                    <td align="center" style="padding:40px 16px;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px; background-color:#ffffff; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">

                            <tr>
                                <td height="5" style="height:5px; background-color:#ea580c; font-size:0; line-height:0;">&nbsp;</td>
                            </tr>

                            <tr>
                                <td style="padding:24px 32px; border-bottom:1px solid #f3f4f6;">
                                    <span style="font-size:18px; line-height:24px; font-weight:700; letter-spacing:1px; color:#111827; text-transform:uppercase;">
                                        Tandav
                                    </span>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:32px;">
                                    <p style="margin:0 0 10px; font-size:12px; line-height:18px; font-weight:700; letter-spacing:1px; color:#ea580c; text-transform:uppercase;">
                                        Store status update
                                    </p>

                                    <h1 style="margin:0 0 16px; font-size:24px; line-height:32px; font-weight:700; color:#111827;">
                                        Store Suspension Notice
                                    </h1>

                                    <p style="margin:0 0 16px; font-size:15px; line-height:24px; color:#4b5563;">
                                        Hello ${safeName},
                                    </p>

                                    <p style="margin:0 0 24px; font-size:15px; line-height:24px; color:#4b5563;">
                                        Your store <strong style="color:#111827;">${safeStoreName}</strong> has been temporarily suspended by the Tandav platform administrator.
                                    </p>

                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;">
                                        <tr>
                                            <td style="padding:18px 20px; background-color:#fff7ed; border:1px solid #fed7aa; border-radius:8px;">
                                                <p style="margin:0 0 8px; font-size:14px; line-height:20px; font-weight:700; color:#9a3412;">
                                                    Reason for suspension
                                                </p>
                                                <p style="margin:0; font-size:14px; line-height:22px; color:#7c2d12;">
                                                    ${safeReason}
                                                </p>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="margin:0 0 20px; font-size:14px; line-height:22px; color:#4b5563;">
                                        Your public storefront is currently unavailable. Please contact Tandav Support if you need clarification or assistance resolving this issue.
                                    </p>

                                    ${supportEmail
                ? `<p style="margin:0 0 24px; font-size:14px; line-height:22px; color:#4b5563;">Support email: <a href="mailto:${safeSupportEmail}" style="color:#ea580c; text-decoration:underline;">${safeSupportEmail}</a></p>`
                : `<p style="margin:0 0 24px; font-size:14px; line-height:22px; color:#4b5563;">Please contact Tandav Support through the platform's support channel.</p>`
            }

                                    <p style="margin:0; font-size:14px; line-height:22px; color:#4b5563;">
                                        Regards,<br />
                                        <strong style="color:#111827;">Tandav Support Team</strong>
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:18px 32px; background-color:#f9fafb; border-top:1px solid #e5e7eb; text-align:center;">
                                    <p style="margin:0; font-size:12px; line-height:18px; color:#9ca3af;">
                                        This is an automated account notification.
                                    </p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `
            : `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Store Reactivated</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, Helvetica, sans-serif; color:#111827;">
            <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
                Your Tandav store has been reactivated and is available again.
            </div>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f3f4f6;">
                <tr>
                    <td align="center" style="padding:40px 16px;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px; background-color:#ffffff; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">

                            <tr>
                                <td height="5" style="height:5px; background-color:#ea580c; font-size:0; line-height:0;">&nbsp;</td>
                            </tr>

                            <tr>
                                <td style="padding:24px 32px; border-bottom:1px solid #f3f4f6;">
                                    <span style="font-size:18px; line-height:24px; font-weight:700; letter-spacing:1px; color:#111827; text-transform:uppercase;">
                                        Tandav
                                    </span>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:32px;">
                                    <p style="margin:0 0 10px; font-size:12px; line-height:18px; font-weight:700; letter-spacing:1px; color:#ea580c; text-transform:uppercase;">
                                        Store status update
                                    </p>

                                    <h1 style="margin:0 0 16px; font-size:24px; line-height:32px; font-weight:700; color:#111827;">
                                        Your Store Is Back Online
                                    </h1>

                                    <p style="margin:0 0 16px; font-size:15px; line-height:24px; color:#4b5563;">
                                        Hello ${safeName},
                                    </p>

                                    <p style="margin:0 0 24px; font-size:15px; line-height:24px; color:#4b5563;">
                                        Good news! Your store <strong style="color:#111827;">${safeStoreName}</strong> has been reactivated by the Tandav platform administrator.
                                    </p>

                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;">
                                        <tr>
                                            <td style="padding:18px 20px; background-color:#fff7ed; border:1px solid #fed7aa; border-radius:8px;">
                                                <p style="margin:0; font-size:14px; line-height:22px; color:#7c2d12;">
                                                    Your public storefront is available again.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="margin:0; font-size:14px; line-height:22px; color:#4b5563;">
                                        Regards,<br />
                                        <strong style="color:#111827;">Tandav Support Team</strong>
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:18px 32px; background-color:#f9fafb; border-top:1px solid #e5e7eb; text-align:center;">
                                    <p style="margin:0; font-size:12px; line-height:18px; color:#9ca3af;">
                                        This is an automated account notification.
                                    </p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
        const text = isSuspended
            ? `Hello ${owner.name || "Store Owner"},

Your store ${store.storeName} has been temporarily suspended.

Reason: ${reason || "No additional reason provided."}

Please contact Tandav Support for assistance.
${supportEmail ? `Support email: ${supportEmail}` : ""}

Regards,
Tandav Support Team`
            : `Hello ${owner.name || "Store Owner"},

Your store ${store.storeName} has been reactivated.

Your public storefront is available again.

Regards,
Tandav Support Team`;

        try {
            await sendEmail({
                to: owner.email,
                subject,
                html,
                text,
            });

            console.log(`Store status email sent to ${owner.email}`);
        } catch (emailError) {
            console.error(
                "Failed to send store status email:",
                emailError
            );
        }
    } catch (error) {
        console.error("Store owner notification error:", error);
    }
};


// ======================================
// GET ALL PLATFORM STORES
// GET /api/admin/stores
// ======================================
const getAllStores = async (req, res) => {
    try {
        const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
        const limit = Math.min(
            100,
            Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
        );

        const search = String(req.query.search || "").trim();
        const status = req.query.status || "all";
        const published = req.query.published || "all";

        const filter = {};

        // Older stores without a status are treated as active.
        if (status === "active") {
            filter.$or = [
                { status: "active" },
                { status: { $exists: false } },
            ];
        } else if (status === "suspended") {
            filter.status = "suspended";
        } else if (status !== "all") {
            return res.status(400).json({
                success: false,
                message: "Invalid store status filter",
            });
        }

        if (published === "published") {
            filter.published = true;
        } else if (published === "unpublished") {
            filter.published = false;
        } else if (published !== "all") {
            return res.status(400).json({
                success: false,
                message: "Invalid publishing filter",
            });
        }

        // Search store fields and owner account fields.
        if (search) {
            const regex = new RegExp(
                search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                "i"
            );

            const matchingOwners = await User.find({
                $or: [
                    { name: regex },
                    { username: regex },
                    { email: regex },
                ],
            }).distinct("_id");

            filter.$and = [
                ...(filter.$and || []),
                {
                    $or: [
                        { storeName: regex },
                        { storeEmail: regex },
                        { slug: regex },
                        { templateId: regex },
                        { userId: { $in: matchingOwners } },
                    ],
                },
            ];
        }

        const skip = (page - 1) * limit;

        const [stores, total, statistics] = await Promise.all([
            // 1. Fetch stores with owner information
            StoreConfig.find(filter)
                .populate("userId", OWNER_FIELDS)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            // 2. Count stores matching the current filters
            StoreConfig.countDocuments(filter),

            // 3. Get platform-wide store statistics
            StoreConfig.aggregate([
                {
                    $group: {
                        _id: null,

                        // Total stores
                        total: {
                            $sum: 1,
                        },

                        // Suspended stores
                        suspended: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$status", "suspended"] },
                                    1,
                                    0,
                                ],
                            },
                        },

                        // Active stores (including older records without status)
                        active: {
                            $sum: {
                                $cond: [
                                    {
                                        $ne: ["$status", "suspended"],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },

                        // Published stores
                        published: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$published", true] },
                                    1,
                                    0,
                                ],
                            },
                        },

                        // Unpublished stores
                        unpublished: {
                            $sum: {
                                $cond: [
                                    { $ne: ["$published", true] },
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },
            ]),
        ]);

        const stats = statistics[0] || {
            total: 0,
            active: 0,
            suspended: 0,
            published: 0,
            unpublished: 0,
        };

        return res.status(200).json({
            success: true,
            data: stores,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            statistics: {
                total: stats.total,
                active: stats.active,
                suspended: stats.suspended,
                published: stats.published,
                unpublished: stats.unpublished,
            },
        });
    } catch (error) {
        console.error("Admin get all stores error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch platform stores",
        });
    }
};

// ======================================
// GET SINGLE STORE DETAILS
// GET /api/admin/stores/:storeId
// ======================================
const getStoreDetails = async (req, res) => {
    try {
        const { storeId } = req.params;

        if (!isValidId(storeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid store ID",
            });
        }

        const store = await StoreConfig.findById(storeId)
            .populate("userId", OWNER_FIELDS)
            .lean();

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: store,
        });
    } catch (error) {
        console.error("Admin get store details error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch store details",
        });
    }
};

// ======================================
// UPDATE STORE INFORMATION
// PUT /api/admin/stores/:storeId
// ======================================
const updateStore = async (req, res) => {
    try {
        const { storeId } = req.params;
        const { storeName, storeEmail, templateId } = req.body || {};

        if (!isValidId(storeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid store ID",
            });
        }

        const update = {};

        if (storeName !== undefined) {
            if (
                typeof storeName !== "string" ||
                !storeName.trim() ||
                storeName.trim().length > 80
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Store name must contain 1–80 characters",
                });
            }

            update.storeName = storeName.trim();
        }

        if (storeEmail !== undefined) {
            if (
                typeof storeEmail !== "string" ||
                storeEmail.length > 254
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid store email",
                });
            }

            const cleanEmail = storeEmail.trim();

            if (
                cleanEmail &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid store email",
                });
            }

            update.storeEmail = cleanEmail;
        }

        if (templateId !== undefined) {
            if (
                typeof templateId !== "string" ||
                !templateId.trim() ||
                templateId.trim().length > 40
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid template ID",
                });
            }

            update.templateId = templateId.trim();
        }

        if (Object.keys(update).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Nothing to update",
            });
        }

        const store = await StoreConfig.findByIdAndUpdate(
            storeId,
            { $set: update },
            { new: true, runValidators: true }
        ).populate("userId", OWNER_FIELDS);

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Store updated successfully",
            data: store,
        });
    } catch (error) {
        console.error("Admin update store error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update store",
        });
    }
};

// ======================================
// SUSPEND STORE
// PATCH /api/admin/stores/:storeId/suspend
// ======================================
// ======================================
// SUSPEND STORE
// PATCH /api/admin/stores/:storeId/suspend
// ======================================
const suspendStore = async (req, res) => {
    try {
        const { storeId } = req.params;
        const { reason = "" } = req.body || {};

        if (!isValidId(storeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid store ID",
            });
        }

        if (typeof reason !== "string" || reason.length > 500) {
            return res.status(400).json({
                success: false,
                message: "Suspension reason cannot exceed 500 characters",
            });
        }

        const store = await StoreConfig.findById(storeId);

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found",
            });
        }

        // Avoid duplicate notifications and emails
        if (store.status === "suspended") {
            return res.status(200).json({
                success: true,
                message: "Store is already suspended",
                data: store,
            });
        }

        // 1. Update store status first
        store.status = "suspended";
        store.suspendedAt = new Date();
        store.suspensionReason = reason.trim();

        await store.save();

        // 2. Notify owner and send email
        await notifyStoreOwner({
            store,
            type: "store_suspended",
            reason: reason.trim(),
        });

        await store.populate("userId", OWNER_FIELDS);

        return res.status(200).json({
            success: true,
            message: "Store suspended successfully",
            data: store,
        });
    } catch (error) {
        console.error("Admin suspend store error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to suspend store",
        });
    }
};

// ======================================
// REACTIVATE STORE
// PATCH /api/admin/stores/:storeId/reactivate
// ======================================
// ======================================
// REACTIVATE STORE
// PATCH /api/admin/stores/:storeId/reactivate
// ======================================
const reactivateStore = async (req, res) => {
    try {
        const { storeId } = req.params;

        if (!isValidId(storeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid store ID",
            });
        }

        const store = await StoreConfig.findById(storeId);

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found",
            });
        }

        // Avoid duplicate notifications and emails
        if (store.status !== "suspended") {
            return res.status(200).json({
                success: true,
                message: "Store is already active",
                data: store,
            });
        }

        // 1. Restore store status
        store.status = "active";
        store.suspendedAt = null;
        store.suspensionReason = "";

        await store.save();

        // 2. Notify owner and send email
        await notifyStoreOwner({
            store,
            type: "store_reactivated",
        });

        await store.populate("userId", OWNER_FIELDS);

        return res.status(200).json({
            success: true,
            message: "Store reactivated successfully",
            data: store,
        });
    } catch (error) {
        console.error("Admin reactivate store error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to reactivate store",
        });
    }
};

module.exports = {
    getAllStores,
    getStoreDetails,
    updateStore,
    suspendStore,
    reactivateStore,
};
