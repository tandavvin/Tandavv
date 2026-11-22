// routes/adminProductRoutes.js


const express = require("express");

const {
    getAllProducts,
    getProductDetails,
    createProduct,
    updateProduct,
    updateProductStatus,
    deleteProduct,
} = require("../controllers/adminProductController");

const {
    verifyToken,
    requirePermission,
} = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication.
router.use(verifyToken);

// GET all products across stores.
router.get(
    "/",
    requirePermission("View Products"),
    getAllProducts
);

// CREATE product inside a store.
router.post(
    "/",
    requirePermission("Create Products"),
    createProduct
);

// GET a specific product from a specific store.
router.get(
    "/:storeId/:productId",
    requirePermission("View Products"),
    getProductDetails
);

// UPDATE product details.
router.put(
    "/:storeId/:productId",
    requirePermission("Edit Products"),
    updateProduct
);

// ACTIVATE / DEACTIVATE product.
router.patch(
    "/:storeId/:productId/status",
    requirePermission("Edit Products"),
    updateProductStatus
);

// DELETE product.
router.delete(
    "/:storeId/:productId",
    requirePermission("Delete Products"),
    deleteProduct
);

module.exports = router;
