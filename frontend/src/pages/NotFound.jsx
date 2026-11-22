// src/pages/NotFound.jsx

import { Link } from "react-router-dom";

function NotFound({ title = "Page not found", text = "The page you are looking for does not exist or has moved." }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="max-w-sm text-center">
                <p className="text-5xl font-extrabold text-orange-600">404</p>
                <h1 className="mt-3 text-xl font-bold text-gray-900">{title}</h1>
                <p className="mt-2 text-sm text-gray-500">{text}</p>
                <Link to="/" className="mt-6 inline-block rounded-full bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-orange-700">
                    Go to home
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
