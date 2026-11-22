
// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Get authentication token from HTTP-only cookie
const getToken = (req) => {
    return req.cookies?.token || null;
};

// Verify authentication and account status
const verifyToken = async (req, res, next) => {
    const token = getToken(req);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized. Please log in.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.id || decoded.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload.",
            });
        }

        // Always fetch current user details from MongoDB
        const user = await User.findById(userId).select(
            "_id status role permissions"
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User account not found.",
            });
        }

        // Check current account status
        if (user.status === "suspended") {
            return res.status(403).json({
                success: false,
                message: "Your account has been suspended. Please contact support.",
            });
        }

        if (user.status === "inactive") {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive. Please contact support.",
            });
        }

        // Attach trusted database information to request
        req.user = {
            id: user._id.toString(),
            role: user.role,
            permissions: user.permissions || [],
        };

        return next();

    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                success: false,
                message: "Token invalid or expired.",
            });
        }

        console.error("Authentication middleware error:", error);

        return res.status(500).json({
            success: false,
            message: "Authentication verification failed.",
        });
    }
};

// Verify Super Admin access
const requireSuperAdmin = async (req, res, next) => {
    if (!req.user?.id) {
        return res.status(401).json({
            success: false,
            message: "Authentication required.",
        });
    }

    try {
        // Recheck role directly from MongoDB
        const user = await User.findById(req.user.id).select(
            "_id role status"
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User account not found.",
            });
        }

        if (user.status === "suspended" || user.status === "inactive") {
            return res.status(403).json({
                success: false,
                message: "Your account is not active.",
            });
        }

        if (user.role !== "superadmin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Super Admin access required.",
            });
        }

        req.admin = user;

        return next();

    } catch (error) {
        console.error("Super Admin authorization error:", error);

        return res.status(500).json({
            success: false,
            message: "Authorization failed.",
        });
    }
};

// Verify specific Sub Admin permissions
const requirePermission = (requiredPermission) => {
    return (req, res, next) => {

        // Ensure authentication middleware has executed
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        // Super Admin has unrestricted access
        if (req.user.role === "superadmin") {
            return next();
        }

        // Only Sub Admins can access permission-controlled routes
        if (req.user.role !== "subadmin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin access required.",
            });
        }

        const permissions = req.user.permissions || [];

        if (!permissions.includes(requiredPermission)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required permission: ${requiredPermission}`,
            });
        }

        return next();
    };
};

const protect = verifyToken;

module.exports = {
    verifyToken,
    protect,
    requireSuperAdmin,
    requirePermission,
};
