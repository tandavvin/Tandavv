
const mongoose = require("mongoose");
const User = require("../models/User");
const StoreConfig = require("../models/StoreConfig");

// GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const {
            search = "",
            status = "all",
            page = 1,
            limit = 5,
        } = req.query;

        const allowedStatuses = [
            "all",
            "active",
            "inactive",
            "suspended",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status filter",
            });
        }

        // Pagination
        const currentPage = Math.max(
            Number.parseInt(page, 10) || 1,
            1
        );

        const pageSize = Math.min(
            Math.max(Number.parseInt(limit, 10) || 5, 1),
            100
        );

        const skip = (currentPage - 1) * pageSize;

        // Search conditions
        const filter = {};

        if (search.trim()) {
            const escapedSearch = search.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            filter.$or = [
                { name: { $regex: escapedSearch, $options: "i" } },
                { username: { $regex: escapedSearch, $options: "i" } },
                { email: { $regex: escapedSearch, $options: "i" } },
            ];
        }

        // Existing users without status are treated as active
        if (status !== "all") {
            if (status === "active") {
                filter.$and = [
                    {
                        $or: [
                            { status: "active" },
                            { status: { $exists: false } },
                        ],
                    },
                ];
            } else {
                filter.status = status;
            }
        }

        // Fetch users and their store counts
        const [users, totalUsers, stats] = await Promise.all([
            User.aggregate([
                { $match: filter },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: pageSize },

                {
                    $lookup: {
                        from: "storeconfigs",
                        localField: "_id",
                        foreignField: "userId",
                        as: "userStores",
                    },
                },

                {
                    $project: {
                        name: 1,
                        username: 1,
                        email: 1,
                        role: 1,
                        status: {
                            $ifNull: ["$status", "active"],
                        },
                        joinedAt: "$createdAt",
                        stores: { $size: "$userStores" },
                    },
                },
            ]),

            User.countDocuments(filter),

            User.aggregate([
                {
                    $group: {
                        _id: null,
                        totalUsers: { $sum: 1 },

                        activeUsers: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            { $ifNull: ["$status", "active"] },
                                            "active",
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },

                        inactiveUsers: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$status", "inactive"] },
                                    1,
                                    0,
                                ],
                            },
                        },

                        suspendedUsers: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$status", "suspended"] },
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },
            ]),
        ]);

        const userStats = stats[0] || {
            totalUsers: 0,
            activeUsers: 0,
            inactiveUsers: 0,
            suspendedUsers: 0,
        };

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users,

            stats: {
                totalUsers: userStats.totalUsers,
                activeUsers: userStats.activeUsers,
                inactiveUsers: userStats.inactiveUsers,
                suspendedUsers: userStats.suspendedUsers,
            },

            pagination: {
                currentPage,
                limit: pageSize,
                totalUsers,
                totalPages: Math.ceil(totalUsers / pageSize),
            },
        });

    } catch (error) {
        console.error("Get All Users Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};

// Validate target user ID and protect Super Admin accounts
const getManageableUser = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({
            success: false,
            message: "Invalid user ID",
        });
        return null;
    }

    const user = await User.findById(userId);

    if (!user) {
        res.status(404).json({
            success: false,
            message: "User not found",
        });
        return null;
    }

    // Prevent Super Admin from modifying their own account
    if (user._id.toString() === req.user.id.toString()) {
        res.status(403).json({
            success: false,
            message: "You cannot modify your own account",
        });
        return null;
    }

    // Protect other Super Admin accounts
    if (user.role === "superadmin") {
        res.status(403).json({
            success: false,
            message: "Super Admin accounts cannot be modified",
        });
        return null;
    }

    return user;
};

// PATCH /api/admin/users/:userId/suspend
const suspendUser = async (req, res) => {
    try {
        const user = await getManageableUser(req, res);

        if (!user) return;

        if (user.status === "suspended") {
            return res.status(200).json({
                success: true,
                message: "User is already suspended",
                data: {
                    userId: user._id,
                    status: user.status,
                },
            });
        }

        user.status = "suspended";
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User suspended successfully",
            data: {
                userId: user._id,
                status: user.status,
            },
        });

    } catch (error) {
        console.error("Suspend User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to suspend user",
        });
    }
};

// PATCH /api/admin/users/:userId/reactivate
const reactivateUser = async (req, res) => {
    try {
        const user = await getManageableUser(req, res);

        if (!user) return;

        if (user.status === "active" || !user.status) {
            return res.status(200).json({
                success: true,
                message: "User is already active",
                data: {
                    userId: user._id,
                    status: "active",
                },
            });
        }

        user.status = "active";
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User reactivated successfully",
            data: {
                userId: user._id,
                status: user.status,
            },
        });

    } catch (error) {
        console.error("Reactivate User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to reactivate user",
        });
    }
};

// DELETE /api/admin/users/:userId
const deleteUser = async (req, res) => {
    let session;

    try {
        const user = await getManageableUser(req, res);

        if (!user) return;

        session = await mongoose.startSession();

        let deletedStoreCount = 0;

        // Delete the user's stores and account together
        // If either operation fails, the transaction is rolled back.
        await session.withTransaction(async () => {
            const storeResult = await StoreConfig.deleteMany(
                { userId: user._id },
                { session }
            );

            deletedStoreCount = storeResult.deletedCount;

            const userResult = await User.deleteOne(
                { _id: user._id },
                { session }
            );

            if (userResult.deletedCount !== 1) {
                throw new Error("User deletion failed");
            }
        });

        return res.status(200).json({
            success: true,
            message: "User and associated stores deleted successfully",
            data: {
                userId: user._id,
                deletedStores: deletedStoreCount,
            },
        });

    } catch (error) {
        console.error("Delete User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete user",
        });
    } finally {
        if (session) {
            await session.endSession();
        }
    }
};


const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        // Never return password or sensitive authentication fields
        const user = await User.findById(userId).select(
            "_id name username email googleId role status createdAt updatedAt"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Fetch all storefronts belonging to this user
        const stores = await StoreConfig.find({
            userId: user._id,
        })
            .select(
                "_id storeName storeEmail templateId published updatedAt"
            )
            .sort({ updatedAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    googleId: user.googleId || null,
                    authProvider: user.googleId
                        ? "google"
                        : "email",
                    role: user.role || "user",
                    status: user.status || "active",
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
                stores,
                storeCount: stores.length,
            },
        });

    } catch (error) {
        console.error("Get User Details Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch user details",
        });
    }
};


const updateUser = async (req, res) => {
    try {
        const user = await getManageableUser(req, res);

        if (!user) return;

        const {
            name,
            username,
            email,
            status,
        } = req.body;

        // Validate required fields
        if (
            typeof name !== "string" ||
            typeof username !== "string" ||
            typeof email !== "string" ||
            typeof status !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, username, email and status are required",
            });
        }

        const normalizedName = name.trim();
        const normalizedUsername = username.trim().toLowerCase();
        const normalizedEmail = email.trim().toLowerCase();

        const allowedStatuses = [
            "active",
            "inactive",
            "suspended",
        ];

        if (!normalizedName) {
            return res.status(400).json({
                success: false,
                message: "Name cannot be empty",
            });
        }

        if (!/^[a-z0-9_]{3,30}$/.test(normalizedUsername)) {
            return res.status(400).json({
                success: false,
                message: "Username must be 3-30 characters and contain only lowercase letters, numbers and underscores",
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account status",
            });
        }

        // Check whether username or email belongs to another user
        const existingUser = await User.findOne({
            _id: { $ne: user._id },
            $or: [
                { username: normalizedUsername },
                { email: normalizedEmail },
            ],
        }).select("username email");

        if (existingUser) {
            if (existingUser.username === normalizedUsername) {
                return res.status(409).json({
                    success: false,
                    message: "This username is already taken",
                });
            }

            if (existingUser.email === normalizedEmail) {
                return res.status(409).json({
                    success: false,
                    message: "This email address is already registered",
                });
            }
        }

        // Update only explicitly permitted fields
        user.name = normalizedName;
        user.username = normalizedUsername;
        user.email = normalizedEmail;
        user.status = status;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role || "user",
                status: user.status,
                updatedAt: user.updatedAt,
            },
        });

    } catch (error) {
        // Handle MongoDB unique index conflicts
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0];

            return res.status(409).json({
                success: false,
                message: `This ${field || "value"} is already in use`,
            });
        }

        console.error("Update User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update user",
        });
    }
};


module.exports = {
    getAllUsers,
    getUserDetails,
    updateUser,
    suspendUser,
    reactivateUser,
    deleteUser,
};