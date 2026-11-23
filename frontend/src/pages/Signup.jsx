
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    apiFetch,
    saveSession,
} from "../utils/api";

function Signup() {
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [busy, setBusy] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const [resendCountdown, setResendCountdown] = useState(0);

    const navigate = useNavigate();

    // Check existing authentication
    useEffect(() => {
        let isMounted = true;

        const checkSession = async () => {
            try {
                const data = await apiFetch("/auth/me");

                if (isMounted) {
                    const user = data.user || data;

                    navigate(
                        user.role === "superadmin"
                            ? "/admin/dashboard"
                            : "/dashboard",
                        { replace: true }
                    );
                }
            } catch {
                // User is not logged in.
            } finally {
                if (isMounted) {
                    setCheckingSession(false);
                }
            }
        };

        checkSession();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    // OTP resend countdown
    useEffect(() => {
        if (!otpSent || resendCountdown <= 0) return;

        const timer = setTimeout(() => {
            setResendCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [otpSent, resendCountdown]);

    // Update form fields
    const update = (key) => (e) => {
        setForm((prev) => ({
            ...prev,
            [key]: e.target.value,
        }));
    };

    // Send signup OTP
    const handleSignup = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setBusy(true);

        try {
            const data = await apiFetch("/auth/signup/send-otp", {
                method: "POST",
                body: form,
                auth: false,
            });

            setOtpSent(true);
            setOtp("");
            setResendCountdown(60);

            setSuccess(
                data.message || "Verification code sent to your email."
            );

        } catch (err) {
            setError(err.message || "Unable to send verification code.");
        } finally {
            setBusy(false);
        }
    };

    // Verify signup OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!/^\d{6}$/.test(otp)) {
            setError("Please enter a valid 6-digit verification code.");
            return;
        }

        setBusy(true);

        try {
            const data = await apiFetch("/auth/signup/verify-otp", {
                method: "POST",
                body: {
                    ...form,
                    otp,
                },
                auth: false,
            });

            saveSession(data.user);

            navigate(
                data.user.role === "superadmin"
                    ? "/admin/dashboard"
                    : "/dashboard",
                { replace: true }
            );

        } catch (err) {
            setError(err.message || "OTP verification failed.");
        } finally {
            setBusy(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        if (resendCountdown > 0 || busy) return;

        setError("");
        setSuccess("");
        setBusy(true);

        try {
            const data = await apiFetch("/auth/signup/send-otp", {
                method: "POST",
                body: form,
                auth: false,
            });

            setOtp("");
            setResendCountdown(60);

            setSuccess(
                data.message || "A new verification code has been sent."
            );

        } catch (err) {
            setError(err.message || "Unable to resend verification code.");
        } finally {
            setBusy(false);
        }
    };

    // Return to signup form
    const handleEditDetails = () => {
        setOtpSent(false);
        setOtp("");
        setError("");
        setSuccess("");
    };

    const highlights = [
        "No Coding Required",
        "Fully Customizable",
        "Secure & Reliable",
    ];

    const inputClass =
        "block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-600/10";

    if (checkingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">
                    Checking authentication...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white font-sans antialiased text-slate-800">

            {/* LEFT SIDE - BRAND PANEL */}

            <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between overflow-hidden bg-slate-900 px-10 xl:px-12 py-10 text-white">

                <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-orange-600/25 blur-3xl"></div>

                <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-orange-600/10 blur-3xl"></div>

                <Link
                    to="/"
                    className="relative flex items-center gap-2.5 no-underline"
                >
                    <img
                        src="/logo.png"
                        alt="tandavv Logo"
                        className="h-9 w-auto object-contain brightness-0 invert"
                    />

                    <span className="font-bold text-lg tracking-tight text-white">
                        tandavv
                    </span>
                </Link>

                <div className="relative">

                    <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 text-orange-700 px-4 py-1.5 text-xs font-semibold">
                        ⚡ Start Building Your Online Presence
                    </span>

                    <h1 className="mt-6 text-4xl xl:text-5xl font-extrabold leading-[1.1] tracking-tight">
                        Turn Your Ideas.
                        <br />
                        Into Websites.
                        <br />

                        <span className="text-orange-500">
                            Grow Your Business.
                        </span>
                    </h1>

                    <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-300">
                        Create your tandavv account and start building
                        your professional business website. Choose
                        beautiful templates, customize everything
                        and grow your business online.
                    </p>

                    <ul className="mt-8 space-y-4">
                        {highlights.map((item) => (
                            <li
                                key={item}
                                className="flex items-center gap-3 text-sm text-slate-200"
                            >
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-600/20 text-orange-500">
                                    ✓
                                </span>

                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative text-xs text-slate-500">
                    © {new Date().getFullYear()} tandavv Inc. All rights reserved.
                </div>
            </div>

            {/* RIGHT SIDE */}

            <div className="lg:col-span-7 flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 bg-gradient-to-b from-orange-50/50 to-white">

                <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-9">

                    {/* Mobile Logo */}

                    <Link
                        to="/"
                        className="mb-6 flex items-center gap-2.5 lg:hidden"
                    >
                        <img
                            src="/logo.png"
                            alt="tandavv Logo"
                            className="h-8 w-auto object-contain"
                        />

                        <span className="font-bold text-lg tracking-tight text-orange-600">
                            tandavv
                        </span>
                    </Link>

                    {/* Heading */}

                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        {otpSent
                            ? "Verify your email"
                            : "Create your account"}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        {otpSent
                            ? `We sent a 6-digit verification code to ${form.email}.`
                            : "Join tandavv and start building your website today."}
                    </p>

                    {/* Error Message */}

                    {error && (
                        <div
                            role="alert"
                            className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                        >
                            {error}
                        </div>
                    )}

                    {/* Success Message */}

                    {success && (
                        <div
                            role="status"
                            className="mt-5 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
                        >
                            {success}
                        </div>
                    )}

                    {/* STEP 1: SIGNUP FORM */}

                    {!otpSent ? (

                        <form
                            onSubmit={handleSignup}
                            className="mt-7 space-y-4"
                        >

                            {/* Full Name */}

                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-1.5 block text-sm font-semibold text-slate-900"
                                >
                                    Full Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    required
                                    autoComplete="name"
                                    placeholder="Enter your full name"
                                    value={form.name}
                                    onChange={update("name")}
                                    className={inputClass}
                                />
                            </div>

                            {/* Username */}

                            <div>
                                <label
                                    htmlFor="username"
                                    className="mb-1.5 block text-sm font-semibold text-slate-900"
                                >
                                    Username
                                </label>

                                <input
                                    id="username"
                                    type="text"
                                    required
                                    autoComplete="username"
                                    minLength={3}
                                    maxLength={30}
                                    pattern="[A-Za-z0-9_]+"
                                    placeholder="Choose a username"
                                    value={form.username}
                                    onChange={update("username")}
                                    className={inputClass}
                                />

                                <p className="mt-1.5 text-xs text-slate-400">
                                    3-30 characters: letters, numbers and underscores.
                                </p>
                            </div>

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
                                    value={form.email}
                                    onChange={update("email")}
                                    className={inputClass}
                                />
                            </div>

                            {/* Password */}

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-1.5 block text-sm font-semibold text-slate-900"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                        placeholder="Create a password"
                                        value={form.password}
                                        onChange={update("password")}
                                        className={`${inputClass} pr-12`}
                                    />

                                    <button
                                        type="button"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3.5 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>

                                <p className="mt-1.5 text-xs text-slate-400">
                                    Password must contain at least 6 characters.
                                </p>
                            </div>

                            {/* Send OTP Button */}

                            <button
                                type="submit"
                                disabled={busy}
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-600/30 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {busy
                                    ? "Sending verification code..."
                                    : "Continue"}
                            </button>

                        </form>

                    ) : (

                        /* STEP 2: OTP VERIFICATION */

                        <form
                            onSubmit={handleVerifyOTP}
                            className="mt-7 space-y-5"
                        >

                            <div>
                                <label
                                    htmlFor="otp"
                                    className="mb-2 block text-sm font-semibold text-slate-900"
                                >
                                    Enter Verification Code
                                </label>

                                <input
                                    id="otp"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    maxLength={6}
                                    pattern="[0-9]{6}"
                                    required
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) =>
                                        setOtp(
                                            e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 6)
                                        )
                                    }
                                    className={`${inputClass} text-center text-2xl font-bold tracking-[0.5em]`}
                                />

                                <p className="mt-2 text-xs text-slate-400">
                                    Enter the 6-digit code sent to your email address.
                                </p>
                            </div>

                            {/* Verify Button */}

                            <button
                                type="submit"
                                disabled={busy || otp.length !== 6}
                                className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-orange-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-600/30 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {busy
                                    ? "Verifying..."
                                    : "Verify Email & Create Account"}
                            </button>

                            {/* Resend OTP */}

                            <div className="text-center text-sm text-slate-500">
                                Didn't receive the code?

                                <button
                                    type="button"
                                    disabled={busy || resendCountdown > 0}
                                    onClick={handleResendOTP}
                                    className="ml-1 font-bold text-orange-600 hover:text-orange-700 disabled:cursor-not-allowed disabled:text-slate-400"
                                >
                                    {resendCountdown > 0
                                        ? `Resend in ${resendCountdown}s`
                                        : "Resend OTP"}
                                </button>
                            </div>

                            {/* Edit Details */}

                            <button
                                type="button"
                                disabled={busy}
                                onClick={handleEditDetails}
                                className="w-full text-center text-sm font-semibold text-slate-500 hover:text-orange-600 disabled:opacity-50"
                            >
                                ← Change signup details
                            </button>

                        </form>
                    )}

                    {/* Login Link */}

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="font-bold text-orange-600 hover:text-orange-500 hover:underline"
                        >
                            Log In
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}

export default Signup;
