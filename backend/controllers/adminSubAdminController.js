
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

// Allowed permissions must be maintained on the backend.
const allowedPermissions = [
    "View Users",
    "Create Users",
    "Edit Users",
    "Delete Users",

    "View Stores",
    "Edit Stores",
    "Suspend Stores",

    "View Templates",
    "Create Templates",
    "Edit Templates",
    "Delete Templates",

    "View Products",
    "Create Products",
    "Edit Products",
    "Delete Products",

    "View Payments",
    "Manage Payments",
    "View Subscriptions",
    "Manage Subscriptions",

    "View Activity Logs",
    "View Coupons",
    "Manage Coupons",
    "View Notifications",
    "Manage Notifications",
    "View Support",
    "Manage Support",
];

const permissionDependencies = {
    "Create Users": "View Users",
    "Edit Users": "View Users",
    "Delete Users": "View Users",

    "Edit Stores": "View Stores",
    "Suspend Stores": "View Stores",

    "Create Templates": "View Templates",
    "Edit Templates": "View Templates",
    "Delete Templates": "View Templates",

    "Create Products": "View Products",
    "Edit Products": "View Products",
    "Delete Products": "View Products",

    "Manage Payments": "View Payments",
    "Manage Subscriptions": "View Subscriptions",
    "Manage Coupons": "View Coupons",
    "Manage Notifications": "View Notifications",
    "Manage Support": "View Support",
};

const validatePermissions = (permissions) => {
    if (!Array.isArray(permissions)) {
        return "Permissions must be an array.";
    }

    if (new Set(permissions).size !== permissions.length) {
        return "Duplicate permissions are not allowed.";
    }

    for (const permission of permissions) {
        if (!allowedPermissions.includes(permission)) {
            return `Invalid permission: ${permission}`;
        }

        const requiredPermission = permissionDependencies[permission];

        if (requiredPermission && !permissions.includes(requiredPermission)) {
            return `${permission} requires ${requiredPermission}.`;
        }
    }

    return null;
};

const publicSubAdmin = (user) => ({
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    adminTitle: user.adminTitle,
    status: user.status,
    permissions: user.permissions || [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

// Create Sub Admin
const createSubAdmin = async (req, res) => {
    try {
        const {
            name,
            username,
            email,
            password,
            adminTitle,
            status = "active",
            permissions = [],
        } = req.body;

        if (!name?.trim() || !username?.trim() || !email?.trim() || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, username, email and password are required.",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters.",
            });
        }

        const normalizedUsername = username.trim().toLowerCase();
        const normalizedEmail = email.trim().toLowerCase();

        if (!/^[a-z0-9_]{3,30}$/.test(normalizedUsername)) {
            return res.status(400).json({
                success: false,
                message: "Username must be 3–30 characters and contain only lowercase letters, numbers or underscores.",
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address.",
            });
        }

        if (!["active", "inactive"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be active or inactive.",
            });
        }

        const permissionError = validatePermissions(permissions);

        if (permissionError) {
            return res.status(400).json({
                success: false,
                message: permissionError,
            });
        }

        const existingUser = await User.findOne({
            $or: [
                { username: normalizedUsername },
                { email: normalizedEmail },
            ],
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Username or email is already registered.",
            });
        }

        const hashedPassword = await bcrypt.hash(String(password), 10);

        const subAdmin = await User.create({
            name: name.trim(),
            username: normalizedUsername,
            email: normalizedEmail,
            password: hashedPassword,
            role: "subadmin",
            adminTitle: adminTitle?.trim() || "",
            status,
            permissions,
        });

        return res.status(201).json({
            success: true,
            message: "Sub Admin created successfully.",
            subAdmin: publicSubAdmin(subAdmin),
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Username or email is already registered.",
            });
        }

        console.error("Create Sub Admin Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create Sub Admin.",
        });
    }
};

// Get all Sub Admins
const getAllSubAdmins = async (req, res) => {
    try {
        const subAdmins = await User.find({ role: "subadmin" })
            .select("-password -resetOtpHash -resetOtpExpires -isResetOtpVerified")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: subAdmins.length,
            subAdmins: subAdmins.map(publicSubAdmin),
        });
    } catch (error) {
        console.error("Get Sub Admins Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch Sub Admins.",
        });
    }
};

// Get one Sub Admin
const getSubAdminDetails = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.subAdminId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Sub Admin ID.",
            });
        }

        const subAdmin = await User.findOne({
            _id: req.params.subAdminId,
            role: "subadmin",
        }).select("-password -resetOtpHash -resetOtpExpires -isResetOtpVerified");

        if (!subAdmin) {
            return res.status(404).json({
                success: false,
                message: "Sub Admin not found.",
            });
        }

        return res.status(200).json({
            success: true,
            subAdmin: publicSubAdmin(subAdmin),
        });
    } catch (error) {
        console.error("Get Sub Admin Details Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch Sub Admin details.",
        });
    }
};

// Update Sub Admin
const updateSubAdmin = async (req, res) => {
    try {
        const { subAdminId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(subAdminId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Sub Admin ID.",
            });
        }

        const subAdmin = await User.findOne({
            _id: subAdminId,
            role: "subadmin",
        });

        if (!subAdmin) {
            return res.status(404).json({
                success: false,
                message: "Sub Admin not found.",
            });
        }

        const {
            name,
            username,
            email,
            password,
            adminTitle,
            status,
            permissions,
        } = req.body;

        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Name cannot be empty.",
                });
            }
            subAdmin.name = name.trim();
        }

        if (username !== undefined) {
            const normalizedUsername = username.trim().toLowerCase();

            if (!/^[a-z0-9_]{3,30}$/.test(normalizedUsername)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid username.",
                });
            }

            subAdmin.username = normalizedUsername;
        }

        if (email !== undefined) {
            const normalizedEmail = email.trim().toLowerCase();

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email address.",
                });
            }

            subAdmin.email = normalizedEmail;
        }

        if (adminTitle !== undefined) {
            subAdmin.adminTitle = adminTitle.trim();
        }

        if (status !== undefined) {
            if (!["active", "inactive", "suspended"].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status.",
                });
            }
            subAdmin.status = status;
        }

        if (permissions !== undefined) {
            const permissionError = validatePermissions(permissions);

            if (permissionError) {
                return res.status(400).json({
                    success: false,
                    message: permissionError,
                });
            }

            subAdmin.permissions = permissions;
        }

        if (password !== undefined && password !== "") {
            if (password.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: "Password must contain at least 8 characters.",
                });
            }

            subAdmin.password = await bcrypt.hash(String(password), 10);
        }

        await subAdmin.save();

        return res.status(200).json({
            success: true,
            message: "Sub Admin updated successfully.",
            subAdmin: publicSubAdmin(subAdmin),
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Username or email is already in use.",
            });
        }

        console.error("Update Sub Admin Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update Sub Admin.",
        });
    }
};

// Suspend Sub Admin
const suspendSubAdmin = async (req, res) => {
    try {
        const subAdmin = await User.findOneAndUpdate(
            { _id: req.params.subAdminId, role: "subadmin" },
            { status: "suspended" },
            { new: true, runValidators: true }
        );

        if (!subAdmin) {
            return res.status(404).json({
                success: false,
                message: "Sub Admin not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Sub Admin suspended successfully.",
            subAdmin: publicSubAdmin(subAdmin),
        });
    } catch (error) {
        console.error("Suspend Sub Admin Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to suspend Sub Admin.",
        });
    }
};

// Reactivate Sub Admin
const reactivateSubAdmin = async (req, res) => {
    try {
        const subAdmin = await User.findOneAndUpdate(
            { _id: req.params.subAdminId, role: "subadmin" },
            { status: "active" },
            { new: true, runValidators: true }
        );

        if (!subAdmin) {
            return res.status(404).json({
                success: false,
                message: "Sub Admin not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Sub Admin reactivated successfully.",
            subAdmin: publicSubAdmin(subAdmin),
        });
    } catch (error) {
        console.error("Reactivate Sub Admin Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to reactivate Sub Admin.",
        });
    }
};

// Delete Sub Admin
const deleteSubAdmin = async (req, res) => {
    try {
        const subAdmin = await User.findOneAndDelete({
            _id: req.params.subAdminId,
            role: "subadmin",
        });

        if (!subAdmin) {
            return res.status(404).json({
                success: false,
                message: "Sub Admin not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Sub Admin deleted successfully.",
        });
    } catch (error) {
        console.error("Delete Sub Admin Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete Sub Admin.",
        });
    }
};

module.exports = {
    createSubAdmin,
    getAllSubAdmins,
    getSubAdminDetails,
    updateSubAdmin,
    suspendSubAdmin,
    reactivateSubAdmin,
    deleteSubAdmin,
};
