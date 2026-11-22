
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { apiFetch } from "../utils/api";

function RequireAuth({ children, allowedRoles }) {
    const location = useLocation();

    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        let isActive = true;

        const checkAuthentication = async () => {
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
                    setChecking(false);
                }
            }
        };

        checkAuthentication();

        return () => {
            isActive = false;
        };
    }, []);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-sm">
                    Checking authentication...
                </p>
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(user.role || "user")
    ) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default RequireAuth;
