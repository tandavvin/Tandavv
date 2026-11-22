// src/pages/Components/Navbar.jsx


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { apiFetch } from "../../utils/api";

export default function Navbar({ activeLink = "" }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Verify the logged-in user using the HTTP-only cookie.
    useEffect(() => {
        let isActive = true;

        const checkSession = async () => {
            try {
                const data = await apiFetch("/auth/me");

                if (isActive) {
                    setUser(data.user);
                }
            } catch (error) {
                if (isActive) {
                    setUser(null);
                }
            } finally {
                if (isActive) {
                    setCheckingAuth(false);
                }
            }
        };

        checkSession();

        return () => {
            isActive = false;
        };
    }, []);

    // Determine dashboard according to the user's role.
    const isAdmin =
        user?.role === "superadmin" ||
        user?.role === "subadmin";

    const dashboardPath = isAdmin
        ? "/admin/dashboard"
        : "/dashboard";

    const dashboardLabel = isAdmin
        ? "Admin Dashboard"
        : "My Dashboard";

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

                {/* Logo */}
                <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2.5 no-underline"
                >
                    <img
                        src="/logo.png"
                        alt="Tandav Logo"
                        className="h-9 w-auto object-contain"
                    />

                    <span className="font-bold text-lg tracking-tight text-[#E6B13D]">
                        Tandav
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
                    <Link
                        to="/"
                        className={`transition hover:text-orange-600 ${
                            activeLink === "home"
                                ? "font-semibold text-orange-600"
                                : ""
                        }`}
                    >
                        Home
                    </Link>

                    <Link
                        to="/templates"
                        className={`transition hover:text-orange-600 ${
                            activeLink === "templates"
                                ? "font-semibold text-orange-600"
                                : ""
                        }`}
                    >
                        Templates
                    </Link>

                    <Link
                        to="/pricing"
                        className={`transition hover:text-orange-600 ${
                            activeLink === "pricing"
                                ? "font-semibold text-orange-600"
                                : ""
                        }`}
                    >
                        Pricing
                    </Link>

                    <Link
                        to="/about"
                        className={`transition hover:text-orange-600 ${
                            activeLink === "about"
                                ? "font-semibold text-orange-600"
                                : ""
                        }`}
                    >
                        About
                    </Link>
                </nav>

                {/* Desktop Authentication Actions */}
                <div className="hidden items-center gap-4 md:flex">

                    {!checkingAuth && (
                        user ? (
                            <Link
                                to={dashboardPath}
                                className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-orange-700"
                            >
                                {dashboardLabel}
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-semibold text-slate-700 hover:text-orange-600"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/signup"
                                    className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-orange-700"
                                >
                                    Get Started Free
                                </Link>
                            </>
                        )
                    )}

                </div>

                {/* Mobile Menu Toggle */}
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-gray-100 md:hidden"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen
                        ? <X size={21} />
                        : <Menu size={21} />
                    }
                </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="border-t border-gray-100 bg-white px-5 py-4 shadow-lg md:hidden">
                    <div className="flex flex-col gap-4">

                        <Link
                            to="/"
                            onClick={closeMobileMenu}
                        >
                            Home
                        </Link>

                        <Link
                            to="/templates"
                            onClick={closeMobileMenu}
                        >
                            Templates
                        </Link>

                        <Link
                            to="/pricing"
                            onClick={closeMobileMenu}
                        >
                            Pricing
                        </Link>

                        <Link
                            to="/about"
                            onClick={closeMobileMenu}
                        >
                            About
                        </Link>

                        {!checkingAuth && (
                            <div className="flex gap-3 border-t border-gray-100 pt-4">

                                {user ? (
                                    <Link
                                        to={dashboardPath}
                                        onClick={closeMobileMenu}
                                        className="w-full rounded-lg bg-orange-600 py-2.5 text-center text-sm font-bold text-white"
                                    >
                                        {dashboardLabel}
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={closeMobileMenu}
                                            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-center text-sm font-semibold"
                                        >
                                            Login
                                        </Link>

                                        <Link
                                            to="/signup"
                                            onClick={closeMobileMenu}
                                            className="flex-1 rounded-lg bg-orange-600 py-2.5 text-center text-sm font-bold text-white"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}

                            </div>
                        )}

                    </div>
                </div>
            )}
        </header>
    );
}
