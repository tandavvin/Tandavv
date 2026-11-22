
const mongoose = require("mongoose");
const StoreMember = require("../models/StoreMember");

// Role-to-default-permissions mapping
const ROLE_PERMISSIONS = {
    owner: [
        "dashboard.view", "website.view", "website.edit",
        "pages.create", "pages.edit",
        "products.view", "products.create", "products.edit", "products.delete",
        "orders.view", "orders.update", "customers.view",
        "marketing.manage", "team.view", "team.invite", "team.manage",
        "reports.view", "settings.manage"
    ],

    admin: [
        "dashboard.view", "website.view", "website.edit",
        "pages.create", "pages.edit",
        "products.view", "products.create", "products.edit", "products.delete",
        "orders.view", "orders.update", "customers.view",
        "marketing.manage", "team.view", "team.invite", "reports.view"
    ],

    manager: [
        "dashboard.view", "website.view",
        "products.view", "products.create", "products.edit",
        "orders.view", "orders.update", "customers.view",
        "marketing.manage", "reports.view"
    ],

    employee: [
        "dashboard.view", "products.view", "orders.view"
    ],

    viewer: [
        "dashboard.view", "website.view", "products.view",
        "orders.view", "customers.view", "reports.view"
    ]
};

const requirePermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required."
                });
            }

            const storeId =
                req.params.storeId ||
                req.query.storeId ||
                req.body?.storeId ||
                req.headers["x-store-id"];

            if (!storeId) {
                return res.status(400).json({
                    success: false,
                    message: "Store ID is required for authorization."
                });
            }

            if (!mongoose.Types.ObjectId.isValid(storeId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Store ID."
                });
            }

            const membership = await StoreMember.findOne({
                storeId,
                userId: req.user.id,
                status: "active"
            });

            if (!membership) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. Active store membership required."
                });
            }

            if (!Object.hasOwn(ROLE_PERMISSIONS, membership.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. Invalid store membership role."
                });
            }

            req.membership = membership;

            // Store Owners have full access to their own store.
            if (membership.role === "owner") {
                return next();
            }

            const allowedPermissions = new Set([
                ...ROLE_PERMISSIONS[membership.role],
                ...(membership.permissions || [])
            ]);

            if (
                requiredPermission &&
                !allowedPermissions.has(requiredPermission)
            ) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Missing permission: ${requiredPermission}.`
                });
            }

            return next();

        } catch (error) {
            console.error("RBAC Middleware error:", error);

            return res.status(500).json({
                success: false,
                message: "Authorization verification failed."
            });
        }
    };
};

module.exports = {
    requirePermission,
    ROLE_PERMISSIONS
};
