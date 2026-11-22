// /admin/Pages/Stores.jsx


import { useEffect, useState } from "react";
import {
    Store,
    CheckCircle,
    XCircle,
    Globe,
    Search,
    MoreVertical,
    Eye,
    Pencil,
    Ban,
    RefreshCw,
    X,
    Loader2,
    AlertCircle,
    ExternalLink,
    CalendarDays,
    User,
    Mail,
    LayoutTemplate,
} from "lucide-react";

import { apiFetch, getStoredUser } from "../../utils/api";

const STORES_PER_PAGE = 5;

// ==========================================
// REUSABLE SUMMARY CARD
// ==========================================
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

            <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
    );
}

// ==========================================
// REUSABLE DETAIL ITEM
// ==========================================
function DetailItem({ label, value, icon: Icon }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
            {Icon && (
                <div className="mt-0.5 text-gray-400">
                    <Icon size={17} />
                </div>
            )}

            <div className="min-w-0">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-800 break-words mt-1">
                    {value || "Not available"}
                </p>
            </div>
        </div>
    );
}

// ==========================================
// MAIN STORES PAGE
// ==========================================
function Stores() {
    const currentUser = getStoredUser();

    const isSuperAdmin = currentUser?.role === "superadmin";
    const permissions = currentUser?.permissions || [];

    const canViewStores =
        isSuperAdmin || permissions.includes("View Stores");

    const canEditStores =
        isSuperAdmin || permissions.includes("Edit Stores");

    const canSuspendStores =
        isSuperAdmin || permissions.includes("Suspend Stores");

    // ======================================
    // STATES
    // ======================================
    const [stores, setStores] = useState([]);
    const [statistics, setStatistics] = useState({
        total: 0,
        active: 0,
        suspended: 0,
        published: 0,
        unpublished: 0,
    });

    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: STORES_PER_PAGE,
        totalPages: 0,
    });

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [publishedFilter, setPublishedFilter] = useState("all");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");

    const [openMenu, setOpenMenu] = useState(null);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerLoading, setDrawerLoading] = useState(false);
    const [drawerError, setDrawerError] = useState("");
    const [drawerStore, setDrawerStore] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [editForm, setEditForm] = useState({
        storeName: "",
        storeEmail: "",
        templateId: "",
    });

    const [suspendingStore, setSuspendingStore] = useState(null);
    const [suspensionReason, setSuspensionReason] = useState("");
    const [processingAction, setProcessingAction] = useState(false);

    const [refreshKey, setRefreshKey] = useState(0);

    // ======================================
    // FETCH STORES
    // ======================================
    useEffect(() => {
        let isMounted = true;

        const fetchStores = async () => {
            try {
                setLoading(true);
                setError("");

                const params = new URLSearchParams({
                    page: String(page),
                    limit: String(STORES_PER_PAGE),
                    search,
                    status: statusFilter,
                    published: publishedFilter,
                });

                const response = await apiFetch(
                    `/admin/stores?${params.toString()}`
                );

                if (!isMounted) return;

                setStores(response.data || []);

                setStatistics(
                    response.statistics || {
                        total: 0,
                        active: 0,
                        suspended: 0,
                        published: 0,
                        unpublished: 0,
                    }
                );

                setPagination(
                    response.pagination || {
                        total: 0,
                        page: 1,
                        limit: STORES_PER_PAGE,
                        totalPages: 0,
                    }
                );
            } catch (err) {
                if (!isMounted) return;

                setError(err.message || "Failed to fetch stores");
                setStores([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (canViewStores) {
            fetchStores();
        } else {
            setLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, [
        canViewStores,
        page,
        search,
        statusFilter,
        publishedFilter,
        refreshKey,
    ]);

    // ======================================
    // SEARCH AND FILTER HANDLERS
    // ======================================
    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        setPage(1);
    };

    const handlePublishedFilter = (value) => {
        setPublishedFilter(value);
        setPage(1);
    };

    const refreshStores = () => {
        setRefreshKey((prev) => prev + 1);
    };

    // ======================================
    // OPEN STORE DETAILS
    // ======================================
    const handleViewDetails = async (storeId) => {
        try {
            setDrawerOpen(true);
            setDrawerLoading(true);
            setDrawerError("");
            setDrawerStore(null);
            setIsEditing(false);
            setOpenMenu(null);

            const response = await apiFetch(`/admin/stores/${storeId}`);

            setDrawerStore(response.data);
        } catch (err) {
            setDrawerError(err.message || "Failed to fetch store details");
        } finally {
            setDrawerLoading(false);
        }
    };

    // ======================================
    // OPEN EDIT FORM
    // ======================================
    const handleStartEdit = (store) => {
        setDrawerStore(store);

        setEditForm({
            storeName: store.storeName || "",
            storeEmail: store.storeEmail || "",
            templateId: store.templateId || "default",
        });

        setIsEditing(true);
        setDrawerOpen(true);
        setOpenMenu(null);
        setDrawerError("");
    };

    // ======================================
    // EDIT FORM INPUT
    // ======================================
    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ======================================
    // UPDATE STORE
    // ======================================
    const handleSaveStore = async (e) => {
        e.preventDefault();

        if (!drawerStore?._id) return;

        try {
            setSaving(true);
            setDrawerError("");

            const response = await apiFetch(
                `/admin/stores/${drawerStore._id}`,
                {
                    method: "PUT",
                    body: editForm,
                }
            );

            setDrawerStore(response.data);
            setIsEditing(false);
            setActionMessage("Store updated successfully");

            refreshStores();
        } catch (err) {
            setDrawerError(err.message || "Failed to update store");
        } finally {
            setSaving(false);
        }
    };

    // ======================================
    // SUSPEND STORE
    // ======================================
    const handleSuspendStore = async () => {
        if (!suspendingStore) return;

        try {
            setProcessingAction(true);

            const response = await apiFetch(
                `/admin/stores/${suspendingStore._id}/suspend`,
                {
                    method: "PATCH",
                    body: {
                        reason: suspensionReason,
                    },
                }
            );

            setActionMessage(
                response.message || "Store suspended successfully"
            );

            setSuspendingStore(null);
            setSuspensionReason("");

            if (drawerStore?._id === suspendingStore._id) {
                setDrawerStore(response.data);
            }

            refreshStores();
        } catch (err) {
            setError(err.message || "Failed to suspend store");
        } finally {
            setProcessingAction(false);
        }
    };

    // ======================================
    // REACTIVATE STORE
    // ======================================
    const handleReactivateStore = async (store) => {
        const confirmed = window.confirm(
            `Are you sure you want to reactivate "${store.storeName}"?`
        );

        if (!confirmed) return;

        try {
            setProcessingAction(true);

            const response = await apiFetch(
                `/admin/stores/${store._id}/reactivate`,
                {
                    method: "PATCH",
                }
            );

            setActionMessage(
                response.message || "Store reactivated successfully"
            );

            if (drawerStore?._id === store._id) {
                setDrawerStore(response.data);
            }

            setOpenMenu(null);
            refreshStores();
        } catch (err) {
            setError(err.message || "Failed to reactivate store");
        } finally {
            setProcessingAction(false);
        }
    };

    // ======================================
    // CLOSE DRAWER
    // ======================================
    const closeDrawer = () => {
        setDrawerOpen(false);
        setDrawerStore(null);
        setIsEditing(false);
        setDrawerError("");
    };

    // ======================================
    // PERMISSION RESTRICTION
    // ======================================
    if (!canViewStores) {
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
                    You don't have permission to view platform stores.
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
                        Store Management
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage all storefronts and their platform access.
                    </p>
                </div>

                <button
                    onClick={refreshStores}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* ACTION MESSAGE */}
            {actionMessage && (
                <div className="flex items-center justify-between gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                        <CheckCircle size={17} />
                        {actionMessage}
                    </div>

                    <button onClick={() => setActionMessage("")}>
                        <X size={16} className="text-green-700" />
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
                    title="Total Stores"
                    value={statistics.total}
                    icon={Store}
                    description="All registered storefronts"
                />

                <SummaryCard
                    title="Active Stores"
                    value={statistics.active}
                    icon={CheckCircle}
                    description="Stores without suspension"
                />

                <SummaryCard
                    title="Suspended Stores"
                    value={statistics.suspended}
                    icon={XCircle}
                    description="Stores with restricted status"
                />

                <SummaryCard
                    title="Published Stores"
                    value={statistics.published}
                    icon={Globe}
                    description={`${statistics.unpublished || 0} unpublished stores`}
                />
            </div>

            {/* STORE TABLE CONTAINER */}
            <div className="bg-white border border-gray-200 rounded-xl">

                {/* TABLE HEADER */}
                <div className="p-5 border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h2 className="font-semibold text-gray-900">
                                All Stores
                            </h2>

                            <p className="text-xs text-gray-400 mt-1">
                                View and manage customer storefronts.
                            </p>
                        </div>

                        {/* SEARCH */}
                        <div className="relative w-full lg:w-72">
                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search stores or owners..."
                                className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400"
                            />
                        </div>
                    </div>

                    {/* FILTERS */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusFilter(e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-orange-400"
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                        </select>

                        <select
                            value={publishedFilter}
                            onChange={(e) =>
                                handlePublishedFilter(e.target.value)
                            }
                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-orange-400"
                        >
                            <option value="all">All Publishing Status</option>
                            <option value="published">Published</option>
                            <option value="unpublished">Unpublished</option>
                        </select>
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-xs text-gray-500 uppercase">
                                <th className="px-5 py-4 font-medium">
                                    Store
                                </th>

                                <th className="px-5 py-4 font-medium">
                                    Owner
                                </th>

                                <th className="px-5 py-4 font-medium">
                                    Template
                                </th>

                                <th className="px-5 py-4 font-medium">
                                    Publishing
                                </th>

                                <th className="px-5 py-4 font-medium">
                                    Status
                                </th>

                                <th className="px-5 py-4 font-medium">
                                    Created
                                </th>

                                <th className="px-5 py-4 font-medium text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-16 text-center">
                                        <Loader2
                                            size={28}
                                            className="animate-spin text-orange-500 mx-auto"
                                        />

                                        <p className="text-sm text-gray-500 mt-3">
                                            Loading stores...
                                        </p>
                                    </td>
                                </tr>
                            ) : stores.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-16 text-center">
                                        <Store
                                            size={35}
                                            className="text-gray-300 mx-auto"
                                        />

                                        <p className="text-sm font-medium text-gray-700 mt-3">
                                            No stores found
                                        </p>

                                        <p className="text-xs text-gray-400 mt-1">
                                            Try changing your search or filters.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                stores.map((store) => {
                                    const owner =
                                        store.userId &&
                                        typeof store.userId === "object"
                                            ? store.userId
                                            : null;

                                    const isSuspended =
                                        store.status === "suspended";

                                    return (
                                        <tr
                                            key={store._id}
                                            className="hover:bg-gray-50/70 transition"
                                        >
                                            {/* STORE */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                                        <Store
                                                            size={19}
                                                            className="text-orange-600"
                                                        />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate max-w-48">
                                                            {store.storeName}
                                                        </p>

                                                        <p className="text-xs text-gray-400 truncate max-w-48 mt-1">
                                                            {store.slug
                                                                ? `${store.slug}`
                                                                : "No store address"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* OWNER */}
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-medium text-gray-800">
                                                    {owner?.name || "Unknown"}
                                                </p>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    {owner?.email || "No email"}
                                                </p>
                                            </td>

                                            {/* TEMPLATE */}
                                            <td className="px-5 py-4">
                                                <span className="text-sm text-gray-600 capitalize">
                                                    {store.templateId || "default"}
                                                </span>
                                            </td>

                                            {/* PUBLISHING */}
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                        store.published
                                                            ? "bg-green-50 text-green-700"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {store.published
                                                        ? "Published"
                                                        : "Unpublished"}
                                                </span>
                                            </td>

                                            {/* STORE STATUS */}
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                        isSuspended
                                                            ? "bg-red-50 text-red-700"
                                                            : "bg-green-50 text-green-700"
                                                    }`}
                                                >
                                                    {isSuspended
                                                        ? "Suspended"
                                                        : "Active"}
                                                </span>
                                            </td>

                                            {/* CREATED DATE */}
                                            <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                {store.createdAt
                                                    ? new Date(
                                                          store.createdAt
                                                      ).toLocaleDateString()
                                                    : "—"}
                                            </td>

                                            {/* ACTIONS */}
                                            <td className="px-5 py-4 text-right">
                                                {(canViewStores ||
                                                    canEditStores ||
                                                    canSuspendStores) && (
                                                    <div className="relative inline-block">
                                                        <button
                                                            onClick={() =>
                                                                setOpenMenu(
                                                                    openMenu ===
                                                                        store._id
                                                                        ? null
                                                                        : store._id
                                                                )
                                                            }
                                                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                                                        >
                                                            <MoreVertical
                                                                size={18}
                                                            />
                                                        </button>

                                                        {openMenu ===
                                                            store._id && (
                                                            <div className="absolute right-0 top-10 z-20 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-left">

                                                                {canViewStores && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleViewDetails(
                                                                                store._id
                                                                            )
                                                                        }
                                                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                                                    >
                                                                        <Eye
                                                                            size={16}
                                                                        />
                                                                        View Details
                                                                    </button>
                                                                )}

                                                                {canEditStores && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleStartEdit(
                                                                                store
                                                                            )
                                                                        }
                                                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                                                    >
                                                                        <Pencil
                                                                            size={16}
                                                                        />
                                                                        Edit Store
                                                                    </button>
                                                                )}

                                                                {canSuspendStores &&
                                                                    (isSuspended ? (
                                                                        <button
                                                                            onClick={() =>
                                                                                handleReactivateStore(
                                                                                    store
                                                                                )
                                                                            }
                                                                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50"
                                                                        >
                                                                            <RefreshCw
                                                                                size={16}
                                                                            />
                                                                            Reactivate
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => {
                                                                                setSuspendingStore(
                                                                                    store
                                                                                );
                                                                                setOpenMenu(
                                                                                    null
                                                                                );
                                                                            }}
                                                                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                                                        >
                                                                            <Ban
                                                                                size={16}
                                                                            />
                                                                            Suspend Store
                                                                        </button>
                                                                    ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Showing{" "}
                        {stores.length > 0
                            ? (page - 1) * STORES_PER_PAGE + 1
                            : 0}{" "}
                        to {(page - 1) * STORES_PER_PAGE + stores.length} of{" "}
                        {pagination.total} stores
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={page <= 1 || loading}
                            onClick={() => setPage((prev) => prev - 1)}
                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        <span className="text-xs text-gray-500 px-2">
                            Page {page} of {Math.max(1, pagination.totalPages)}
                        </span>

                        <button
                            disabled={
                                page >= pagination.totalPages || loading
                            }
                            onClick={() => setPage((prev) => prev + 1)}
                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* ======================================
                STORE DETAILS / EDIT DRAWER
            ====================================== */}
            {drawerOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">

                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={closeDrawer}
                    />

                    <div className="relative w-full max-w-xl bg-white h-full overflow-y-auto shadow-xl">

                        {/* DRAWER HEADER */}
                        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {isEditing
                                        ? "Edit Store"
                                        : "Store Details"}
                                </h2>

                                <p className="text-xs text-gray-400 mt-1">
                                    Manage storefront information
                                </p>
                            </div>

                            <button
                                onClick={closeDrawer}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* DRAWER CONTENT */}
                        <div className="p-6">

                            {drawerLoading ? (
                                <div className="py-20 text-center">
                                    <Loader2
                                        size={30}
                                        className="animate-spin text-orange-500 mx-auto"
                                    />

                                    <p className="text-sm text-gray-500 mt-3">
                                        Loading store details...
                                    </p>
                                </div>
                            ) : drawerError ? (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                    {drawerError}
                                </div>
                            ) : drawerStore && (
                                <>
                                    {/* EDIT FORM */}
                                    {isEditing ? (
                                        <form
                                            onSubmit={handleSaveStore}
                                            className="space-y-5"
                                        >
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Store Name
                                                </label>

                                                <input
                                                    type="text"
                                                    name="storeName"
                                                    value={editForm.storeName}
                                                    onChange={handleEditChange}
                                                    maxLength={80}
                                                    required
                                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Store Email
                                                </label>

                                                <input
                                                    type="email"
                                                    name="storeEmail"
                                                    value={editForm.storeEmail}
                                                    onChange={handleEditChange}
                                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Template ID
                                                </label>

                                                <input
                                                    type="text"
                                                    name="templateId"
                                                    value={editForm.templateId}
                                                    onChange={handleEditChange}
                                                    maxLength={40}
                                                    required
                                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                                />
                                            </div>

                                            <div className="flex gap-3 pt-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setIsEditing(false)
                                                    }
                                                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="submit"
                                                    disabled={saving}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-60"
                                                >
                                                    {saving && (
                                                        <Loader2
                                                            size={16}
                                                            className="animate-spin"
                                                        />
                                                    )}

                                                    {saving
                                                        ? "Saving..."
                                                        : "Save Changes"}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            {/* STORE PROFILE */}
                                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                                <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">
                                                    <Store
                                                        size={26}
                                                        className="text-orange-600"
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-gray-900">
                                                        {drawerStore.storeName}
                                                    </h3>

                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {drawerStore.slug ||
                                                            "No store address"}
                                                    </p>

                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                drawerStore.status ===
                                                                "suspended"
                                                                    ? "bg-red-50 text-red-700"
                                                                    : "bg-green-50 text-green-700"
                                                            }`}
                                                        >
                                                            {drawerStore.status ===
                                                            "suspended"
                                                                ? "Suspended"
                                                                : "Active"}
                                                        </span>

                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                drawerStore.published
                                                                    ? "bg-blue-50 text-blue-700"
                                                                    : "bg-gray-200 text-gray-600"
                                                            }`}
                                                        >
                                                            {drawerStore.published
                                                                ? "Published"
                                                                : "Unpublished"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* STORE INFORMATION */}
                                            <div className="mt-7">
                                                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                                    Store Information
                                                </h3>

                                                <div className="border border-gray-200 rounded-xl px-4">
                                                    <DetailItem
                                                        label="Store Name"
                                                        value={drawerStore.storeName}
                                                        icon={Store}
                                                    />

                                                    <DetailItem
                                                        label="Store Email"
                                                        value={drawerStore.storeEmail}
                                                        icon={Mail}
                                                    />

                                                    <DetailItem
                                                        label="Store Slug"
                                                        value={drawerStore.slug}
                                                        icon={Globe}
                                                    />

                                                    <DetailItem
                                                        label="Template"
                                                        value={drawerStore.templateId}
                                                        icon={LayoutTemplate}
                                                    />

                                                    <DetailItem
                                                        label="Created At"
                                                        value={
                                                            drawerStore.createdAt
                                                                ? new Date(
                                                                      drawerStore.createdAt
                                                                  ).toLocaleString()
                                                                : "Not available"
                                                        }
                                                        icon={CalendarDays}
                                                    />
                                                </div>
                                            </div>

                                            {/* OWNER INFORMATION */}
                                            <div className="mt-7">
                                                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                                    Store Owner
                                                </h3>

                                                <div className="border border-gray-200 rounded-xl px-4">
                                                    <DetailItem
                                                        label="Owner Name"
                                                        value={drawerStore.userId?.name}
                                                        icon={User}
                                                    />

                                                    <DetailItem
                                                        label="Username"
                                                        value={drawerStore.userId?.username}
                                                    />

                                                    <DetailItem
                                                        label="Email"
                                                        value={drawerStore.userId?.email}
                                                        icon={Mail}
                                                    />

                                                    <DetailItem
                                                        label="Owner Account Status"
                                                        value={drawerStore.userId?.status}
                                                    />
                                                </div>
                                            </div>

                                            {/* SUSPENSION INFORMATION */}
                                            {drawerStore.status ===
                                                "suspended" && (
                                                <div className="mt-7 p-4 bg-red-50 border border-red-100 rounded-xl">
                                                    <h3 className="text-sm font-semibold text-red-800">
                                                        Suspension Information
                                                    </h3>

                                                    <p className="text-xs text-red-700 mt-2">
                                                        Reason:{" "}
                                                        {drawerStore.suspensionReason ||
                                                            "No reason provided"}
                                                    </p>

                                                    <p className="text-xs text-red-700 mt-2">
                                                        Suspended At:{" "}
                                                        {drawerStore.suspendedAt
                                                            ? new Date(
                                                                  drawerStore.suspendedAt
                                                              ).toLocaleString()
                                                            : "Not available"}
                                                    </p>
                                                </div>
                                            )}

                                            {/* DRAWER ACTIONS */}
                                            <div className="flex flex-wrap gap-3 mt-7 pt-5 border-t border-gray-200">
                                                {canEditStores && (
                                                    <button
                                                        onClick={() => {
                                                            setEditForm({
                                                                storeName:
                                                                    drawerStore.storeName ||
                                                                    "",
                                                                storeEmail:
                                                                    drawerStore.storeEmail ||
                                                                    "",
                                                                templateId:
                                                                    drawerStore.templateId ||
                                                                    "default",
                                                            });

                                                            setIsEditing(true);
                                                        }}
                                                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700"
                                                    >
                                                        <Pencil size={16} />
                                                        Edit Store
                                                    </button>
                                                )}

                                                {canSuspendStores &&
                                                    (drawerStore.status ===
                                                    "suspended" ? (
                                                        <button
                                                            onClick={() =>
                                                                handleReactivateStore(
                                                                    drawerStore
                                                                )
                                                            }
                                                            disabled={
                                                                processingAction
                                                            }
                                                            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-green-200 text-green-700 rounded-lg text-sm font-medium hover:bg-green-50 disabled:opacity-50"
                                                        >
                                                            <RefreshCw
                                                                size={16}
                                                            />
                                                            Reactivate Store
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setSuspendingStore(
                                                                    drawerStore
                                                                );
                                                                setDrawerOpen(
                                                                    false
                                                                );
                                                            }}
                                                            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
                                                        >
                                                            <Ban size={16} />
                                                            Suspend Store
                                                        </button>
                                                    ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================
                SUSPEND CONFIRMATION MODAL
            ====================================== */}
            {suspendingStore && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => {
                            if (!processingAction) {
                                setSuspendingStore(null);
                                setSuspensionReason("");
                            }
                        }}
                    />

                    <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div className="w-11 h-11 bg-red-50 rounded-full flex items-center justify-center">
                                <Ban size={21} className="text-red-600" />
                            </div>

                            <button
                                disabled={processingAction}
                                onClick={() => {
                                    setSuspendingStore(null);
                                    setSuspensionReason("");
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={18} className="text-gray-500" />
                            </button>
                        </div>

                        <h2 className="text-lg font-semibold text-gray-900 mt-4">
                            Suspend Store
                        </h2>

                        <p className="text-sm text-gray-500 mt-2">
                            Are you sure you want to suspend{" "}
                            <span className="font-semibold text-gray-800">
                                {suspendingStore.storeName}
                            </span>
                            ?
                        </p>

                        <div className="mt-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for suspension
                            </label>

                            <textarea
                                value={suspensionReason}
                                onChange={(e) =>
                                    setSuspensionReason(e.target.value)
                                }
                                maxLength={500}
                                rows={3}
                                placeholder="Enter the reason (optional)..."
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
                            />

                            <p className="text-xs text-gray-400 text-right mt-1">
                                {suspensionReason.length}/500
                            </p>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                disabled={processingAction}
                                onClick={() => {
                                    setSuspendingStore(null);
                                    setSuspensionReason("");
                                }}
                                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={processingAction}
                                onClick={handleSuspendStore}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-60"
                            >
                                {processingAction && (
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />
                                )}

                                Confirm Suspension
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Stores;
