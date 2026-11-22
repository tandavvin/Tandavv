
import {
    permissionGroups,
    permissionDependencies,
} from "../../constants/permissions";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

import {
    ArrowLeft,
    User,
    Mail,
    ShieldCheck,
    Lock,
    Save,
    X,
    LoaderCircle,
} from "lucide-react";

const initialFormData = {
    name: "",
    username: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    status: "active",
    permissions: [],
};

const SubAdminForm = () => {
    const navigate = useNavigate();
    const { subAdminId } = useParams();

    const isEditMode = Boolean(subAdminId);

    const [formData, setFormData] = useState(initialFormData);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(isEditMode);
    const [submitError, setSubmitError] = useState("");

    // Fetch existing Sub Admin details in edit mode
    useEffect(() => {
        if (!isEditMode) return;

        const fetchSubAdmin = async () => {
            try {
                setIsLoading(true);
                setSubmitError("");

                const data = await apiFetch(
                    `/admin/sub-admins/${subAdminId}`,
                    { method: "GET" }
                );

                const admin = data.subAdmin;

                if (!admin) {
                    throw new Error("Sub Admin details not found.");
                }

                setFormData({
                    name: admin.name || "",
                    username: admin.username || "",
                    email: admin.email || "",
                    role: admin.adminTitle || "",
                    password: "",
                    confirmPassword: "",
                    status: admin.status === "active" ? "active" : "inactive",
                    permissions: admin.permissions || [],
                });
            } catch (error) {
                console.error("Fetch Sub Admin Error:", error);

                setSubmitError(
                    error.message || "Failed to load Sub Admin details."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubAdmin();
    }, [isEditMode, subAdminId]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

        setSubmitError("");
    };

    // Permission selection
    const handlePermissionChange = (permission) => {
        setFormData((prev) => {
            const selected = prev.permissions;
            const isSelected = selected.includes(permission);

            if (isSelected) {
                const hasDependentActions = Object.entries(
                    permissionDependencies
                ).some(
                    ([action, view]) =>
                        view === permission && selected.includes(action)
                );

                if (hasDependentActions) {
                    return prev;
                }

                return {
                    ...prev,
                    permissions: selected.filter(
                        (item) => item !== permission
                    ),
                };
            }

            const requiredView = permissionDependencies[permission];

            return {
                ...prev,
                permissions: [
                    ...new Set([
                        ...selected,
                        permission,
                        ...(requiredView ? [requiredView] : []),
                    ]),
                ],
            };
        });

        setErrors((prev) => ({
            ...prev,
            permissions: "",
        }));
    };

    // Select or deselect an entire permission group
    const handleGroupChange = (group, checked) => {
        setFormData((prev) => {
            if (checked) {
                const updatedPermissions = [...prev.permissions];

                group.permissions.forEach((permission) => {
                    updatedPermissions.push(permission);

                    const requiredView =
                        permissionDependencies[permission];

                    if (requiredView) {
                        updatedPermissions.push(requiredView);
                    }
                });

                return {
                    ...prev,
                    permissions: [...new Set(updatedPermissions)],
                };
            }

            return {
                ...prev,
                permissions: prev.permissions.filter(
                    (permission) =>
                        !group.permissions.includes(permission)
                ),
            };
        });

        setErrors((prev) => ({
            ...prev,
            permissions: "",
        }));
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required.";
        }

        if (!formData.username.trim()) {
            newErrors.username = "Username is required.";
        } else if (
            !/^[a-zA-Z0-9_]{3,30}$/.test(formData.username.trim())
        ) {
            newErrors.username =
                "Username must be 3–30 characters and contain only letters, numbers or underscores.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
        ) {
            newErrors.email = "Enter a valid email address.";
        }

        if (!formData.role) {
            newErrors.role = "Please select a role.";
        }

        // Password is required only when creating a Sub Admin.
        // In edit mode, password is optional.
        if (!isEditMode && !formData.password) {
            newErrors.password = "Password is required.";
        } else if (
            formData.password &&
            formData.password.length < 8
        ) {
            newErrors.password =
                "Password must contain at least 8 characters.";
        }

        if (
            formData.password &&
            formData.password !== formData.confirmPassword
        ) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        if (formData.permissions.length === 0) {
            newErrors.permissions = "Select at least one permission.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Create or update Sub Admin
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setIsSubmitting(true);
            setSubmitError("");

            const payload = {
                name: formData.name.trim(),
                username: formData.username.trim().toLowerCase(),
                email: formData.email.trim().toLowerCase(),

                // Platform role remains subadmin.
                role: "subadmin",

                // Administrator designation.
                adminTitle: formData.role,

                status: formData.status,
                permissions: formData.permissions,
            };

            // Send password only when a new password is provided.
            if (formData.password) {
                payload.password = formData.password;
            }

            const endpoint = isEditMode
                ? `/admin/sub-admins/${subAdminId}`
                : "/admin/sub-admins";

            const data = await apiFetch(endpoint, {
                method: isEditMode ? "PUT" : "POST",
                body: payload,
            });

            navigate("/admin/sub-admins", {
                state: {
                    successMessage:
                        data.message ||
                        (isEditMode
                            ? "Sub Admin updated successfully."
                            : "Sub Admin created successfully."),
                },
            });
        } catch (error) {
            console.error(
                isEditMode
                    ? "Update Sub Admin Error:"
                    : "Create Sub Admin Error:",
                error
            );

            setSubmitError(
                error.message ||
                (isEditMode
                    ? "Failed to update Sub Admin."
                    : "Failed to create Sub Admin.")
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <LoaderCircle
                    className="animate-spin text-orange-600"
                    size={30}
                />

                <span className="ml-3 text-sm text-gray-500">
                    Loading Sub Admin details...
                </span>
            </div>
        );
    }

    return (
        <div className="space-y-7">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <button
                        onClick={() => navigate("/admin/sub-admins")}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 mb-3"
                    >
                        <ArrowLeft size={17} />
                        Back to Sub Admins
                    </button>

                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? "Edit Sub Admin" : "Create Sub Admin"}
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        {isEditMode
                            ? "Update administrator information and platform access."
                            : "Create an administrator account and configure platform access."}
                    </p>
                </div>
            </div>

            {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">
                        {submitError}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Basic Information */}
                <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                            <User size={20} />
                        </div>

                        <div>
                            <h2 className="font-semibold text-gray-900">
                                Basic Information
                            </h2>

                            <p className="text-xs text-gray-500 mt-1">
                                Enter the administrator's personal details.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>

                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            />

                            {errors.name && (
                                <p className="text-xs text-red-500 mt-2">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username *
                            </label>

                            <input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="e.g. john_smith"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            />

                            {errors.username && (
                                <p className="text-xs text-red-500 mt-2">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="admin@tandav.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                />
                            </div>

                            {errors.email && (
                                <p className="text-xs text-red-500 mt-2">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Designation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Administrator Role *
                            </label>

                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-orange-500 bg-white"
                            >
                                <option value="">Select role</option>
                                <option value="Content Manager">Content Manager</option>
                                <option value="User Manager">User Manager</option>
                                <option value="Finance Manager">Finance Manager</option>
                                <option value="Support Manager">Support Manager</option>
                                <option value="Custom Admin">Custom Admin</option>
                            </select>

                            {errors.role && (
                                <p className="text-xs text-red-500 mt-2">
                                    {errors.role}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-orange-500 bg-white"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                    </div>
                </section>

                {/* Password Information */}
                <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                            <Lock size={20} />
                        </div>

                        <div>
                            <h2 className="font-semibold text-gray-900">
                                Account Security
                            </h2>

                            <p className="text-xs text-gray-500 mt-1">
                                {isEditMode
                                    ? "Leave password fields blank to keep the current password."
                                    : "Configure login credentials."}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password {isEditMode ? "(Optional)" : "*"}
                            </label>

                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={
                                    isEditMode
                                        ? "Leave blank to keep current password"
                                        : "Minimum 8 characters"
                                }
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-orange-500"
                            />

                            {errors.password && (
                                <p className="text-xs text-red-500 mt-2">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password {isEditMode ? "(Optional)" : "*"}
                            </label>

                            <input
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter password"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-orange-500"
                            />

                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500 mt-2">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                    </div>

                    <p className="text-xs text-gray-400 mt-4">
                        Passwords are securely hashed by the backend before being stored.
                    </p>
                </section>

                {/* Permissions */}
                <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                <ShieldCheck size={20} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    Access Permissions
                                </h2>

                                <p className="text-xs text-gray-500 mt-1">
                                    Select what this administrator can access.
                                </p>
                            </div>
                        </div>

                        <span className="text-sm font-medium text-orange-600">
                            {formData.permissions.length} Selected
                        </span>

                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                        {permissionGroups.map((group) => {
                            const allSelected = group.permissions.every(
                                (permission) =>
                                    formData.permissions.includes(permission)
                            );

                            return (
                                <div
                                    key={group.title}
                                    className="border border-gray-200 rounded-xl p-4"
                                >

                                    <div className="flex items-center justify-between mb-4">

                                        <h3 className="font-semibold text-sm text-gray-900">
                                            {group.title}
                                        </h3>

                                        <label className="flex items-center gap-2 text-xs text-orange-600 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={allSelected}
                                                onChange={(e) =>
                                                    handleGroupChange(
                                                        group,
                                                        e.target.checked
                                                    )
                                                }
                                                className="accent-orange-600"
                                            />
                                            Select All
                                        </label>

                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                        {group.permissions.map((permission) => {
                                            const isSelected =
                                                formData.permissions.includes(permission);

                                            const hasDependentActions = Object.entries(
                                                permissionDependencies
                                            ).some(
                                                ([action, view]) =>
                                                    view === permission &&
                                                    formData.permissions.includes(action)
                                            );

                                            const isLocked =
                                                isSelected && hasDependentActions;

                                            return (
                                                <label
                                                    key={permission}
                                                    className={`flex items-center gap-2 text-sm ${
                                                        isLocked
                                                            ? "text-gray-400 cursor-not-allowed"
                                                            : "text-gray-600 cursor-pointer"
                                                    }`}
                                                    title={
                                                        isLocked
                                                            ? "Remove dependent action permissions before disabling this permission."
                                                            : ""
                                                    }
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        disabled={isLocked}
                                                        onChange={() =>
                                                            handlePermissionChange(permission)
                                                        }
                                                        className="accent-orange-600"
                                                    />

                                                    {permission}
                                                </label>
                                            );
                                        })}

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                    {errors.permissions && (
                        <p className="text-xs text-red-500 mt-4">
                            {errors.permissions}
                        </p>
                    )}

                </section>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">

                    <button
                        type="button"
                        onClick={() => navigate("/admin/sub-admins")}
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                        <X size={17} />
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <LoaderCircle size={17} className="animate-spin" />
                        ) : (
                            <Save size={17} />
                        )}

                        {isSubmitting
                            ? "Saving..."
                            : isEditMode
                                ? "Update Sub Admin"
                                : "Create Sub Admin"}
                    </button>

                </div>

            </form>
        </div>
    );
};

export default SubAdminForm;
