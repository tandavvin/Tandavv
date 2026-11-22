
// src/utils/api.js

export const API_ORIGIN = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export const API_URL = `${API_ORIGIN}/api`;

const USER_KEY = "user";

// JWT is now stored in an HTTP-only cookie.
// JavaScript cannot read it.
export const getToken = () => null;

// Read cached user profile
export function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
        return null;
    }
}

// Save only user information, never the JWT
export function saveSession(tokenOrUser, maybeUser) {
    const user = maybeUser ?? tokenOrUser;

    if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
}

// Clear cached user information
export function clearSession() {
    localStorage.removeItem(USER_KEY);
}


export class ApiError extends Error {
    constructor(message, status = 0, code = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.code = code;
    }
}

export const isUnauthorized = (err) =>
    err instanceof ApiError && err.status === 401;

// Centralized API request
export async function apiFetch(
    path,
    { method = "GET", body, auth = true, signal } = {}
) {
    const headers = {};

    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    let res;

    try {
        res = await fetch(`${API_URL}${path}`, {
            method,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
            signal,

            // Automatically send and receive HTTP-only cookies
            credentials: "include",
        });
    } catch (err) {
        if (err.name === "AbortError") throw err;

        throw new ApiError(
            "Cannot reach the server. Is the backend running?",
            0
        );
    }

    const data = await res.json().catch(() => null);

    if (res.status === 401 && auth) {
        clearSession();
    }

    if (!res.ok || (data && data.success === false)) {
        throw new ApiError(
            data?.message || `Request failed (${res.status})`,
            res.status,
            data?.code || null
        );
    }

    return data;
}

// ---------- Image uploads ----------

export const ALLOWED_IMAGE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
];

export const MAX_UPLOAD_MB = 5;

export async function uploadImageFile(file) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        throw new ApiError(
            "Please choose a PNG, JPG, GIF or WebP image",
            400
        );
    }

    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
        throw new ApiError(
            `Image is too large (max ${MAX_UPLOAD_MB} MB)`,
            413
        );
    }

    let res;

    try {
        res = await fetch(`${API_URL}/upload`, {
            method: "POST",
            headers: {
                "Content-Type": file.type,
            },
            body: file,
            credentials: "include",
        });
    } catch {
        throw new ApiError(
            "Cannot reach the server. Is the backend running?",
            0
        );
    }

    const data = await res.json().catch(() => null);

    if (res.status === 401) {
        clearSession();
    }

    if (!res.ok || !data?.success) {
        throw new ApiError(
            data?.message || "Upload failed",
            res.status
        );
    }

    return data.url;
}

export const listUploads = async () =>
    (await apiFetch("/upload")).data;

export const deleteUpload = (name) =>
    apiFetch(`/upload/${encodeURIComponent(name)}`, {
        method: "DELETE",
    });
