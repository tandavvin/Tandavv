
// admin/components/AdminSidebar.jsx

import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    Store,
    PanelsTopLeft,
    Package,
    CreditCard,
    Receipt,
    Settings,
    Activity,
    LogOut,
    Ticket,
    Bell,
    Database,
    LifeBuoy,
    BarChart3,
    X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch, clearSession, getStoredUser } from "../../utils/api";

const AdminSidebar = ({ onNavigate, onClose }) => {
    const navigate = useNavigate();

    const [loggingOut, setLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState("");

    // Get the currently logged-in user.
    const currentUser = getStoredUser();

    const isSuperAdmin = currentUser?.role === "superadmin";
    const permissions = currentUser?.permissions || [];

    // Check whether the user has a particular permission.
    const hasPermission = (permission) => {
        return isSuperAdmin || permissions.includes(permission);
    };

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

    const menuGroups = [
        {
            title: "OVERVIEW",
            items: [
                {
                    name: "Dashboard",
                    icon: LayoutDashboard,
                    path: "/admin/dashboard",
                    visible: true,
                },
                {
                    name: "Analytics",
                    icon: BarChart3,
                    path: "/admin/analytics",
                    visible: hasPermission("View Activity Logs"),
                },
            ],
        },
        {
            title: "ADMIN MANAGEMENT",
            items: [
                {
                    name: "Sub Admins",
                    icon: ShieldCheck,
                    path: "/admin/sub-admins",
                    visible: isSuperAdmin,
                },
                {
                    name: "Permissions",
                    icon: Users,
                    path: "/admin/permissions",
                    visible: isSuperAdmin,
                },
            ],
        },
        {
            title: "PLATFORM MANAGEMENT",
            items: [
                {
                    name: "Users",
                    icon: Users,
                    path: "/admin/users",
                    visible: hasPermission("View Users"),
                },
                {
                    name: "Stores",
                    icon: Store,
                    path: "/admin/stores",
                    visible: hasPermission("View Stores"),
                },
                {
                    name: "Templates",
                    icon: PanelsTopLeft,
                    path: "/admin/templates",
                    visible: hasPermission("View Templates"),
                },
                {
                    name: "Products",
                    icon: Package,
                    path: "/admin/products",
                    visible: hasPermission("View Products"),
                },
                {
                    name: "Subscriptions",
                    icon: CreditCard,
                    path: "/admin/subscriptions",
                    visible: hasPermission("View Subscriptions"),
                },
                {
                    name: "Payments",
                    icon: Receipt,
                    path: "/admin/payments",
                    visible: hasPermission("View Payments"),
                },
            ],
        },
        {
            title: "SYSTEM MANAGEMENT",
            items: [
                {
                    name: "Activity Logs",
                    icon: Activity,
                    path: "/admin/activity-logs",
                    visible: hasPermission("View Activity Logs"),
                },
                {
                    name: "Database Overview",
                    icon: Database,
                    path: "/admin/database-overview",
                    visible: isSuperAdmin,
                },
                {
                    name: "Support",
                    icon: LifeBuoy,
                    path: "/admin/support",
                    visible: hasPermission("View Support"),
                },
                {
                    name: "Coupons",
                    icon: Ticket,
                    path: "/admin/coupons",
                    visible: hasPermission("View Coupons"),
                },
                {
                    name: "Notifications",
                    icon: Bell,
                    path: "/admin/notifications",
                    visible: hasPermission("View Notifications"),
                },
                {
                    name: "Settings",
                    icon: Settings,
                    path: "/admin/settings",
                    visible: isSuperAdmin,
                },
            ],
        },
    ];

    // Remove menu items the current user cannot access.
    const visibleMenuGroups = menuGroups
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => item.visible),
        }))
        .filter((group) => group.items.length > 0);

    return (
        <aside className="w-full h-full bg-white border-r border-gray-200 flex flex-col">

            {/* Logo */}
            <div className="h-20 min-h-20 px-6 flex items-center justify-between border-b border-gray-100">

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                        <img
                            src="/logo.png"
                            alt="Tandav"
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            TANDAV
                        </h1>

                        <p className="text-xs text-orange-600 font-semibold">
                            {isSuperAdmin ? "SUPER ADMIN" : "SUB ADMIN"}
                        </p>
                    </div>
                </div>

                {/* Close Sidebar - Mobile */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
                    aria-label="Close sidebar"
                >
                    <X size={21} />
                </button>

            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-6 overflow-y-auto">

                {visibleMenuGroups.map((group) => (
                    <div key={group.title}>

                        <p className="text-[11px] font-bold text-gray-400 mb-3 px-3">
                            {group.title}
                        </p>

                        <div className="space-y-1">

                            {group.items.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.name}
                                        to={item.path}
                                        onClick={onNavigate}
                                        className={({ isActive }) =>
                                            `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                                                isActive
                                                    ? "bg-orange-50 text-orange-600"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            }`
                                        }
                                    >
                                        <Icon size={19} />
                                        {item.name}
                                    </NavLink>
                                );
                            })}

                        </div>
                    </div>
                ))}

            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-100">

                {logoutError && (
                    <p className="mb-2 px-2 text-xs text-red-500">
                        {logoutError}
                    </p>
                )}

                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-3 text-sm text-red-500 hover:bg-red-50 w-full p-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <LogOut size={19} />

                    {loggingOut ? "Logging out..." : "Logout"}
                </button>

            </div>

        </aside>
    );
};

export default AdminSidebar;
