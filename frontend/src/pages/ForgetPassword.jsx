import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const STEPS = ["email", "code", "password", "done"];

function EyeIcon({ visible }) {
  if (visible) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ForgotPassword() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const currentStepIndex = STEPS.indexOf(step);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStep("code");
      } else {
        setError(data.message || "Unable to send verification code.");
      }
    } catch {
      setError("Server connection error. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStep("password");
      } else {
        setError(data.message || "Invalid verification code.");
      }
    } catch {
      setError("Server connection error. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStep("done");
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch {
      setError("Server connection error. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "block w-full rounded-xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm font-medium text-[#0f172a] placeholder:font-normal placeholder:text-slate-400 transition-all duration-200 hover:border-slate-300 focus:bg-white focus:border-[#ff4d00] focus:outline-none focus:ring-4 focus:ring-[#ff4d00]/10";

  const passwordInputClass = `${inputClass} pr-11`;

  const buttonClass =
    "w-full flex items-center justify-center gap-2 rounded-xl bg-[#ff4d00] py-3.5 px-5 text-sm font-bold text-white shadow-lg shadow-[#ff4d00]/20 transition-all duration-200 hover:bg-[#e64500] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-[#ff4d00]/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer";

  return (
    <main className="min-h-screen bg-[#fffaf5] flex flex-col justify-between font-sans antialiased text-[#0f172a] selection:bg-[#ff4d00] selection:text-white">
      <header className="w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="Tandav Logo"
              className="h-8 w-auto transition-transform duration-200 group-hover:scale-105"
            />
            <span className="text-lg font-extrabold tracking-tight text-[#0f172a]">Tandav</span>
          </Link>

          <Link
            to="/login"
            className="text-xs sm:text-sm font-medium text-slate-600 hover:text-[#0f172a] transition-colors"
          >
            Remember your password?{" "}
            <span className="text-[#ff4d00] font-semibold hover:underline">Sign in</span>
          </Link>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-7 sm:p-10 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-2 mb-7" aria-label="Progress">
              {["Email", "Verify", "Password"].map((label, idx) => {
                const isCompleted = currentStepIndex > idx || step === "done";
                const isActive = currentStepIndex === idx;
                return (
                  <div key={label} className="flex-1 flex flex-col gap-1.5">
                    <div
                      className={`h-1.5 w-full rounded-full transition-colors duration-300 ${
                        isCompleted || isActive ? "bg-[#ff4d00]" : "bg-slate-100"
                      }`}
                    />
                    <span
                      className={`text-[11px] font-semibold tracking-wide ${
                        isActive
                          ? "text-[#ff4d00]"
                          : isCompleted
                          ? "text-[#0f172a]"
                          : "text-slate-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-center mb-7">
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 ring-1 ${
                  step === "done"
                    ? "bg-emerald-50 text-emerald-600 ring-emerald-200/70"
                    : "bg-[#fff1e6] text-[#ff4d00] ring-[#ff4d00]/15"
                }`}
              >
                {step === "done" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                    />
                  </svg>
                )}
              </div>

              <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-[#0f172a]">
                {step === "email" && "Reset your password"}
                {step === "code" && "Enter verification code"}
                {step === "password" && "Create new password"}
                {step === "done" && "Password updated"}
              </h1>

              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                {step === "email" &&
                  "Enter your registered email address and we'll send you a 6-digit verification code."}
                {step === "code" && (
                  <>
                    We sent a 6-digit verification code to{" "}
                    <span className="font-semibold text-[#0f172a]">{email}</span>.
                  </>
                )}
                {step === "password" &&
                  "Choose a strong new password with at least 6 characters to secure your account."}
                {step === "done" &&
                  "Your password has been reset successfully. You can now sign in with your new credentials."}
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm font-medium text-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {step === "email" && (
              <form onSubmit={handleSendCode} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <button type="submit" disabled={loading} className={buttonClass}>
                  {loading ? "Checking & sending..." : "Send Verification Code"}
                </button>
              </form>
            )}

            {step === "code" && (
              <form onSubmit={handleVerifyCode} className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="code"
                      className="block text-[11px] font-bold uppercase tracking-wider text-slate-600"
                    >
                      6-Digit Verification Code
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setStep("email");
                      }}
                      className="text-xs font-semibold text-[#ff4d00] hover:underline cursor-pointer"
                    >
                      Change email
                    </button>
                  </div>
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    placeholder="••••••"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    className={`${inputClass} text-center tracking-[0.45em] font-mono font-bold text-lg py-3.5`}
                  />
                </div>
                <button type="submit" disabled={loading} className={buttonClass}>
                  {loading ? "Verifying code..." : "Verify Code"}
                </button>
              </form>
            )}

            {step === "password" && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      minLength={6}
                      required
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={passwordInputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-[#0f172a] transition-colors cursor-pointer"
                    >
                      <EyeIcon visible={showNewPassword} />
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      minLength={6}
                      required
                      autoComplete="new-password"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={passwordInputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={
                        showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-[#0f172a] transition-colors cursor-pointer"
                    >
                      <EyeIcon visible={showConfirmPassword} />
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className={buttonClass}>
                  {loading ? "Updating password..." : "Reset Password"}
                </button>
              </form>
            )}

            {step === "done" && (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0f172a] py-3.5 px-5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition-all duration-200 hover:bg-slate-800 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Return to Sign In</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Protected by enterprise-grade security protocols.
          </p>
        </div>
      </section>

      <footer className="w-full border-t border-slate-200/50 bg-white/40 py-5 px-6 sm:px-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto">
          &copy; {new Date().getFullYear()} Tandav Inc. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

export default ForgotPassword;