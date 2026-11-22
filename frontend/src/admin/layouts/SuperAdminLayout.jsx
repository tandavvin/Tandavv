// /admin/layouts/SuperAdminLayout.jsx

import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

const SuperAdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close mobile sidebar when navigating or resizing to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 z-50 h-screen w-64 transition-transform duration-300 ${sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }`}
            >
                <AdminSidebar
                    onClose={() => setSidebarOpen(false)}
                    onNavigate={() => {
                        if (window.innerWidth < 1024) {
                            setSidebarOpen(false);
                        }
                    }}
                />
            </div>

            {/* Main Content */}
            <div
                className={`min-h-screen flex flex-col transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "ml-0"
                    }`}
            >
                <AdminHeader
                    onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                />

                <main className="flex-1 p-5 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>

        </div>
    );
};

export default SuperAdminLayout;
