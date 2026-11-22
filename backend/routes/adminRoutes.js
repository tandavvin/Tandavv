// routes/adminRoutes.js

const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    getUserDetails,
    updateUser,
    suspendUser,
    reactivateUser,
    deleteUser,
} = require("../controllers/adminUserController");

const {
    createSubAdmin,
    getAllSubAdmins,
    getSubAdminDetails,
    updateSubAdmin,
    suspendSubAdmin,
    reactivateSubAdmin,
    deleteSubAdmin,
} = require("../controllers/adminSubAdminController");

const {
    getAllStores,
    getStoreDetails,
    updateStore,
    suspendStore,
    reactivateStore,
} = require("../controllers/adminStoreController");

const {
    verifyToken,
    requireSuperAdmin,
    requirePermission,
} = require("../middleware/authMiddleware");

// All admin routes require authentication
router.use(verifyToken);

// ==========================================
// USER MANAGEMENT
// ==========================================

// View all users
router.get(
    "/users",
    requirePermission("View Users"),
    getAllUsers
);

// View individual user
router.get(
    "/users/:userId",
    requirePermission("View Users"),
    getUserDetails
);

// Update user
router.put(
    "/users/:userId",
    requirePermission("Edit Users"),
    updateUser
);

// Suspend user
router.patch(
    "/users/:userId/suspend",
    requirePermission("Edit Users"),
    suspendUser
);

// Reactivate user
router.patch(
    "/users/:userId/reactivate",
    requirePermission("Edit Users"),
    reactivateUser
);

// Delete user
router.delete(
    "/users/:userId",
    requirePermission("Delete Users"),
    deleteUser
);


// ==========================================
// STORE MANAGEMENT
// SUPER ADMIN + PERMISSION-BASED SUB ADMINS
// ==========================================

// View all platform stores
router.get(
    "/stores",
    requirePermission("View Stores"),
    getAllStores
);

// View individual store details
router.get(
    "/stores/:storeId",
    requirePermission("View Stores"),
    getStoreDetails
);

// Edit store information
router.put(
    "/stores/:storeId",
    requirePermission("Edit Stores"),
    updateStore
);

// Suspend store
router.patch(
    "/stores/:storeId/suspend",
    requirePermission("Suspend Stores"),
    suspendStore
);

// Reactivate store
router.patch(
    "/stores/:storeId/reactivate",
    requirePermission("Suspend Stores"),
    reactivateStore
);



// ==========================================
// SUB ADMIN MANAGEMENT
// SUPER ADMIN ONLY
// ==========================================

router.use("/sub-admins", requireSuperAdmin);

// Get all Sub Admins
router.get("/sub-admins", getAllSubAdmins);

// Create Sub Admin
router.post("/sub-admins", createSubAdmin);

// Get individual Sub Admin
router.get("/sub-admins/:subAdminId", getSubAdminDetails);

// Update Sub Admin
router.put("/sub-admins/:subAdminId", updateSubAdmin);

// Suspend Sub Admin
router.patch("/sub-admins/:subAdminId/suspend", suspendSubAdmin);

// Reactivate Sub Admin
router.patch("/sub-admins/:subAdminId/reactivate", reactivateSubAdmin);

// Delete Sub Admin
router.delete("/sub-admins/:subAdminId", deleteSubAdmin);

module.exports = router;
