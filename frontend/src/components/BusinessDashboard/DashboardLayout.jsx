
import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { apiFetch, clearSession } from "../../utils/api";

export default function DashboardLayout({ children }) {
    const [open, setOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const navigate = useNavigate();

    const logout = async () => {
        if (loggingOut) return;

        setLoggingOut(true);

        try {
            await apiFetch("/auth/logout", {
                method: "POST",
                auth: false,
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            clearSession();
            navigate("/login", { replace: true });
            setLoggingOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#171717]">
            <Sidebar
                open={open}
                onClose={() => setOpen(false)}
                onLogout={logout}
            />

            <div className="min-h-screen lg:pl-64">
                <Header onMenu={() => setOpen(true)} />

                <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
}
