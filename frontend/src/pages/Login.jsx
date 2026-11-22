import { useEffect, useState } from "react";
import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    apiFetch,
    saveSession,
    API_ORIGIN,
} from "../utils/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();


    // Verify whether the user already has an active session
    useEffect(() => {
        let isActive = true;

        const checkSession = async () => {
            try {
                const data = await apiFetch("/auth/me");

                if (isActive) {
                    const role = data.user?.role;

                    const dashboard =
                        role === "superadmin" || role === "subadmin"
                            ? "/admin/dashboard"
                            : "/dashboard";

                    navigate(dashboard, { replace: true });
                }
            } catch (err) {
                if (isActive && err.status !== 401) {
                    setError(err.message || "Unable to verify session");
                }
            } finally {
                if (isActive) {
                    setCheckingSession(false);
                }
            }
        };

        checkSession();

        return () => {
            isActive = false;
        };
    }, [navigate]);


    if (checkingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-sm text-slate-500">
                    Checking your session...
                </p>
            </div>
        );
    }

    // Email and password login

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setBusy(true);

        try {
            const data = await apiFetch("/auth/login", {
                method: "POST",
                body: {
                    email,
                    password,
                },
                auth: false,
            });

            saveSession(data.user);

            const role = data.user?.role;

            const defaultDashboard =
                role === "superadmin" || role === "subadmin"
                    ? "/admin/dashboard"
                    : "/dashboard";

            const requestedPath = location.state?.from;

            const isAdmin =
                role === "superadmin" || role === "subadmin";

            const destination =
                requestedPath &&
                    (isAdmin
                        ? requestedPath.startsWith("/admin")
                        : !requestedPath.startsWith("/admin"))
                    ? requestedPath
                    : defaultDashboard;

            navigate(destination, { replace: true });

        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setBusy(false);
        }
    };


    // Google OAuth login
    const handleGoogleLogin = () => {
        window.location.href = `${API_ORIGIN}/api/auth/google`;
    };

    const highlights = [
        "No Coding Required",
        "Fully Customizable",
        "Secure & Reliable",
    ];

    const inputClass =
        "block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-600/10";

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white font-sans antialiased text-slate-800">

            {/* LEFT SIDE - BRAND PANEL */}

            <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between overflow-hidden bg-slate-900 px-10 xl:px-12 py-10 text-white">

                {/* Background Effects */}

                <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-orange-600/25 blur-3xl"></div>

                <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-orange-600/10 blur-3xl"></div>

                {/* Logo */}

                <Link
                    to="/"
                    className="relative flex items-center gap-2.5 no-underline"
                >
                    <img
                        src="/logo.png"
                        alt="Tandav Logo"
                        className="h-9 w-auto object-contain brightness-0 invert"
                    />

                    <span className="font-bold text-lg tracking-tight text-white">
                        Tandav
                    </span>
                </Link>

                {/* Brand Content */}

                <div className="relative">

                    <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 text-orange-700 px-4 py-1.5 text-xs font-semibold">
                        ⚡ Build Your Business Website in Minutes
                    </span>

                    <h1 className="mt-6 text-4xl xl:text-5xl font-extrabold leading-[1.1] tracking-tight">
                        Your Business.
                        <br />
                        Your Website.
                        <br />

                        <span className="text-orange-500">
                            Your Way.
                        </span>
                    </h1>

                    <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-300">
                        Login to your Tandav workspace to create,
                        customize and manage your professional website
                        without writing a single line of code.
                    </p>

                    {/* Highlights */}

                    <ul className="mt-8 space-y-4">

                        {highlights.map((item) => (
                            <li
                                key={item}
                                className="flex items-center gap-3 text-sm text-slate-200"
                            >
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-600/20 text-orange-500">

                                    <svg
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="h-3.5 w-3.5"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>

                                </span>

                                {item}
                            </li>
                        ))}

                    </ul>

                </div>

                {/* Footer */}

                <div className="relative text-xs text-slate-500">
                    © {new Date().getFullYear()} Tandav Inc. All rights reserved.
                </div>

            </div>

            {/* RIGHT SIDE - LOGIN FORM */}

            <div className="lg:col-span-7 flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 bg-gradient-to-b from-orange-50/50 to-white">

                <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-10">

                    {/* Mobile Logo */}

                    <Link
                        to="/"
                        className="mb-6 flex items-center gap-2.5 lg:hidden"
                    >
                        <img
                            src="/logo.png"
                            alt="Tandav Logo"
                            className="h-8 w-auto object-contain"
                        />

                        <span className="font-bold text-lg tracking-tight text-orange-600">
                            Tandav
                        </span>
                    </Link>

                    {/* Heading */}

                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Welcome back
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Login to your account to continue building your website.
                    </p>

                    {/* Error Message */}

                    {error && (
                        <div
                            role="alert"
                            className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                        >
                            {error}
                        </div>
                    )}

                    {/* Google OAuth */}

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="mt-6 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                    >

                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="#4285F4"
                                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                            />

                            <path
                                fill="#34A853"
                                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.17 21.32 7.24 24 12 24z"
                            />

                            <path
                                fill="#FBBC05"
                                d="M5.28 14.27c-.25-.72-.38-1.5-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.1 0 9.98 0 12s.43 3.9 1.19 5.42l4.09-3.15z"
                            />

                            <path
                                fill="#EA4335"
                                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.24 0 3.17 2.68 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                            />
                        </svg>

                        Continue with Google

                    </button>

                    {/* Divider */}

                    <div className="relative my-6">

                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>

                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-slate-400 font-medium">
                                Or continue with email
                            </span>
                        </div>

                    </div>

                    {/* Login Form */}

                    <form
                        onSubmit={handleLogin}
                        className="space-y-5"
                    >

                        {/* Email */}

                        <div>

                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-sm font-semibold text-slate-900"
                            >
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputClass}
                            />

                        </div>

                        {/* Password */}

                        <div>

                            <div className="mb-1.5 flex items-center justify-between">

                                <label
                                    htmlFor="password"
                                    className="text-sm font-semibold text-slate-900"
                                >
                                    Password
                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-orange-600 hover:text-orange-500 hover:underline"
                                >
                                    Forgot password?
                                </Link>

                            </div>

                            <div className="relative">

                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`${inputClass} pr-11`}
                                />

                                {/* Show / Hide Password */}

                                <button
                                    type="button"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                                >

                                    {showPassword ? (

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="h-5 w-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                            />
                                        </svg>

                                    ) : (

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="h-5 w-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                            />

                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>

                                    )}

                                </button>

                            </div>

                        </div>

                        {/* Login Button */}

                        <button
                            type="submit"
                            disabled={busy}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-600/30 transition hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-600/25 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {busy && (
                                <svg
                                    className="h-4 w-4 animate-spin"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        className="opacity-25"
                                    />

                                    <path
                                        fill="currentColor"
                                        className="opacity-75"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    />
                                </svg>
                            )}

                            {busy ? "Logging in..." : "Login"}

                        </button>

                    </form>

                    {/* Signup Link */}

                    <p className="mt-7 text-center text-sm text-slate-500">
                        Don't have an account?{" "}

                        <Link
                            to="/signup"
                            className="font-bold text-orange-600 hover:text-orange-500 hover:underline"
                        >
                            Get Started Free
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;
