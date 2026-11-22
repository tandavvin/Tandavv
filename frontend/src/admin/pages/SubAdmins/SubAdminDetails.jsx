
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Pencil,
    ShieldCheck,
    Mail,
    User,
    Calendar,
    Briefcase,
    LoaderCircle,
    AlertCircle,
} from "lucide-react";

import { apiFetch } from "../../../utils/api";

function SubAdminDetails() {
    const navigate = useNavigate();
    const { subAdminId } = useParams();

    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSubAdmin = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await apiFetch(
                    `/admin/sub-admins/${subAdminId}`,
                    { method: "GET" }
                );

                setAdmin(data.subAdmin);
            } catch (err) {
                setError(err.message || "Failed to load Sub Admin details.");
            } finally {
                setLoading(false);
            }
        };

        if (subAdminId) {
            fetchSubAdmin();
        }
    }, [subAdminId]);

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <LoaderCircle className="animate-spin text-orange-600" size={30} />
                <span className="ml-3 text-sm text-gray-500">
                    Loading Sub Admin details...
                </span>
            </div>
        );
    }

    if (error || !admin) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle size={20} />
                    <p className="font-medium">
                        {error || "Sub Admin not found."}
                    </p>
                </div>

                <button
                    onClick={() => navigate("/admin/sub-admins")}
                    className="mt-4 text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                    Back to Sub Admins
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <button
                        onClick={() => navigate("/admin/sub-admins")}
                        className="mb-3 flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600"
                    >
                        <ArrowLeft size={16} />
                        Back to Sub Admins
                    </button>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Sub Admin Details
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        View account information and assigned permissions.
                    </p>
                </div>

                <button
                    onClick={() =>
                        navigate(`/admin/sub-admins/edit/${admin.id}`)
                    }
                    className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700"
                >
                    <Pencil size={16} />
                    Edit Admin
                </button>
            </div>

            {/* Profile Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-2xl font-bold text-orange-600">
                        {admin.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>

                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {admin.name}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {admin.adminTitle || "Sub Admin"}
                        </p>

                        <span
                            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                admin.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {admin.status === "active" ? "Active" : "Inactive / Suspended"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Account Information */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-5 text-lg font-semibold text-gray-900">
                    Account Information
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                        <User className="mt-1 text-gray-400" size={18} />
                        <div>
                            <p className="text-xs text-gray-500">Full Name</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                                {admin.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <User className="mt-1 text-gray-400" size={18} />
                        <div>
                            <p className="text-xs text-gray-500">Username</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                                @{admin.username}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Mail className="mt-1 text-gray-400" size={18} />
                        <div>
                            <p className="text-xs text-gray-500">Email Address</p>
                            <p className="mt-1 break-all text-sm font-medium text-gray-900">
                                {admin.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Briefcase className="mt-1 text-gray-400" size={18} />
                        <div>
                            <p className="text-xs text-gray-500">Designation</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                                {admin.adminTitle || "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-1 text-gray-400" size={18} />
                        <div>
                            <p className="text-xs text-gray-500">Platform Role</p>
                            <p className="mt-1 text-sm font-medium capitalize text-gray-900">
                                {admin.role}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Calendar className="mt-1 text-gray-400" size={18} />
                        <div>
                            <p className="text-xs text-gray-500">Created On</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                                {formatDate(admin.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Permissions */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Assigned Permissions
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Permissions granted to this Sub Admin.
                        </p>
                    </div>

                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                        {admin.permissions?.length || 0} Permissions
                    </span>
                </div>

                {admin.permissions?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {admin.permissions.map((permission) => (
                            <span
                                key={permission}
                                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                            >
                                {permission}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">
                        No permissions assigned.
                    </p>
                )}
            </div>
        </div>
    );
}

export default SubAdminDetails;
