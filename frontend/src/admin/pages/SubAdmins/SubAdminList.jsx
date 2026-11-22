
import {
    Search,
    Plus,
    ShieldCheck,
    Users,
    UserCheck,
    UserX,
    MoreVertical,
    Pencil,
    Trash2,
    Eye,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

const SubAdminList = () => {
    const [subAdmins, setSubAdmins] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [openMenu, setOpenMenu] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const successMessage = location.state?.successMessage;

    // Fetch all Sub Admins
    const fetchSubAdmins = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await apiFetch("/admin/sub-admins", {
                method: "GET",
            });

            setSubAdmins(data.subAdmins || []);
        } catch (error) {
            console.error("Fetch Sub Admins Error:", error);
            setError(error.message || "Failed to fetch Sub Admins.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubAdmins();
    }, []);

    // Summary calculations
    const activeCount = subAdmins.filter(
        (admin) => admin.status === "active"
    ).length;

    const inactiveCount = subAdmins.filter(
        (admin) => admin.status !== "active"
    ).length;

    // Search and status filtering
    const filteredAdmins = subAdmins.filter((admin) => {
        const searchTerm = search.toLowerCase();

        const matchesSearch =
            admin.name?.toLowerCase().includes(searchTerm) ||
            admin.username?.toLowerCase().includes(searchTerm) ||
            admin.email?.toLowerCase().includes(searchTerm);

        const matchesStatus =
            statusFilter === "All" ||
            (statusFilter === "inactive"
                ? admin.status !== "active"
                : admin.status === statusFilter);

        return matchesSearch && matchesStatus;
    });

    // Format MongoDB date
    const formatDate = (date) => {
        if (!date) return "Not available";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Suspend or reactivate Sub Admin
    const handleStatusChange = async (admin) => {
        const isActive = admin.status === "active";

        const action = isActive ? "suspend" : "reactivate";

        const confirmed = window.confirm(
            `Are you sure you want to ${
                isActive ? "suspend" : "reactivate"
            } ${admin.name}?`
        );

        if (!confirmed) return;

        try {
            setActionLoading(admin.id);
            setError("");

            const data = await apiFetch(
                `/admin/sub-admins/${admin.id}/${action}`,
                {
                    method: "PATCH",
                }
            );

            setSubAdmins((prev) =>
                prev.map((item) =>
                    item.id === admin.id
                        ? data.subAdmin
                        : item
                )
            );

            setOpenMenu(null);
        } catch (error) {
            console.error("Update Sub Admin Status Error:", error);
            setError(error.message || "Failed to update account status.");
        } finally {
            setActionLoading(null);
        }
    };

    // Delete Sub Admin
    const handleDelete = async (admin) => {
        const confirmed = window.confirm(
            `Are you sure you want to permanently delete ${admin.name}?`
        );

        if (!confirmed) return;

        try {
            setActionLoading(admin.id);
            setError("");

            await apiFetch(`/admin/sub-admins/${admin.id}`, {
                method: "DELETE",
            });

            setSubAdmins((prev) =>
                prev.filter((item) => item.id !== admin.id)
            );

            setOpenMenu(null);
        } catch (error) {
            console.error("Delete Sub Admin Error:", error);
            setError(error.message || "Failed to delete Sub Admin.");
        } finally {
            setActionLoading(null);
        }
    };

    const summaryCards = [
        {
            title: "Total Sub Admins",
            value: subAdmins.length,
            icon: Users,
            color: "bg-blue-50 text-blue-600",
        },
        {
            title: "Active Sub Admins",
            value: activeCount,
            icon: UserCheck,
            color: "bg-green-50 text-green-600",
        },
        {
            title: "Inactive Sub Admins",
            value: inactiveCount,
            icon: UserX,
            color: "bg-red-50 text-red-600",
        },
    ];

    return (
        <div className="space-y-7">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Sub Admin Management
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage administrators and control their platform access.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/admin/sub-admins/create")}
                    className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition"
                >
                    <Plus size={18} />
                    Add Sub Admin
                </button>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
                    {successMessage}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-3">
                    <p className="text-sm text-red-600">
                        {error}
                    </p>

                    <button
                        onClick={fetchSubAdmins}
                        className="text-sm font-medium text-red-700 hover:underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {summaryCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.title}
                            className="bg-white border border-gray-200 rounded-2xl p-5"
                        >
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-500 font-medium">
                                    {card.title}
                                </p>

                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                                    <Icon size={20} />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mt-4">
                                {loading ? "..." : card.value}
                            </h2>
                        </div>
                    );
                })}
            </div>

            {/* Sub Admin Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

                {/* Search and Filter */}
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <div>
                        <h2 className="font-semibold text-gray-900">
                            All Sub Admins
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Manage all administrator accounts.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">

                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Search admins..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-orange-500"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-orange-500"
                        >
                            <option value="All">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive / Suspended</option>
                        </select>

                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[950px] text-left">

                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-5 py-4 font-medium">Administrator</th>
                                <th className="px-5 py-4 font-medium">Role</th>
                                <th className="px-5 py-4 font-medium">Permissions</th>
                                <th className="px-5 py-4 font-medium">Created At</th>
                                <th className="px-5 py-4 font-medium">Status</th>
                                <th className="px-5 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-12 text-sm text-gray-500"
                                    >
                                        Loading Sub Admins...
                                    </td>
                                </tr>
                            ) : filteredAdmins.length > 0 ? (
                                filteredAdmins.map((admin) => (
                                    <tr
                                        key={admin.id}
                                        className="hover:bg-gray-50"
                                    >

                                        {/* Administrator */}
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {admin.name}
                                            </p>

                                            <p className="text-xs text-gray-500 mt-1">
                                                {admin.email}
                                            </p>

                                            <p className="text-xs text-gray-400 mt-1">
                                                @{admin.username}
                                            </p>
                                        </td>

                                        {/* Designation */}
                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {admin.adminTitle || "Not assigned"}
                                        </td>

                                        {/* Permissions */}
                                        <td className="px-5 py-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {(admin.permissions || []).map(
                                                    (permission) => (
                                                        <span
                                                            key={permission}
                                                            className="px-2 py-1 rounded-md bg-orange-50 text-orange-700 text-xs"
                                                        >
                                                            {permission}
                                                        </span>
                                                    )
                                                )}
                                            </div>

                                            <p className="text-xs text-gray-400 mt-2">
                                                {admin.permissions?.length || 0} permissions
                                            </p>
                                        </td>

                                        {/* Created At */}
                                        <td className="px-5 py-4 text-sm text-gray-500">
                                            {formatDate(admin.createdAt)}
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                    admin.status === "active"
                                                        ? "bg-green-50 text-green-700"
                                                        : admin.status === "suspended"
                                                            ? "bg-red-50 text-red-700"
                                                            : "bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                                {admin.status}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4 text-right relative">
                                            <button
                                                disabled={actionLoading === admin.id}
                                                onClick={() =>
                                                    setOpenMenu(
                                                        openMenu === admin.id
                                                            ? null
                                                            : admin.id
                                                    )
                                                }
                                                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {openMenu === admin.id && (
                                                <div className="absolute right-8 top-12 z-20 w-44 bg-white border border-gray-200 rounded-xl shadow-lg p-2">

                                                    <button
                                                        onClick={() => {
                                                            navigate(
                                                                `/admin/sub-admins/view/${admin.id}`
                                                            );
                                                            setOpenMenu(null);
                                                        }}
                                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                                                    >
                                                        <Eye size={16} />
                                                        View Details
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            navigate(
                                                                `/admin/sub-admins/edit/${admin.id}`
                                                            );
                                                            setOpenMenu(null);
                                                        }}
                                                        className="flex items-center gap-2 w-full p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                                                    >
                                                        <Pencil size={16} />
                                                        Edit Admin
                                                    </button>

                                                    <button
                                                        disabled={actionLoading === admin.id}
                                                        onClick={() =>
                                                            handleStatusChange(admin)
                                                        }
                                                        className="flex items-center gap-2 w-full p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg disabled:opacity-50"
                                                    >
                                                        <ShieldCheck size={16} />
                                                        {admin.status === "active"
                                                            ? "Suspend"
                                                            : "Reactivate"}
                                                    </button>

                                                    <button
                                                        disabled={actionLoading === admin.id}
                                                        onClick={() =>
                                                            handleDelete(admin)
                                                        }
                                                        className="flex items-center gap-2 w-full p-2 text-sm text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete Admin
                                                    </button>

                                                </div>
                                            )}
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-12 text-sm text-gray-500"
                                    >
                                        No Sub Admins found.
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="px-5 py-4 border-t border-gray-100 text-sm text-gray-500">
                    Showing {filteredAdmins.length} of {subAdmins.length} Sub Admins
                </div>

            </div>
        </div>
    );
};

export default SubAdminList;
