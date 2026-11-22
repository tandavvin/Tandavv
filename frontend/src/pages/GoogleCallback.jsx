import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch, saveSession } from "../utils/api";

function GoogleCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    useEffect(() => {
        const completeGoogleLogin = async () => {
            const code = searchParams.get("code");

            if (!code) {
                setError("Google authentication failed.");
                return;
            }

            try {
                const data = await apiFetch("/auth/google/exchange", {
                    method: "POST",
                    body: { code },
                    auth: false,
                });

                saveSession(data.token, data.user);

                navigate("/dashboard", { replace: true });

            } catch (err) {
                setError(err.message || "Google login failed.");
            }
        };

        completeGoogleLogin();
    }, [navigate, searchParams]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                {error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <>
                        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />

                        <p className="text-sm text-gray-600">
                            Completing Google sign in...
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default GoogleCallback;