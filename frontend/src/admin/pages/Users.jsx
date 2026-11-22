
import { useEffect, useState } from "react";

import {
    Users as UsersIcon,
    UserCheck,
    UserX,
    Ban,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Pencil,
    ChevronLeft,
    ChevronRight,
    Store,
    Trash2,
    X,
    Mail,
    ShieldCheck,
    Globe,
    Clock,
} from "lucide-react";

import { apiFetch, getStoredUser } from "../../utils/api";

const USERS_PER_PAGE = 5;

const Users = () => {

    // ==========================================
    // AUTHENTICATION & PERMISSIONS
    // ==========================================

    const currentUser = getStoredUser();

    const isSuperAdmin = currentUser?.role === "superadmin";

    const permissions = currentUser?.permissions || [];

    const canViewUsers =
        isSuperAdmin || permissions.includes("View Users");

    const canEditUsers =
        isSuperAdmin || permissions.includes("Edit Users");

    const canDeleteUsers =
        isSuperAdmin || permissions.includes("Delete Users");


    // ==========================================
    // USERS & STATISTICS
    // ==========================================

    const [users, setUsers] = useState([]);

    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        suspendedUsers: 0,
    });


    // ==========================================
    // SEARCH & FILTERS
    // ==========================================

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");


    // ==========================================
    // PAGINATION
    // ==========================================

    const [currentPage, setCurrentPage] = useState(1);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        limit: USERS_PER_PAGE,
        totalUsers: 0,
        totalPages: 0,
    });


    // ==========================================
    // UI STATES
    // ==========================================

    const [openMenu, setOpenMenu] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [refreshKey, setRefreshKey] = useState(0);

    const [actionLoading, setActionLoading] = useState(null);

    const [actionMessage, setActionMessage] = useState({
        type: "",
        text: "",
    });


    // ==========================================
    // USER DETAILS DRAWER
    // ==========================================

    const [selectedUser, setSelectedUser] = useState(null);

    const [userDetails, setUserDetails] = useState(null);

    const [detailsLoading, setDetailsLoading] = useState(false);

    const [detailsError, setDetailsError] = useState("");


    // ==========================================
    // EDIT USER
    // ==========================================

    const [isEditing, setIsEditing] = useState(false);

    const [editForm, setEditForm] = useState({
        name: "",
        username: "",
        email: "",
        status: "active",
    });

    const [editSaving, setEditSaving] = useState(false);


    // ==========================================
    // FETCH USERS
    // ==========================================

    useEffect(() => {

        // Do not request user data without View Users.
        if (!canViewUsers) {
            setLoading(false);
            return;
        }

        let cancelled = false;

        const fetchUsers = async () => {

            try {

                setLoading(true);
                setError("");

                const params = new URLSearchParams({
                    search,
                    status: statusFilter,
                    page: String(currentPage),
                    limit: String(USERS_PER_PAGE),
                });

                const response = await apiFetch(
                    `/admin/users?${params.toString()}`
                );

                if (cancelled) return;

                setUsers(response.data || []);

                setStats({
                    totalUsers: response.stats?.totalUsers || 0,
                    activeUsers: response.stats?.activeUsers || 0,
                    inactiveUsers: response.stats?.inactiveUsers || 0,
                    suspendedUsers: response.stats?.suspendedUsers || 0,
                });

                setPagination(
                    response.pagination || {
                        currentPage: 1,
                        limit: USERS_PER_PAGE,
                        totalUsers: 0,
                        totalPages: 0,
                    }
                );

            } catch (err) {

                if (cancelled) return;

                console.error("Fetch Users Error:", err);

                setError(
                    err.message || "Failed to fetch users. Please try again."
                );

                setUsers([]);

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }
        };

        fetchUsers();

        return () => {
            cancelled = true;
        };

    }, [search, statusFilter, currentPage, refreshKey, canViewUsers]);


    // ==========================================
    // SEARCH & FILTER HANDLERS
    // ==========================================

    const handleSearchChange = (value) => {

        setSearch(value);
        setCurrentPage(1);
        setOpenMenu(null);

    };

    const handleFilterChange = (value) => {

        setStatusFilter(value);
        setCurrentPage(1);
        setOpenMenu(null);

    };


    // ==========================================
    // FORMAT DATE & TIME
    // ==========================================

    const formatDateTime = (date) => {

        if (!date) return "—";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    };

    const formatDate = (date) => {

        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    };


    // ==========================================
    // STATUS HELPERS
    // ==========================================

    const getStatusStyle = (status) => {

        switch (status?.toLowerCase()) {

            case "active":
                return "bg-green-50 text-green-700";

            case "inactive":
                return "bg-gray-100 text-gray-600";

            case "suspended":
                return "bg-red-50 text-red-700";

            default:
                return "bg-gray-100 text-gray-600";

        }

    };

    const getStatusLabel = (status) => {

        return status
            ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
            : "Active";

    };


    // ==========================================
    // VIEW USER DETAILS
    // ==========================================

    const handleViewDetails = async (user, startEditing = false) => {

        if (!canViewUsers) return;

        if (startEditing && !canEditUsers) return;

        setSelectedUser(user);

        setUserDetails(null);

        setDetailsError("");

        setDetailsLoading(true);

        setIsEditing(false);

        try {

            const response = await apiFetch(
                `/admin/users/${user._id}`
            );

            const fetchedUser = response.data.user;

            setUserDetails(response.data);

            setSelectedUser(fetchedUser);

            if (startEditing) {

                setEditForm({
                    name: fetchedUser.name || "",
                    username: fetchedUser.username || "",
                    email: fetchedUser.email || "",
                    status: fetchedUser.status || "active",
                });

                setIsEditing(true);

            }

        } catch (error) {

            setDetailsError(
                error.message || "Failed to load user details."
            );

        } finally {

            setDetailsLoading(false);

        }

    };


    // ==========================================
    // EDIT USER HANDLERS
    // ==========================================

    const handleStartEdit = () => {

        if (!canEditUsers || !drawerUser) return;

        if (drawerUser.role === "superadmin") return;

        setEditForm({
            name: drawerUser.name || "",
            username: drawerUser.username || "",
            email: drawerUser.email || "",
            status: drawerUser.status || "active",
        });

        setIsEditing(true);

    };

    const handleCancelEdit = () => {

        setIsEditing(false);

        setEditForm({
            name: "",
            username: "",
            email: "",
            status: "active",
        });

    };

    const handleEditChange = (e) => {

        const { name, value } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    // ==========================================
    // SAVE USER EDITS
    // ==========================================

    const handleSaveEdit = async (e) => {

        e.preventDefault();

        if (!canEditUsers) return;

        if (!drawerUser?._id) return;

        if (drawerUser.role === "superadmin") return;

        try {

            setEditSaving(true);

            setActionMessage({
                type: "",
                text: "",
            });

            const response = await apiFetch(
                `/admin/users/${drawerUser._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editForm),
                }
            );

            const updatedUser =
                response.data?.user ||
                response.data ||
                editForm;

            setSelectedUser(updatedUser);

            setUserDetails((prev) => ({
                ...prev,
                user: updatedUser,
            }));

            setIsEditing(false);

            setActionMessage({
                type: "success",
                text: "User details updated successfully.",
            });

            setRefreshKey((prev) => prev + 1);

        } catch (error) {

            setActionMessage({
                type: "error",
                text: error.message || "Failed to update user details.",
            });

        } finally {

            setEditSaving(false);

        }

    };


    // ==========================================
    // CLOSE DETAILS DRAWER
    // ==========================================

    const closeDetailsDrawer = () => {

        setSelectedUser(null);

        setUserDetails(null);

        setDetailsError("");

        setIsEditing(false);

    };


    // ==========================================
    // ACCOUNT ACTIONS
    // ==========================================

    const handleAccountAction = async (user, action) => {

        if (!user?._id) return;

        // Permission checks before executing actions.
        if (
            (action === "suspend" || action === "reactivate") &&
            !canEditUsers
        ) {
            return;
        }

        if (action === "delete" && !canDeleteUsers) {
            return;
        }

        // Protect Super Admin accounts.
        if (user.role === "superadmin") {
            return;
        }

        const actionConfig = {

            suspend: {
                endpoint: `/admin/users/${user._id}/suspend`,
                method: "PATCH",
                confirmation: `Are you sure you want to suspend ${user.name}? They will lose access to their account.`,
                success: `${user.name} has been suspended successfully.`,
            },

            reactivate: {
                endpoint: `/admin/users/${user._id}/reactivate`,
                method: "PATCH",
                confirmation: `Are you sure you want to reactivate ${user.name}?`,
                success: `${user.name} has been reactivated successfully.`,
            },

            delete: {
                endpoint: `/admin/users/${user._id}`,
                method: "DELETE",
                confirmation: `PERMANENTLY DELETE ${user.name}?\n\nThis will also delete their associated storefront configurations. This action cannot be undone.`,
                success: `${user.name} and their associated stores have been deleted.`,
            },

        };

        const config = actionConfig[action];

        if (!config) return;

        const confirmed = window.confirm(config.confirmation);

        if (!confirmed) return;

        try {

            setActionLoading(user._id);

            setActionMessage({
                type: "",
                text: "",
            });

            setOpenMenu(null);

            await apiFetch(config.endpoint, {
                method: config.method,
            });

            setActionMessage({
                type: "success",
                text: config.success,
            });

            // Update drawer after account actions.
            if (action === "delete") {

                closeDetailsDrawer();

            } else {

                const updatedStatus =
                    action === "suspend" ? "suspended" : "active";

                setSelectedUser((prev) =>
                    prev?._id === user._id
                        ? { ...prev, status: updatedStatus }
                        : prev
                );

                setUserDetails((prev) =>
                    prev
                        ? {
                            ...prev,
                            user: {
                                ...prev.user,
                                status: updatedStatus,
                            },
                        }
                        : prev
                );

            }

            // Move back a page if the last user was deleted.
            if (
                action === "delete" &&
                users.length === 1 &&
                currentPage > 1
            ) {

                setCurrentPage((prev) => prev - 1);

            } else {

                setRefreshKey((prev) => prev + 1);

            }

        } catch (err) {

            console.error(`${action} User Error:`, err);

            setActionMessage({
                type: "error",
                text: err.message || `Failed to ${action} user. Please try again.`,
            });

        } finally {

            setActionLoading(null);

        }

    };


    // ==========================================
    // PAGINATION INFORMATION
    // ==========================================

    const totalPages = pagination.totalPages;

    const totalUsers = pagination.totalUsers;

    const startIndex =
        totalUsers === 0
            ? 0
            : (currentPage - 1) * USERS_PER_PAGE + 1;

    const endIndex = Math.min(
        currentPage * USERS_PER_PAGE,
        totalUsers
    );

    const drawerUser = userDetails?.user || selectedUser;

    const associatedStores = userDetails?.stores || [];


    // ==========================================
    // ACCESS RESTRICTION
    // ==========================================

    if (!canViewUsers) {

        return (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">

                <ShieldCheck
                    size={40}
                    className="mx-auto text-red-500 mb-3"
                />

                <h2 className="text-lg font-semibold text-gray-900">
                    Access Restricted
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                    You don't have permission to view user management.
                    Please contact your Super Admin.
                </p>

            </div>
        );

    }


    // ==========================================
    // MAIN UI
    // ==========================================

    return (

        <div className="space-y-7">

            {/* Header */}
            <div>

                <h1 className="text-2xl font-bold text-gray-900">
                    User Management
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Manage and monitor all registered Tandav users.
                </p>

            </div>


            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                <SummaryCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={UsersIcon}
                    iconStyle="bg-orange-50 text-orange-600"
                />

                <SummaryCard
                    title="Active Users"
                    value={stats.activeUsers}
                    icon={UserCheck}
                    iconStyle="bg-green-50 text-green-600"
                />

                <SummaryCard
                    title="Inactive Users"
                    value={stats.inactiveUsers}
                    icon={UserX}
                    iconStyle="bg-gray-100 text-gray-600"
                />

                <SummaryCard
                    title="Suspended Users"
                    value={stats.suspendedUsers}
                    icon={Ban}
                    iconStyle="bg-red-50 text-red-600"
                />

            </div>


            {/* Action Message */}
            {actionMessage.text && (

                <div
                    className={`p-4 rounded-xl border text-sm ${actionMessage.type === "success"
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-700"
                        }`}
                >
                    {actionMessage.text}
                </div>

            )}


            {/* User Table */}
            <div className="bg-white border border-gray-200 rounded-2xl">

                {/* Table Header */}
                <div className="p-5 border-b border-gray-100">

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                        <div>

                            <h2 className="font-semibold text-gray-900">
                                All Users
                            </h2>

                            <p className="text-xs text-gray-500 mt-1">
                                View and manage registered accounts.
                            </p>

                        </div>


                        <div className="flex flex-col sm:flex-row gap-3">

                            {/* Search */}
                            <div className="relative">

                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        handleSearchChange(e.target.value)
                                    }
                                    placeholder="Search users..."
                                    className="w-full sm:w-64 pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400"
                                />

                            </div>


                            {/* Status Filter */}
                            <div className="relative">

                                <Filter
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                />

                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        handleFilterChange(e.target.value)
                                    }
                                    className="w-full sm:w-40 pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 bg-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                </select>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Table */}
                <div className="overflow-x-auto">

                    <table className="w-full text-left">

                        <thead className="bg-gray-50 border-b border-gray-100">

                            <tr>

                                <th className="px-5 py-4 text-xs font-semibold text-gray-500">
                                    USER
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold text-gray-500">
                                    USERNAME
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold text-gray-500">
                                    STORES
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold text-gray-500">
                                    JOINED DATE
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold text-gray-500">
                                    STATUS
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold text-gray-500 text-right">
                                    ACTIONS
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-gray-100">

                            {loading ? (

                                <tr>
                                    <td colSpan="6" className="px-5 py-12 text-center">

                                        <div className="flex flex-col items-center gap-3">

                                            <div className="w-7 h-7 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />

                                            <p className="text-sm text-gray-500">
                                                Loading users...
                                            </p>

                                        </div>

                                    </td>
                                </tr>

                            ) : error ? (

                                <tr>
                                    <td colSpan="6" className="px-5 py-12 text-center">

                                        <p className="text-sm font-medium text-red-600">
                                            {error}
                                        </p>

                                    </td>
                                </tr>

                            ) : users.length > 0 ? (

                                users.map((user) => {

                                    const userId = user._id;

                                    return (

                                        <tr
                                            key={userId}
                                            className="hover:bg-gray-50/70"
                                        >

                                            {/* User */}
                                            <td className="px-5 py-4">

                                                <div>

                                                    <p className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </p>

                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {user.email}
                                                    </p>

                                                </div>

                                            </td>


                                            {/* Username */}
                                            <td className="px-5 py-4">

                                                <span className="text-sm text-gray-600">
                                                    @{user.username}
                                                </span>

                                            </td>


                                            {/* Stores */}
                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-2 text-sm text-gray-600">

                                                    <Store
                                                        size={15}
                                                        className="text-gray-400"
                                                    />

                                                    {user.stores ?? 0}

                                                </div>

                                            </td>


                                            {/* Joined Date */}
                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {formatDate(user.joinedAt)}
                                            </td>


                                            {/* Status */}
                                            <td className="px-5 py-4">

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(user.status)}`}
                                                >
                                                    {getStatusLabel(user.status)}
                                                </span>

                                            </td>


                                            {/* Actions */}

                                            <td className="px-5 py-4 text-right relative">

                                                {/* Show menu only if at least one action is permitted */}
                                                {(canViewUsers || canEditUsers || canDeleteUsers) && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                setOpenMenu(
                                                                    openMenu === userId ? null : userId
                                                                )
                                                            }
                                                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                                                        >
                                                            <MoreVertical size={18} />
                                                        </button>

                                                        {openMenu === userId && (
                                                            <div className="absolute right-10 top-12 z-[100] w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2">

                                                                {/* View Details */}
                                                                {canViewUsers && (
                                                                    <button
                                                                        onClick={() => {
                                                                            setOpenMenu(null);
                                                                            handleViewDetails(user);
                                                                        }}
                                                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                                                    >
                                                                        <Eye size={16} />
                                                                        View Details
                                                                    </button>
                                                                )}

                                                                {/* Edit User */}
                                                                {canEditUsers && user.role !== "superadmin" && (
                                                                    <button
                                                                        onClick={() => {
                                                                            setOpenMenu(null);
                                                                            handleViewDetails(user, true);
                                                                        }}
                                                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                                                    >
                                                                        <Pencil size={16} />
                                                                        Edit User
                                                                    </button>
                                                                )}

                                                                {(canEditUsers || canDeleteUsers) &&
                                                                    user.role !== "superadmin" && (
                                                                        <div className="border-t border-gray-100 my-2" />
                                                                    )}

                                                                {/* Suspend / Reactivate */}
                                                                {canEditUsers && user.role !== "superadmin" && (
                                                                    user.status === "suspended" ? (
                                                                        <button
                                                                            disabled={actionLoading === userId}
                                                                            onClick={() =>
                                                                                handleAccountAction(user, "reactivate")
                                                                            }
                                                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50 disabled:opacity-50"
                                                                        >
                                                                            <UserCheck size={16} />
                                                                            {actionLoading === userId
                                                                                ? "Processing..."
                                                                                : "Reactivate User"}
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            disabled={actionLoading === userId}
                                                                            onClick={() =>
                                                                                handleAccountAction(user, "suspend")
                                                                            }
                                                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 disabled:opacity-50"
                                                                        >
                                                                            <Ban size={16} />
                                                                            {actionLoading === userId
                                                                                ? "Processing..."
                                                                                : "Suspend User"}
                                                                        </button>
                                                                    )
                                                                )}

                                                                {/* Delete User */}
                                                                {canDeleteUsers && user.role !== "superadmin" && (
                                                                    <button
                                                                        disabled={actionLoading === userId}
                                                                        onClick={() =>
                                                                            handleAccountAction(user, "delete")
                                                                        }
                                                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                        Delete User
                                                                    </button>
                                                                )}

                                                                {/* Protected Super Admin */}
                                                                {user.role === "superadmin" && (
                                                                    <p className="px-4 py-2 text-xs text-gray-400">
                                                                        Super Admin accounts are protected.
                                                                    </p>
                                                                )}

                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                            </td>

                                        </tr>

                                    );

                                })

                            ) : (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="px-5 py-12 text-center"
                                    >

                                        <UsersIcon
                                            size={35}
                                            className="mx-auto text-gray-300 mb-3"
                                        />

                                        <p className="text-sm font-medium text-gray-700">
                                            No users found
                                        </p>

                                        <p className="text-xs text-gray-500 mt-1">
                                            Try changing your search or filters.
                                        </p>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>


                    {/* ======================================
                        VIEW USER DETAILS DRAWER
                    ====================================== */}

                    {selectedUser && (

                        <div className="fixed inset-0 z-[100] flex justify-end">

                            {/* Backdrop */}
                            <button
                                type="button"
                                aria-label="Close user details"
                                onClick={closeDetailsDrawer}
                                className="absolute inset-0 bg-black/40"
                            />


                            {/* Drawer */}
                            <div
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="user-details-title"
                                className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl"
                            >

                                {/* Drawer Header */}
                                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

                                    <div>

                                        <h2
                                            id="user-details-title"
                                            className="text-lg font-bold text-gray-900"
                                        >
                                            {isEditing ? "Edit User" : "User Details"}
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {isEditing
                                                ? "Update the user's account information."
                                                : "View account information and associated storefronts."}
                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={closeDetailsDrawer}
                                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                    >
                                        <X size={20} />
                                    </button>

                                </div>


                                {/* Drawer Content */}
                                <div className="flex-1 space-y-6 overflow-y-auto p-6">

                                    {detailsLoading && (

                                        <div className="flex items-center justify-center gap-3 py-10">

                                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />

                                            <p className="text-sm text-gray-500">
                                                Loading user details...
                                            </p>

                                        </div>

                                    )}


                                    {detailsError && (

                                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                            {detailsError}
                                        </div>

                                    )}


                                    {drawerUser && !detailsLoading && (

                                        <>

                                            {/* User Profile */}
                                            <section className="rounded-2xl border border-gray-200 p-5">

                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-xl font-bold text-orange-600">
                                                        {drawerUser.name?.charAt(0)?.toUpperCase() || "U"}
                                                    </div>

                                                    <div className="min-w-0 flex-1">

                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {drawerUser.name}
                                                        </h3>

                                                        <p className="mt-1 text-sm text-gray-500">
                                                            @{drawerUser.username}
                                                        </p>

                                                        <div className="mt-3 flex flex-wrap gap-2">

                                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(drawerUser.status)}`}>
                                                                {getStatusLabel(drawerUser.status)}
                                                            </span>

                                                            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                                                                {(drawerUser.role || "user").toUpperCase()}
                                                            </span>

                                                        </div>

                                                    </div>

                                                </div>

                                            </section>


                                            {/* Account Information / Edit Form */}
                                            <section>

                                                <div className="mb-4 flex items-center gap-2">

                                                    <UsersIcon
                                                        size={18}
                                                        className="text-orange-600"
                                                    />

                                                    <h3 className="font-semibold text-gray-900">
                                                        {isEditing
                                                            ? "Edit Account Information"
                                                            : "Account Information"}
                                                    </h3>

                                                </div>


                                                {isEditing ? (

                                                    <form
                                                        id="edit-user-form"
                                                        onSubmit={handleSaveEdit}
                                                        className="space-y-4"
                                                    >

                                                        {/* Full Name */}
                                                        <div>

                                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                                Full Name
                                                            </label>

                                                            <input
                                                                type="text"
                                                                name="name"
                                                                value={editForm.name}
                                                                onChange={handleEditChange}
                                                                required
                                                                maxLength={80}
                                                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                                                placeholder="Enter full name"
                                                            />

                                                        </div>


                                                        {/* Username */}
                                                        <div>

                                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                                Username
                                                            </label>

                                                            <input
                                                                type="text"
                                                                name="username"
                                                                value={editForm.username}
                                                                onChange={handleEditChange}
                                                                required
                                                                minLength={3}
                                                                maxLength={30}
                                                                pattern="[a-z0-9_]+"
                                                                title="Use lowercase letters, numbers, and underscores only."
                                                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                                                placeholder="Enter username"
                                                            />

                                                        </div>


                                                        {/* Email */}
                                                        <div>

                                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                                Email Address
                                                            </label>

                                                            <input
                                                                type="email"
                                                                name="email"
                                                                value={editForm.email}
                                                                onChange={handleEditChange}
                                                                required
                                                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                                                placeholder="Enter email address"
                                                            />

                                                        </div>


                                                        {/* Status */}
                                                        <div>

                                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                                Account Status
                                                            </label>

                                                            <select
                                                                name="status"
                                                                value={editForm.status}
                                                                onChange={handleEditChange}
                                                                required
                                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                                            >

                                                                <option value="active">
                                                                    Active
                                                                </option>

                                                                <option value="inactive">
                                                                    Inactive
                                                                </option>

                                                                <option value="suspended">
                                                                    Suspended
                                                                </option>

                                                            </select>

                                                        </div>


                                                        <p className="text-xs text-gray-400">
                                                            User role and authentication provider cannot be edited here.
                                                        </p>

                                                    </form>

                                                ) : (

                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                                        <DetailItem
                                                            label="Full Name"
                                                            value={drawerUser.name}
                                                        />

                                                        <DetailItem
                                                            label="Username"
                                                            value={`@${drawerUser.username || "—"}`}
                                                        />

                                                        <DetailItem
                                                            label="Email Address"
                                                            value={drawerUser.email}
                                                        />

                                                        <DetailItem
                                                            label="User ID"
                                                            value={drawerUser._id}
                                                            breakAll
                                                        />

                                                        <DetailItem
                                                            label="Role"
                                                            value={drawerUser.role || "user"}
                                                        />

                                                        <DetailItem
                                                            label="Account Status"
                                                            value={getStatusLabel(drawerUser.status)}
                                                        />

                                                    </div>

                                                )}

                                            </section>


                                            {/* Authentication & Activity Information */}
                                            {!isEditing && (

                                                <>

                                                    {/* Authentication */}
                                                    <section>

                                                        <div className="mb-4 flex items-center gap-2">

                                                            <ShieldCheck
                                                                size={18}
                                                                className="text-orange-600"
                                                            />

                                                            <h3 className="font-semibold text-gray-900">
                                                                Authentication
                                                            </h3>

                                                        </div>


                                                        <div className="rounded-xl border border-gray-200 p-4">

                                                            <div className="flex items-center justify-between gap-3">

                                                                <div>

                                                                    <p className="text-xs text-gray-500">
                                                                        Login Provider
                                                                    </p>

                                                                    <div className="mt-2 flex items-center gap-2">

                                                                        {drawerUser.authProvider === "google" ? (

                                                                            <Globe
                                                                                size={17}
                                                                                className="text-blue-600"
                                                                            />

                                                                        ) : (

                                                                            <Mail
                                                                                size={17}
                                                                                className="text-gray-500"
                                                                            />

                                                                        )}

                                                                        <span className="text-sm font-medium text-gray-900">
                                                                            {drawerUser.authProvider === "google"
                                                                                ? "Google OAuth"
                                                                                : "Email / Password"}
                                                                        </span>

                                                                    </div>

                                                                </div>


                                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                                                                    {drawerUser.authProvider === "google"
                                                                        ? "Google"
                                                                        : "Local"}
                                                                </span>

                                                            </div>


                                                            {drawerUser.googleId && (

                                                                <div className="mt-4 border-t border-gray-100 pt-4">

                                                                    <p className="text-xs text-gray-500">
                                                                        Google ID
                                                                    </p>

                                                                    <p className="mt-1 break-all text-sm text-gray-700">
                                                                        {drawerUser.googleId}
                                                                    </p>

                                                                </div>

                                                            )}

                                                        </div>

                                                    </section>


                                                    {/* Account Activity */}
                                                    <section>

                                                        <div className="mb-4 flex items-center gap-2">

                                                            <Clock
                                                                size={18}
                                                                className="text-orange-600"
                                                            />

                                                            <h3 className="font-semibold text-gray-900">
                                                                Account Activity
                                                            </h3>

                                                        </div>


                                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                                            <DetailItem
                                                                label="Account Created"
                                                                value={formatDateTime(drawerUser.createdAt)}
                                                            />

                                                            <DetailItem
                                                                label="Last Updated"
                                                                value={formatDateTime(drawerUser.updatedAt)}
                                                            />

                                                        </div>

                                                    </section>


                                                    {/* Associated Stores */}
                                                    <section>

                                                        <div className="mb-4 flex items-center justify-between">

                                                            <div className="flex items-center gap-2">

                                                                <Store
                                                                    size={18}
                                                                    className="text-orange-600"
                                                                />

                                                                <h3 className="font-semibold text-gray-900">
                                                                    Associated Storefronts
                                                                </h3>

                                                            </div>


                                                            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                                                                {userDetails?.storeCount ?? associatedStores.length} Stores
                                                            </span>

                                                        </div>


                                                        {associatedStores.length === 0 ? (

                                                            <div className="rounded-xl border border-dashed border-gray-300 py-8 text-center">

                                                                <Store
                                                                    size={28}
                                                                    className="mx-auto mb-2 text-gray-300"
                                                                />

                                                                <p className="text-sm font-medium text-gray-700">
                                                                    No storefronts found
                                                                </p>

                                                                <p className="mt-1 text-xs text-gray-500">
                                                                    This user has not created a storefront yet.
                                                                </p>

                                                            </div>

                                                        ) : (

                                                            <div className="space-y-3">

                                                                {associatedStores.map((store) => (

                                                                    <div
                                                                        key={store._id}
                                                                        className="rounded-xl border border-gray-200 p-4"
                                                                    >

                                                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                                                                            <div className="flex items-start gap-3">

                                                                                <div className="rounded-lg bg-orange-50 p-2">

                                                                                    <Store
                                                                                        size={19}
                                                                                        className="text-orange-600"
                                                                                    />

                                                                                </div>


                                                                                <div className="min-w-0">

                                                                                    <h4 className="font-semibold text-gray-900">
                                                                                        {store.storeName || "Unnamed Store"}
                                                                                    </h4>

                                                                                    <p className="mt-1 break-all text-xs text-gray-500">
                                                                                        {store.storeEmail || "No store email"}
                                                                                    </p>

                                                                                </div>

                                                                            </div>


                                                                            <span className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${store.published
                                                                                ? "bg-green-50 text-green-700"
                                                                                : "bg-gray-100 text-gray-600"
                                                                                }`}>
                                                                                {store.published ? "Published" : "Unpublished"}
                                                                            </span>

                                                                        </div>


                                                                        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-3 sm:grid-cols-2">

                                                                            <div>

                                                                                <p className="text-xs text-gray-500">
                                                                                    Template
                                                                                </p>

                                                                                <p className="mt-1 text-sm font-medium text-gray-800">
                                                                                    {store.templateId || "default"}
                                                                                </p>

                                                                            </div>


                                                                            <div>

                                                                                <p className="text-xs text-gray-500">
                                                                                    Last Updated
                                                                                </p>

                                                                                <p className="mt-1 text-sm font-medium text-gray-800">
                                                                                    {formatDateTime(store.updatedAt)}
                                                                                </p>

                                                                            </div>

                                                                        </div>

                                                                    </div>

                                                                ))}

                                                            </div>

                                                        )}

                                                    </section>

                                                </>

                                            )}

                                        </>

                                    )}

                                </div>


                                {/* Drawer Footer Actions */}
                                {drawerUser && (

                                    <div className="border-t border-gray-200 bg-white p-5">

                                        {isEditing ? (

                                            <div className="flex justify-end gap-3">

                                                <button
                                                    type="button"
                                                    onClick={handleCancelEdit}
                                                    disabled={editSaving}
                                                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    Cancel
                                                </button>


                                                <button
                                                    type="submit"
                                                    form="edit-user-form"
                                                    disabled={editSaving}
                                                    className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {editSaving ? "Saving..." : "Save Changes"}
                                                </button>

                                            </div>

                                        ) : (

                                            <div className="flex flex-wrap items-center justify-between gap-3">

                                                {/* Edit User */}
                                                {canEditUsers &&
                                                    drawerUser.role !== "superadmin" && (

                                                        <button
                                                            type="button"
                                                            onClick={handleStartEdit}
                                                            disabled={detailsLoading || editSaving}
                                                            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            <Pencil size={16} />
                                                            Edit User
                                                        </button>

                                                    )}


                                                {drawerUser.role !== "superadmin" ? (

                                                    <div className="flex flex-wrap gap-2">

                                                        {/* Suspend / Reactivate */}
                                                        {canEditUsers && (

                                                            <button
                                                                type="button"
                                                                disabled={actionLoading === drawerUser._id}
                                                                onClick={() =>
                                                                    handleAccountAction(
                                                                        drawerUser,
                                                                        drawerUser.status === "suspended"
                                                                            ? "reactivate"
                                                                            : "suspend"
                                                                    )
                                                                }
                                                                className={`rounded-lg px-4 py-2.5 text-sm font-medium disabled:opacity-50 ${drawerUser.status === "suspended"
                                                                    ? "bg-green-50 text-green-700 hover:bg-green-100"
                                                                    : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                                                                    }`}
                                                            >
                                                                {actionLoading === drawerUser._id
                                                                    ? "Processing..."
                                                                    : drawerUser.status === "suspended"
                                                                        ? "Reactivate"
                                                                        : "Suspend"}
                                                            </button>

                                                        )}


                                                        {/* Delete */}
                                                        {canDeleteUsers && (

                                                            <button
                                                                type="button"
                                                                disabled={actionLoading === drawerUser._id}
                                                                onClick={() =>
                                                                    handleAccountAction(drawerUser, "delete")
                                                                }
                                                                className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                                                            >
                                                                <Trash2 size={16} />
                                                                Delete
                                                            </button>

                                                        )}

                                                    </div>

                                                ) : (

                                                    <p className="text-xs text-gray-400">
                                                        Super Admin accounts are protected.
                                                    </p>

                                                )}

                                            </div>

                                        )}

                                    </div>

                                )}

                            </div>

                        </div>

                    )}

                </div>


                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-gray-100">

                    <p className="text-xs text-gray-500">
                        Showing {startIndex} to {endIndex} of {totalUsers} users
                    </p>


                    <div className="flex items-center gap-2">

                        <button
                            disabled={loading || currentPage <= 1}
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            className="p-2 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                        >
                            <ChevronLeft size={17} />
                        </button>


                        <span className="text-sm text-gray-600 px-2">
                            Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
                        </span>


                        <button
                            disabled={loading || currentPage >= totalPages}
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(totalPages, prev + 1)
                                )
                            }
                            className="p-2 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                        >
                            <ChevronRight size={17} />
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

};


// ==========================================
// REUSABLE SUMMARY CARD
// ==========================================

const SummaryCard = ({ title, value, icon: Icon, iconStyle }) => {

    return (

        <div className="bg-white border border-gray-200 rounded-2xl p-5">

            <div className="flex items-center justify-between">

                <p className="text-sm font-medium text-gray-500">
                    {title}
                </p>

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconStyle}`}>
                    <Icon size={20} />
                </div>

            </div>


            <h2 className="text-2xl font-bold text-gray-900 mt-4">
                {Number(value || 0).toLocaleString("en-IN")}
            </h2>

        </div>

    );

};


// ==========================================
// REUSABLE USER DETAILS ITEM
// ==========================================

const DetailItem = ({ label, value, breakAll = false }) => {

    return (

        <div className="rounded-xl border border-gray-200 p-4">

            <p className="text-xs font-medium text-gray-500">
                {label}
            </p>

            <p className={`mt-2 text-sm font-medium text-gray-900 ${breakAll ? "break-all" : "break-words"
                }`}>
                {value || "—"}
            </p>

        </div>

    );

};


export default Users;