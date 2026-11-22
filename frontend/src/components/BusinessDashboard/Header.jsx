
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    Bell,
    Menu,
    Search,
    ChevronDown,
    CheckCheck,
    Check,
    X,
    Loader2,
    AlertTriangle,
    CheckCircle2,
    UserRound,
    Settings,
    LockKeyhole,
    LogOut,
} from "lucide-react";

import { apiFetch, clearSession } from "../../utils/api";

export default function Header({ onMenu }) {
    const navigate = useNavigate();

    // User profile
    const [user, setUser] = useState({});
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [logoutError, setLogoutError] = useState("");
    const profileRef = useRef(null);

    // Notifications
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const dropdownRef = useRef(null);

    // Store status
    const [storeStatus, setStoreStatus] = useState({
        stores: [],
        loading: true,
        error: false,
    });

    const suspendedStores = storeStatus.stores.filter(
        (store) => store.status === "suspended"
    );

    const suspendedCount = suspendedStores.length;
    const totalStores = storeStatus.stores.length;

    // Load cached user information.
    useEffect(() => {
        try {
            setUser(JSON.parse(localStorage.getItem("user") || "{}"));
        } catch {
            setUser({});
        }
    }, []);

    const name = user.name || "Business Owner";
    const email = user.email || "";

    const initials = name
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const role =
        user.role === "superadmin"
            ? "Super Admin"
            : user.role === "subadmin"
                ? "Sub Admin"
                : "Business Owner";

    // Fetch notifications and unread count.
    const fetchNotifications = async (showLoading = false) => {
        if (showLoading) setLoading(true);

        try {
            const [notificationRes, countRes] = await Promise.all([
                apiFetch("/notifications"),
                apiFetch("/notifications/unread-count"),
            ]);

            setNotifications(notificationRes.data || []);
            setUnreadCount(countRes.unreadCount || 0);
            setError("");
        } catch (err) {
            console.error("Notification fetch error:", err);
            setError("Unable to load notifications.");
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    // Fetch store status and refresh every 30 seconds.
    useEffect(() => {
        let isMounted = true;

        const fetchStoreStatus = async () => {
            try {
                const response = await apiFetch("/config/all");

                const storeList = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.stores)
                        ? response.stores
                        : Array.isArray(response.data?.stores)
                            ? response.data.stores
                            : [];

                if (isMounted) {
                    setStoreStatus({
                        stores: storeList,
                        loading: false,
                        error: false,
                    });
                }
            } catch (err) {
                console.error("Store status fetch error:", err);

                if (isMounted) {
                    setStoreStatus({
                        stores: [],
                        loading: false,
                        error: true,
                    });
                }
            }
        };

        fetchStoreStatus();

        const interval = setInterval(fetchStoreStatus, 30000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    // Initial notification fetch and automatic refresh.
    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // Close notification dropdown when clicking outside.
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Close profile dropdown when clicking outside.
    useEffect(() => {
        const handleProfileClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleProfileClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleProfileClickOutside
            );
        };
    }, []);

    // Toggle notifications.
    const toggleNotifications = () => {
        const nextState = !isOpen;

        setIsOpen(nextState);

        if (nextState) {
            setIsProfileOpen(false);
            fetchNotifications(true);
        }
    };

    // Mark an individual notification as read.
    const markAsRead = async (notificationId) => {
        try {
            await apiFetch(
                `/notifications/${notificationId}/read`,
                { method: "PATCH" }
            );

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification._id === notificationId
                        ? {
                            ...notification,
                            readAt: new Date().toISOString(),
                        }
                        : notification
                )
            );

            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Mark notification as read error:", err);
            setError("Unable to update notification.");
        }
    };

    // Mark all notifications as read.
    const markAllAsRead = async () => {
        try {
            await apiFetch("/notifications/read-all", {
                method: "PATCH",
            });

            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    readAt:
                        notification.readAt || new Date().toISOString(),
                }))
            );

            setUnreadCount(0);
        } catch (err) {
            console.error("Mark all as read error:", err);
            setError("Unable to update notifications.");
        }
    };

    // Format notification date.
    const formatDate = (date) => {
        if (!date) return "";

        const notificationDate = new Date(date);

        if (Number.isNaN(notificationDate.getTime())) return "";

        return notificationDate.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    // Logout user.
    const handleLogout = async () => {
        try {
            setLogoutLoading(true);
            setLogoutError("");

            await apiFetch("/auth/logout", {
                method: "POST",
            });

            clearSession();
            setUser({});
            setIsProfileOpen(false);

            navigate("/login", { replace: true });
        } catch (err) {
            console.error("Logout error:", err);

            setLogoutError(
                err.message || "Unable to logout. Please try again."
            );
        } finally {
            setLogoutLoading(false);
        }
    };

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">

            {/* Left Section */}
            <div className="flex items-center gap-3">

                <button
                    onClick={onMenu}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
                    aria-label="Open sidebar"
                >
                    <Menu size={22} />
                </button>

                <div>
                    <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
                        Business Dashboard
                    </h1>

                    <p className="hidden text-xs text-gray-500 sm:block">
                        Manage your business in one place.
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-4">

                {/* Search */}
                <label className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 md:flex">
                    <Search size={17} className="text-gray-400" />

                    <input
                        placeholder="Search..."
                        className="w-36 bg-transparent text-sm outline-none lg:w-48"
                    />
                </label>

                {/* Store Status Indicator */}
                <div
                    title={
                        storeStatus.error
                            ? "Unable to retrieve store status"
                            : `${suspendedCount} suspended out of ${totalStores} stores`
                    }
                    className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2 sm:px-3 ${
                        storeStatus.loading ||
                        storeStatus.error ||
                        totalStores === 0
                            ? "border-gray-200 bg-gray-50 text-gray-500"
                            : suspendedCount > 0
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-green-200 bg-green-50 text-green-700"
                    }`}
                >
                    {storeStatus.loading ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : storeStatus.error ? (
                        <AlertTriangle size={16} />
                    ) : suspendedCount > 0 ? (
                        <AlertTriangle size={16} />
                    ) : (
                        <CheckCircle2 size={16} />
                    )}

                    <span className="hidden text-xs font-semibold sm:inline">
                        {storeStatus.loading
                            ? "Checking status..."
                            : storeStatus.error
                                ? "Status unavailable"
                                : totalStores === 0
                                    ? "No stores"
                                    : suspendedCount > 0
                                        ? `${suspendedCount} ${
                                            suspendedCount === 1
                                                ? "store"
                                                : "stores"
                                        } suspended`
                                        : "All stores active"}
                    </span>

                    <span className="text-xs font-semibold sm:hidden">
                        {storeStatus.loading
                            ? "..."
                            : storeStatus.error
                                ? "Unavailable"
                                : suspendedCount > 0
                                    ? `${suspendedCount} suspended`
                                    : totalStores === 0
                                        ? "No stores"
                                        : "Active"}
                    </span>
                </div>

                {/* Notification Bell */}
                <div className="relative" ref={dropdownRef}>

                    <button
                        onClick={toggleNotifications}
                        aria-label={`Notifications${
                            unreadCount
                                ? `, ${unreadCount} unread`
                                : ""
                        }`}
                        aria-expanded={isOpen}
                        className="relative rounded-xl border border-gray-200 p-2.5 text-gray-600 hover:bg-orange-50 hover:text-[#FF7200]"
                    >
                        <Bell size={19} />

                        {unreadCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF7200] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {isOpen && (
                        <div className="absolute right-0 top-14 z-50 w-[340px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl sm:w-[390px]">

                            {/* Dropdown Header */}
                            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Notifications
                                    </h3>

                                    <p className="text-xs text-gray-500">
                                        {unreadCount} unread notifications
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            title="Mark all as read"
                                            className="rounded-lg p-2 text-gray-500 hover:bg-orange-50 hover:text-[#FF7200]"
                                        >
                                            <CheckCheck size={18} />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                                        aria-label="Close notifications"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Notification Content */}
                            <div className="max-h-[400px] overflow-y-auto">

                                {loading ? (
                                    <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
                                        <Loader2 size={18} className="animate-spin" />
                                        Loading notifications...
                                    </div>
                                ) : error ? (
                                    <div className="px-5 py-10 text-center">
                                        <p className="text-sm text-red-500">
                                            {error}
                                        </p>

                                        <button
                                            onClick={() => fetchNotifications(true)}
                                            className="mt-3 text-sm font-medium text-[#FF7200] hover:underline"
                                        >
                                            Try again
                                        </button>
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="px-5 py-12 text-center">
                                        <Bell
                                            size={30}
                                            className="mx-auto mb-3 text-gray-300"
                                        />

                                        <p className="text-sm font-medium text-gray-700">
                                            No notifications yet
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            We'll notify you when something important happens.
                                        </p>
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification._id}
                                            className={`border-b border-gray-100 px-4 py-4 transition hover:bg-gray-50 ${
                                                !notification.readAt
                                                    ? "bg-orange-50/40"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">

                                                <div
                                                    className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                                        notification.type === "store_suspended"
                                                            ? "bg-red-50 text-red-500"
                                                            : "bg-green-50 text-green-600"
                                                    }`}
                                                >
                                                    <Bell size={17} />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {notification.title}
                                                        </p>

                                                        {!notification.readAt && (
                                                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#FF7200]" />
                                                        )}
                                                    </div>

                                                    <p className="mt-1 text-xs leading-5 text-gray-600">
                                                        {notification.message}
                                                    </p>

                                                    <p className="mt-2 text-[11px] text-gray-400">
                                                        {formatDate(notification.createdAt)}
                                                    </p>

                                                    {!notification.readAt && (
                                                        <button
                                                            onClick={() =>
                                                                markAsRead(notification._id)
                                                            }
                                                            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#FF7200] hover:underline"
                                                        >
                                                            <Check size={13} />
                                                            Mark as read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Profile Dropdown */}
                <div
                    className="relative border-l border-gray-200 pl-3 sm:pl-4"
                    ref={profileRef}
                >
                    <button
                        onClick={() => {
                            setIsProfileOpen((prev) => !prev);
                            setIsOpen(false);
                            setLogoutError("");
                        }}
                        aria-label="Open user profile menu"
                        aria-expanded={isProfileOpen}
                        className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-gray-50 sm:gap-3"
                    >
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-orange-100 font-bold text-[#FF7200]">
                            {initials || "U"}
                        </div>

                        <div className="hidden text-left sm:block">
                            <p className="max-w-32 truncate text-sm font-semibold text-gray-900">
                                {name}
                            </p>

                            <p className="text-xs text-gray-500">
                                {role}
                            </p>
                        </div>

                        <ChevronDown
                            size={15}
                            className={`hidden text-gray-400 transition-transform sm:block ${
                                isProfileOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {/* Profile Menu */}
                    {isProfileOpen && (
                        <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">

                            {/* Profile Information */}
                            <div className="border-b border-gray-100 px-4 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-orange-100 font-bold text-[#FF7200]">
                                        {initials || "U"}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-gray-900">
                                            {name}
                                        </p>

                                        <p className="truncate text-xs text-gray-500">
                                            {email || "No email available"}
                                        </p>

                                        <p className="mt-1 text-xs font-medium text-[#FF7200]">
                                            {role}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Links */}
                            <div className="p-2">
                                <Link
                                    to="/dashboard/settings/profile"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-[#FF7200]"
                                >
                                    <UserRound size={17} />
                                    My Profile
                                </Link>

                                <Link
                                    to="/dashboard/settings/general"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-[#FF7200]"
                                >
                                    <Settings size={17} />
                                    Account Settings
                                </Link>

                                <Link
                                    to="/dashboard/settings/security"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-[#FF7200]"
                                >
                                    <LockKeyhole size={17} />
                                    Change Password
                                </Link>
                            </div>

                            {/* Logout */}
                            <div className="border-t border-gray-100 p-2">
                                {logoutError && (
                                    <p className="px-3 py-2 text-xs text-red-500">
                                        {logoutError}
                                    </p>
                                )}

                                <button
                                    onClick={handleLogout}
                                    disabled={logoutLoading}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {logoutLoading ? (
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <LogOut size={17} />
                                    )}

                                    {logoutLoading
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
}
