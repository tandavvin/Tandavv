// /src/admin/components/AdminHeader.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Search,
    Bell,
    ChevronDown,
    User,
    Settings,
    LogOut,
    ShieldCheck,
    PanelLeft,
} from "lucide-react";

import {
    apiFetch,
    clearSession,
    getStoredUser,
} from "../../utils/api";

const AdminHeader = ({ onToggleSidebar }) => {
    const navigate = useNavigate();

    const [showProfile, setShowProfile] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState("");

    // Get logged-in user
    const currentUser = getStoredUser();

    const isSuperAdmin = currentUser?.role === "superadmin";

    const fullName = currentUser?.name || currentUser?.username || "Admin";

    const email = currentUser?.email || "";

    const roleLabel = isSuperAdmin
        ? "Super Admin"
        : currentUser?.adminTitle || "Sub Admin";

    // Generate initials dynamically
    const initials = fullName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");

    // Logout
    const handleLogout = async () => {
        if (loggingOut) return;

        setLoggingOut(true);
        setLogoutError("");

        try {
            await apiFetch("/auth/logout", {
                method: "POST",
            });

            clearSession();

            navigate("/login", { replace: true });

        } catch (error) {
            setLogoutError(
                error.message || "Unable to logout. Please try again."
            );
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <header className="sticky top-0 z-30 h-20 min-h-20 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

            {/* Left Section */}
            <div className="flex items-center gap-4 flex-1 min-w-0">

                {/* Sidebar Toggle */}
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition shrink-0"
                    aria-label="Toggle sidebar"
                >
                    <PanelLeft size={21} />
                </button>

                {/* Search */}
                <div className="relative w-full max-w-96">

                    <Search
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />

                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-5 shrink-0">

                {/* Notifications */}
                <button
                    className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 transition"
                    aria-label="Notifications"
                >
                    <Bell size={21} />

                    <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full border-2 border-white" />
                </button>

                <div className="hidden sm:block h-9 w-px bg-gray-200" />

                {/* Profile */}
                <div className="relative">

                    <button
                        onClick={() => {
                            setShowProfile((prev) => !prev);
                            setLogoutError("");
                        }}
                        className="flex items-center gap-2 sm:gap-3 hover:bg-gray-50 p-2 rounded-xl transition"
                    >
                        {/* Profile Initials */}
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold shrink-0">
                            {initials}
                        </div>

                        <div className="hidden sm:block text-left max-w-40">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {fullName}
                            </p>

                            <p className="text-xs text-gray-400 truncate">
                                {roleLabel}
                            </p>
                        </div>

                        <ChevronDown
                            size={17}
                            className={`text-gray-400 hidden sm:block transition-transform ${
                                showProfile ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {/* Profile Dropdown */}
                    {showProfile && (
                        <div className="absolute right-0 top-14 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50">

                            {/* User Information */}
                            <div className="px-3 py-3 border-b border-gray-100 mb-2">

                                <div className="flex items-center gap-3 mb-2">

                                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold shrink-0">
                                        {initials}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {fullName}
                                        </p>

                                        <p className="text-xs text-orange-600 font-medium">
                                            {roleLabel}
                                        </p>
                                    </div>

                                </div>

                                <p className="text-xs text-gray-400 truncate">
                                    {email}
                                </p>

                            </div>

                            {/* Profile Options */}
                            <button
                                onClick={() => setShowProfile(false)}
                                className="flex items-center gap-3 w-full p-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                            >
                                <User size={17} />
                                My Profile
                            </button>

                            <button
                                onClick={() => setShowProfile(false)}
                                className="flex items-center gap-3 w-full p-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                            >
                                <ShieldCheck size={17} />
                                Security
                            </button>

                            {isSuperAdmin && (
                                <button
                                    onClick={() => {
                                        setShowProfile(false);
                                        navigate("/admin/settings");
                                    }}
                                    className="flex items-center gap-3 w-full p-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                                >
                                    <Settings size={17} />
                                    Settings
                                </button>
                            )}

                            {/* Logout */}
                            <div className="border-t border-gray-100 mt-2 pt-2">

                                {logoutError && (
                                    <p className="px-2 py-1 text-xs text-red-500">
                                        {logoutError}
                                    </p>
                                )}

                                <button
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="flex items-center gap-3 w-full p-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                >
                                    <LogOut size={17} />

                                    {loggingOut
                                        ? "Logging out..."
                                        : "Logout"}
                                </button>

                            </div>

                        </div>
                    )}

                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
