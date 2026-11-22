// admin/pages/Products.jsx


import { useEffect, useState } from "react";
import {
    Package,
    CheckCircle,
    XCircle,
    Search,
    RefreshCw,
    Loader2,
    AlertCircle,
    X,
    Plus,
    Pencil,
    Trash2,
    Eye,
    Power,
    ExternalLink,
    MoreVertical,
} from "lucide-react";

import { apiFetch, getStoredUser } from "../../utils/api";

const PRODUCTS_PER_PAGE = 5;

const EMPTY_FORM = {
    storeId: "",
    name: "",
    category: "",
    price: "",
    image: "",
    badge: "",
    link: "",
    status: "active",
};

function SummaryCard({ title, value, icon: Icon, description }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{title}</p>

                <div className="p-2 bg-orange-50 rounded-lg">
                    <Icon size={19} className="text-orange-600" />
                </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mt-3">
                {value ?? 0}
            </h3>

            <p className="text-xs text-gray-400 mt-1">
                {description}
            </p>
        </div>
    );
}

function Products() {
    const currentUser = getStoredUser();

    const isSuperAdmin = currentUser?.role === "superadmin";
    const permissions = currentUser?.permissions || [];

    const canViewProducts =
        isSuperAdmin || permissions.includes("View Products");

    const canCreateProducts =
        isSuperAdmin || permissions.includes("Create Products");

    const canEditProducts =
        isSuperAdmin || permissions.includes("Edit Products");

    const canDeleteProducts =
        isSuperAdmin || permissions.includes("Delete Products");

    // ======================================
    // STATES
    // ======================================

    const [products, setProducts] = useState([]);

    const [statistics, setStatistics] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        stores: 0,
    });

    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: PRODUCTS_PER_PAGE,
        totalPages: 0,
    });

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [storeFilter, setStoreFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const [stores, setStores] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");

    const [refreshKey, setRefreshKey] = useState(0);

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const [deletingProduct, setDeletingProduct] = useState(null);
    const [processingProduct, setProcessingProduct] = useState(null);

    const [openMenuId, setOpenMenuId] = useState(null);

    // ======================================
    // FETCH PRODUCTS
    // ======================================

    useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const params = new URLSearchParams({
                    page: String(page),
                    limit: String(PRODUCTS_PER_PAGE),
                    search,
                });

                if (categoryFilter !== "all") {
                    params.set("category", categoryFilter);
                }

                if (storeFilter !== "all") {
                    params.set("storeId", storeFilter);
                }

                if (statusFilter !== "all") {
                    params.set("status", statusFilter);
                }

                const response = await apiFetch(
                    `/admin/products?${params.toString()}`
                );

                if (!isMounted) return;

                setProducts(response.data || []);

                setStatistics({
                    total: response.stats?.totalProducts || 0,
                    active: response.stats?.activeProducts || 0,
                    inactive: response.stats?.inactiveProducts || 0,
                    stores: response.stats?.totalStores || 0,
                });

                setPagination(
                    response.pagination || {
                        total: 0,
                        page: 1,
                        limit: PRODUCTS_PER_PAGE,
                        totalPages: 0,
                    }
                );
            } catch (err) {
                if (!isMounted) return;

                setError(err.message || "Failed to fetch products.");
                setProducts([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (canViewProducts) {
            fetchProducts();
        } else {
            setLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, [
        canViewProducts,
        page,
        search,
        categoryFilter,
        storeFilter,
        statusFilter,
        refreshKey,
    ]);

    // ======================================
    // FETCH STORES
    // ======================================

    useEffect(() => {
        let isMounted = true;

        const fetchStores = async () => {
            try {
                const response = await apiFetch(
                    "/admin/stores?page=1&limit=100"
                );

                if (isMounted) {
                    setStores(response.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch stores:", err);
            }
        };

        if (canViewProducts) {
            fetchStores();
        }

        return () => {
            isMounted = false;
        };
    }, [canViewProducts, refreshKey]);

    // ======================================
    // COMMON HELPERS
    // ======================================

    const refreshProducts = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const showSuccess = (message) => {
        setActionMessage(message);
        setError("");

        window.setTimeout(() => {
            setActionMessage("");
        }, 4000);
    };

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleFilterChange = (setter, value) => {
        setter(value);
        setPage(1);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ======================================
    // OPEN CREATE FORM
    // ======================================

    const openCreateForm = () => {
        setEditingProduct(null);

        setFormData({
            ...EMPTY_FORM,
            storeId:
                stores.find((store) => store.status === "active")?._id || "",
        });

        setError("");
        setShowForm(true);
    };

    // ======================================
    // OPEN EDIT FORM
    // ======================================

    const openEditForm = (product) => {
        setEditingProduct(product);

        const numericPrice = String(product.price || "").replace(
            /[^0-9.]/g,
            ""
        );

        setFormData({
            storeId: product.storeId || "",
            name: product.name || "",
            category: product.category || "",
            price: numericPrice,
            image: product.image || "",
            badge: product.badge || "",
            link: product.link || "",
            status: product.status || "active",
        });

        setError("");
        setShowForm(true);
    };

    const closeForm = () => {
        if (saving) return;

        setShowForm(false);
        setEditingProduct(null);
        setFormData(EMPTY_FORM);
        setError("");
    };

    // ======================================
    // CREATE / UPDATE PRODUCT
    // ======================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.storeId) {
            setError("Please select a store.");
            return;
        }

        if (!formData.name.trim()) {
            setError("Product name is required.");
            return;
        }

        if (
            !formData.price ||
            !Number.isFinite(Number(formData.price)) ||
            Number(formData.price) < 0
        ) {
            setError("Please enter a valid product price.");
            return;
        }

        const payload = {
            ...formData,
            name: formData.name.trim(),
            category: formData.category.trim(),
            price: Number(formData.price),
            image: formData.image.trim(),
            badge: formData.badge.trim(),
            link: formData.link.trim(),
        };

        try {
            setSaving(true);
            setError("");

            if (editingProduct) {
                await apiFetch(
                    `/admin/products/${editingProduct.storeId}/${editingProduct._id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: payload,
                    }
                );

                showSuccess("Product updated successfully.");
            } else {
                await apiFetch("/admin/products", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: payload,
                });

                showSuccess("Product created successfully.");
            }

            closeForm();
            setPage(1);
            refreshProducts();
        } catch (err) {
            setError(err.message || "Unable to save product.");
        } finally {
            setSaving(false);
        }
    };

    // ======================================
    // READ PRODUCT DETAILS
    // ======================================

    const handleViewProduct = async (product) => {
        try {
            setDetailsLoading(true);
            setSelectedProduct(product);
            setError("");

            const response = await apiFetch(
                `/admin/products/${product.storeId}/${product._id}`
            );

            setSelectedProduct(
                response.data || response.product || response
            );
        } catch (err) {
            setError(err.message || "Unable to load product details.");
            setSelectedProduct(null);
        } finally {
            setDetailsLoading(false);
        }
    };

    // ======================================
    // ACTIVATE / DEACTIVATE PRODUCT
    // ======================================

    const handleToggleStatus = async (product) => {
        const newStatus =
            product.status === "active" ? "inactive" : "active";

        try {
            setProcessingProduct(product._id);
            setError("");

            await apiFetch(
                `/admin/products/${product.storeId}/${product._id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        status: newStatus,
                    },
                }
            );

            showSuccess(
                `Product ${newStatus === "active" ? "activated" : "deactivated"
                } successfully.`
            );

            refreshProducts();
        } catch (err) {
            setError(err.message || "Unable to update product status.");
        } finally {
            setProcessingProduct(null);
        }
    };

    // ======================================
    // DELETE PRODUCT
    // ======================================

    const handleDeleteProduct = async () => {
        if (!deletingProduct) return;

        try {
            setProcessingProduct(deletingProduct._id);
            setError("");

            await apiFetch(
                `/admin/products/${deletingProduct.storeId}/${deletingProduct._id}`,
                {
                    method: "DELETE",
                }
            );

            showSuccess("Product deleted successfully.");

            setDeletingProduct(null);

            if (products.length === 1 && page > 1) {
                setPage((prev) => prev - 1);
            } else {
                refreshProducts();
            }
        } catch (err) {
            setError(err.message || "Unable to delete product.");
        } finally {
            setProcessingProduct(null);
        }
    };

    // ======================================
    // PERMISSION RESTRICTION
    // ======================================

    if (!canViewProducts) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                <AlertCircle
                    size={42}
                    className="text-orange-500 mx-auto mb-4"
                />

                <h2 className="text-lg font-semibold text-gray-900">
                    Access Restricted
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                    You don't have permission to view platform products.
                    Please contact your Super Admin.
                </p>
            </div>
        );
    }

    // ======================================
    // MAIN UI
    // ======================================

    return (
        <div className="space-y-6">

            {/* PAGE HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Product Management
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage products across all customer storefronts.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={refreshProducts}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>

                    {canCreateProducts && (
                        <button
                            onClick={openCreateForm}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg"
                        >
                            <Plus size={17} />
                            Add Product
                        </button>
                    )}
                </div>
            </div>

            {/* SUCCESS MESSAGE */}
            {actionMessage && (
                <div className="flex items-center justify-between gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                        <CheckCircle size={17} />
                        {actionMessage}
                    </div>

                    <button onClick={() => setActionMessage("")}>
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
                <div className="flex items-center justify-between gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-red-700">
                        <AlertCircle size={17} />
                        {error}
                    </div>

                    <button onClick={() => setError("")}>
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <SummaryCard
                    title="Total Products"
                    value={statistics.total}
                    icon={Package}
                    description="Products across all stores"
                />

                <SummaryCard
                    title="Active Products"
                    value={statistics.active}
                    icon={CheckCircle}
                    description="Currently available products"
                />

                <SummaryCard
                    title="Inactive Products"
                    value={statistics.inactive}
                    icon={XCircle}
                    description="Disabled products"
                />

                <SummaryCard
                    title="Total Stores"
                    value={statistics.stores}
                    icon={Package}
                    description="Stores containing products"
                />
            </div>

            {/* SEARCH AND FILTERS */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500"
                        />
                    </div>

                    <select
                        value={storeFilter}
                        onChange={(e) =>
                            handleFilterChange(setStoreFilter, e.target.value)
                        }
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500"
                    >
                        <option value="all">All Stores</option>

                        {stores.map((store) => (
                            <option key={store._id} value={store._id}>
                                {store.storeName}
                            </option>
                        ))}
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(e) =>
                            handleFilterChange(setCategoryFilter, e.target.value)
                        }
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500"
                    >
                        <option value="all">All Categories</option>

                        {[...new Set(
                            products
                                .map((product) => product.category)
                                .filter(Boolean)
                        )].map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            handleFilterChange(setStatusFilter, e.target.value)
                        }
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* PRODUCTS TABLE */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-xs text-gray-500 uppercase tracking-wide">
                                <th className="px-5 py-4 font-semibold">
                                    Product
                                </th>
                                <th className="px-5 py-4 font-semibold">
                                    Category
                                </th>
                                <th className="px-5 py-4 font-semibold">
                                    Price
                                </th>
                                <th className="px-5 py-4 font-semibold">
                                    Store
                                </th>
                                <th className="px-5 py-4 font-semibold">
                                    Status
                                </th>
                                <th className="px-5 py-4 font-semibold">
                                    Store Status
                                </th>
                                <th className="px-5 py-4 font-semibold text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-5 py-12 text-center">
                                        <Loader2
                                            className="animate-spin mx-auto text-orange-600"
                                            size={26}
                                        />

                                        <p className="text-sm text-gray-500 mt-2">
                                            Loading products...
                                        </p>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-5 py-12 text-center">
                                        <Package
                                            size={32}
                                            className="mx-auto text-gray-300"
                                        />

                                        <p className="text-sm font-medium text-gray-700 mt-3">
                                            No products found
                                        </p>

                                        <p className="text-xs text-gray-400 mt-1">
                                            Try changing your search or filters.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => {
                                    const menuId = `${product.storeId}-${product._id}`;

                                    return (
                                        <tr
                                            key={menuId}
                                            className="hover:bg-gray-50"
                                        >
                                            {/* PRODUCT */}
                                            <td className="px-5 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {product.name}
                                                    </p>

                                                    {product.badge && (
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {product.badge}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* CATEGORY */}
                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {product.category || "—"}
                                            </td>

                                            {/* PRICE */}
                                            <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                                                {product.price || "—"}
                                            </td>

                                            {/* STORE */}
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-medium text-gray-700">
                                                    {product.storeName || "Unknown Store"}
                                                </p>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    {product.storeId}
                                                </p>
                                            </td>

                                            {/* PRODUCT STATUS */}
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${product.status === "active"
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-gray-100 text-gray-600"
                                                        }`}
                                                >
                                                    {product.status || "inactive"}
                                                </span>
                                            </td>

                                            {/* STORE STATUS */}
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${product.storeStatus === "active"
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-red-50 text-red-600"
                                                        }`}
                                                >
                                                    {product.storeStatus || "unknown"}
                                                </span>
                                            </td>

                                            {/* ACTIONS DROPDOWN */}
                                            <td className="px-5 py-4">
                                                <div className="relative flex justify-end">
                                                    <button
                                                        type="button"
                                                        title="More actions"
                                                        aria-label={`Actions for ${product.name}`}
                                                        aria-expanded={openMenuId === menuId}
                                                        onClick={() =>
                                                            setOpenMenuId((prev) =>
                                                                prev === menuId
                                                                    ? null
                                                                    : menuId
                                                            )
                                                        }
                                                        className={`p-2 rounded-lg transition-colors ${openMenuId === menuId
                                                            ? "bg-orange-50 text-orange-600"
                                                            : "text-gray-500 hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        <MoreVertical size={19} />
                                                    </button>

                                                    {openMenuId === menuId && (
                                                        <div className="absolute right-0 top-10 z-30 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1">

                                                            {/* VIEW DETAILS */}
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setOpenMenuId(null);
                                                                    handleViewProduct(product);
                                                                }}
                                                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                                            >
                                                                <Eye
                                                                    size={16}
                                                                    className="text-gray-500"
                                                                />
                                                                View Details
                                                            </button>

                                                            {/* EDIT PRODUCT */}
                                                            {canEditProducts && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setOpenMenuId(null);
                                                                        openEditForm(product);
                                                                    }}
                                                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                                                >
                                                                    <Pencil
                                                                        size={16}
                                                                        className="text-gray-500"
                                                                    />
                                                                    Edit Product
                                                                </button>
                                                            )}

                                                            {/* ACTIVATE / DEACTIVATE */}
                                                            {canEditProducts && (
                                                                <button
                                                                    type="button"
                                                                    disabled={processingProduct === product._id}
                                                                    onClick={() => {
                                                                        setOpenMenuId(null);
                                                                        handleToggleStatus(product);
                                                                    }}
                                                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                                                >
                                                                    {processingProduct === product._id ? (
                                                                        <Loader2
                                                                            size={16}
                                                                            className="animate-spin"
                                                                        />
                                                                    ) : (
                                                                        <Power
                                                                            size={16}
                                                                            className="text-gray-500"
                                                                        />
                                                                    )}

                                                                    {product.status === "active"
                                                                        ? "Deactivate"
                                                                        : "Activate"}
                                                                </button>
                                                            )}

                                                            {/* DELETE PRODUCT */}
                                                            {canDeleteProducts && (
                                                                <>
                                                                    <div className="border-t border-gray-100 my-1" />

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setOpenMenuId(null);
                                                                            setDeletingProduct(product);
                                                                        }}
                                                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                        Delete Product
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        Showing {products.length} of {pagination.total} products
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={page <= 1 || loading}
                            onClick={() => setPage((prev) => prev - 1)}
                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-gray-600 px-2">
                            Page {pagination.page || page} of {pagination.totalPages || 1}
                        </span>

                        <button
                            disabled={
                                page >= (pagination.totalPages || 1) || loading
                            }
                            onClick={() => setPage((prev) => prev + 1)}
                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* CREATE / EDIT MODAL */}
            {showForm && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {editingProduct
                                        ? "Edit Product"
                                        : "Add New Product"}
                                </h2>

                                <p className="text-xs text-gray-500 mt-1">
                                    {editingProduct
                                        ? "Update the product information."
                                        : "Add a product to a customer's storefront."}
                                </p>
                            </div>

                            <button
                                onClick={closeForm}
                                disabled={saving}
                                className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Store *
                                </label>

                                <select
                                    name="storeId"
                                    value={formData.storeId}
                                    onChange={handleFormChange}
                                    disabled={!!editingProduct}
                                    required
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500 disabled:bg-gray-100"
                                >
                                    <option value="">Select a store</option>

                                    {stores
                                        .filter(
                                            (store) =>
                                                store.status === "active" ||
                                                store._id === editingProduct?.storeId
                                        )
                                        .map((store) => (
                                            <option
                                                key={store._id}
                                                value={store._id}
                                            >
                                                {store.storeName}
                                            </option>
                                        ))}
                                </select>

                                {editingProduct && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        The store cannot be changed while editing.
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Name *
                                    </label>

                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Enter product name"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>

                                    <input
                                        name="category"
                                        value={formData.category}
                                        onChange={handleFormChange}
                                        placeholder="e.g. Packaging & Goods"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price *
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleFormChange}
                                        min="0"
                                        step="0.01"
                                        required
                                        placeholder="Enter price"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Badge
                                    </label>

                                    <input
                                        name="badge"
                                        value={formData.badge}
                                        onChange={handleFormChange}
                                        placeholder="e.g. Best Seller"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Image URL
                                </label>

                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleFormChange}
                                    placeholder="https://example.com/product-image.jpg"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Link
                                </label>

                                <input
                                    name="link"
                                    value={formData.link}
                                    onChange={handleFormChange}
                                    placeholder="https://example.com/product"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Status
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    disabled={saving}
                                    className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg disabled:opacity-60"
                                >
                                    {saving && (
                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />
                                    )}

                                    {editingProduct
                                        ? "Save Changes"
                                        : "Create Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* VIEW DETAILS MODAL */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Product Details
                            </h2>

                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {detailsLoading ? (
                                <div className="py-10 text-center">
                                    <Loader2
                                        size={28}
                                        className="animate-spin mx-auto text-orange-600"
                                    />

                                    <p className="text-sm text-gray-500 mt-2">
                                        Loading product details...
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedProduct.image && (
                                        <img
                                            src={selectedProduct.image}
                                            alt={selectedProduct.name}
                                            className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                        />
                                    )}

                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {selectedProduct.name}
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {selectedProduct.category || "Uncategorized"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500">
                                                Price
                                            </p>

                                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                                {selectedProduct.price || "—"}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500">
                                                Status
                                            </p>

                                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                                {selectedProduct.status || "inactive"}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Store
                                        </p>

                                        <p className="text-sm font-medium text-gray-800 mt-1">
                                            {selectedProduct.storeName || "—"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Badge
                                        </p>

                                        <p className="text-sm text-gray-800 mt-1">
                                            {selectedProduct.badge || "—"}
                                        </p>
                                    </div>


                                    {selectedProduct.storeSlug && selectedProduct._id ? (
                                        <a
                                            href={`/s/${selectedProduct.storeSlug}/product/${selectedProduct._id}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-orange-600 hover:underline"
                                        >
                                            Open Product Link
                                            <ExternalLink size={14} />
                                        </a>
                                    ) : (
                                        <p className="text-xs text-gray-400">
                                            Public product link is unavailable because this store does not have a slug.
                                        </p>
                                    )}

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {deletingProduct && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto">
                            <Trash2 size={22} className="text-red-600" />
                        </div>

                        <h2 className="text-lg font-semibold text-gray-900 text-center mt-4">
                            Delete Product?
                        </h2>

                        <p className="text-sm text-gray-500 text-center mt-2">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-gray-800">
                                {deletingProduct.name}
                            </span>
                            ? This action cannot be undone.
                        </p>

                        <div className="flex justify-center gap-3 mt-6">
                            <button
                                onClick={() => setDeletingProduct(null)}
                                disabled={
                                    processingProduct === deletingProduct._id
                                }
                                className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDeleteProduct}
                                disabled={
                                    processingProduct === deletingProduct._id
                                }
                                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-60"
                            >
                                {processingProduct === deletingProduct._id && (
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />
                                )}

                                Delete Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Products;
