// src/pages/BusinessDashboard/Overview.jsx


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    IndianRupee,
    ShoppingCart,
    Users,
    Globe,
    Plus,
    ExternalLink,
    Package,
    AlertTriangle,
    RefreshCw,
} from "lucide-react";

import StatCard from "../../components/BusinessDashboard/StatCard";
import DashboardChart from "../../components/BusinessDashboard/DashboardChart";
import RecentActivity from "../../components/BusinessDashboard/RecentActivity";
import TeamMemberCard from "../../components/BusinessDashboard/TeamMemberCard";
import { apiFetch } from "../../utils/api";

const orders = [
    { id: "#ORD-1024", customer: "Rahul Sharma", product: "Wireless Headphones", amount: "₹2,499", status: "Completed" },
    { id: "#ORD-1023", customer: "Priya Patel", product: "Smart Watch", amount: "₹3,999", status: "Pending" },
    { id: "#ORD-1022", customer: "Amit Kumar", product: "Bluetooth Speaker", amount: "₹1,499", status: "Completed" },
    { id: "#ORD-1021", customer: "Sneha Shah", product: "Keyboard", amount: "₹1,899", status: "Processing" },
];

const activity = [
    { title: "New order received", description: "Order #ORD-1024 was placed.", time: "10 minutes ago" },
    { title: "New customer registered", description: "Rahul Sharma joined your store.", time: "35 minutes ago" },
    { title: "Product added", description: "Wireless Headphones added.", time: "2 hours ago" },
];

const team = [
    { name: "Bikas Gupta", email: "owner@example.com", role: "Owner" },
    { name: "Priya Sharma", email: "priya@example.com", role: "Manager" },
    { name: "Rahul Verma", email: "rahul@example.com", role: "Editor" },
];

function formatDate(date) {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function WebsiteStatus({ stores, loading, error, onRetry }) {
    if (loading) {
        return (
            <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="font-bold text-gray-900">Website status</h3>
                <p className="mt-1 text-xs text-gray-500">Your online storefronts</p>

                <div className="mt-6 flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
                    <RefreshCw size={16} className="animate-spin" />
                    Loading your stores...
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="font-bold text-gray-900">Website status</h3>

                <div className="mt-5 rounded-xl bg-red-50 p-4">
                    <p className="text-sm text-red-700">{error}</p>

                    <button
                        onClick={onRetry}
                        className="mt-3 text-sm font-semibold text-red-700 hover:underline"
                    >
                        Try again
                    </button>
                </div>
            </section>
        );
    }

    if (!stores.length) {
        return (
            <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="font-bold text-gray-900">Website status</h3>
                <p className="mt-1 text-xs text-gray-500">Your online storefronts</p>

                <div className="mt-5 rounded-xl bg-gray-50 p-4">
                    <p className="text-sm font-semibold text-gray-800">
                        No stores found
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                        Create your first store to get started.
                    </p>
                    <Link
                        to="/dashboard/website"
                        className="mt-3 inline-block text-sm font-semibold text-[#FF7200]"
                    >
                        Create a store →
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="font-bold text-gray-900">Website status</h3>
            <p className="mt-1 text-xs text-gray-500">
                Your online storefronts
            </p>

            <div className="mt-5 space-y-4">
                {stores.map((store) => {
                    const isSuspended = store.status === "suspended";
                    const isPublished = store.published === true;
                    const slug = store.slug;
                    const websiteUrl = slug
                        ? `${window.location.origin}/s/${slug}`
                        : null;

                    return (
                        <div
                            key={store._id || store.id || slug}
                            className={`rounded-xl border p-4 ${
                                isSuspended
                                    ? "border-red-200 bg-red-50"
                                    : "border-gray-100 bg-orange-50"
                            }`}
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                        isSuspended
                                            ? "bg-red-100 text-red-700"
                                            : isPublished
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {isSuspended
                                        ? "● Suspended"
                                        : isPublished
                                            ? "● Published"
                                            : "● Unpublished"}
                                </span>

                                {isSuspended && (
                                    <AlertTriangle
                                        size={17}
                                        className="text-red-600"
                                    />
                                )}
                            </div>

                            <p className="mt-3 font-bold text-gray-900">
                                {store.storeName || "Untitled Store"}
                            </p>

                            {slug && (
                                <p className="mt-1 break-all text-xs text-gray-500">
                                    {websiteUrl}
                                </p>
                            )}

                            {isSuspended ? (
                                <div className="mt-4 rounded-lg border border-red-200 bg-white p-3">
                                    <p className="text-sm font-semibold text-red-700">
                                        Your storefront is currently suspended.
                                    </p>

                                    <p className="mt-2 text-xs text-gray-600">
                                        <strong>Suspended on:</strong>{" "}
                                        {formatDate(store.suspendedAt)}
                                    </p>

                                    {store.suspensionReason && (
                                        <div className="mt-2">
                                            <p className="text-xs font-semibold text-gray-700">
                                                Reason:
                                            </p>
                                            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                                                {store.suspensionReason}
                                            </p>
                                        </div>
                                    )}

                                    <p className="mt-3 text-xs text-gray-500">
                                        If you believe this suspension was made
                                        in error, please contact Tandav Support.
                                    </p>
                                </div>
                            ) : (
                                <p className="mt-2 text-xs text-gray-600">
                                    {isPublished
                                        ? "Your website is published and available to visitors."
                                        : "Your website is not published yet."}
                                </p>
                            )}

                            <div className="mt-4 flex flex-wrap items-center gap-4">
                                {!isSuspended && isPublished && websiteUrl && (
                                    <a
                                        href={websiteUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF7200] hover:underline"
                                    >
                                        View Website
                                        <ExternalLink size={14} />
                                    </a>
                                )}

                                <Link
                                    to="/dashboard/website"
                                    className="text-sm font-semibold text-gray-700 hover:text-[#FF7200]"
                                >
                                    Manage website →
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-100 p-3">
                    <p className="text-xs text-gray-500">Total stores</p>
                    <p className="mt-1 text-xl font-bold">{stores.length}</p>
                </div>

                <div className="rounded-xl border border-gray-100 p-3">
                    <p className="text-xs text-gray-500">Published stores</p>
                    <p className="mt-1 text-xl font-bold">
                        {stores.filter(
                            (store) =>
                                store.published === true &&
                                store.status !== "suspended"
                        ).length}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default function Overview() {
    const [stores, setStores] = useState([]);
    const [loadingStores, setLoadingStores] = useState(true);
    const [storeError, setStoreError] = useState("");

    const fetchStores = async () => {
        try {
            setLoadingStores(true);
            setStoreError("");

            const response = await apiFetch("/config/all");

            // Support the common response shapes returned by the API.
            const storeList = Array.isArray(response.data)
                ? response.data
                : Array.isArray(response.stores)
                    ? response.stores
                    : Array.isArray(response.data?.stores)
                        ? response.data.stores
                        : [];

            setStores(storeList);
        } catch (error) {
            console.error("Failed to fetch stores:", error);
            setStoreError(error.message || "Unable to load your stores.");
        } finally {
            setLoadingStores(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const activePublishedStore = stores.find(
        (store) =>
            store.published === true &&
            store.status !== "suspended" &&
            store.slug
    );

    const viewWebsiteUrl = activePublishedStore
        ? `${window.location.origin}/s/${activePublishedStore.slug}`
        : null;

    return (
        <div className="space-y-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Welcome back! 👋
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Here’s what’s happening with your business today.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {viewWebsiteUrl && (
                        <a
                            href={viewWebsiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            <ExternalLink size={16} />
                            View Website
                        </a>
                    )}

                    <Link
                        to="/dashboard/products/new"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#FF7200] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#E66500]"
                    >
                        <Plus size={17} />
                        Add Product
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Total Revenue" value="₹1,24,500" change="+12.5%" note="Compared to last month" icon={IndianRupee} />
                <StatCard title="Total Orders" value="248" change="+8.2%" note="Compared to last month" icon={ShoppingCart} />
                <StatCard title="Total Customers" value="1,240" change="+15.3%" note="Compared to last month" icon={Users} />
                <StatCard title="Website Visitors" value="8,540" change="-2.4%" positive={false} note="Compared to last month" icon={Globe} />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <DashboardChart />
                </div>

                <WebsiteStatus
                    stores={stores}
                    loading={loadingStores}
                    error={storeError}
                    onRetry={fetchStores}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white xl:col-span-2">
                    <div className="flex items-center justify-between border-b border-gray-100 p-5">
                        <div>
                            <h3 className="font-bold text-gray-900">Recent Orders</h3>
                            <p className="mt-1 text-xs text-gray-500">
                                Latest customer orders · sample data
                            </p>
                        </div>
                        <Link to="/dashboard/orders" className="text-sm font-semibold text-[#FF7200]">
                            View all
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[620px] text-left">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    {["Order ID", "Customer", "Product", "Amount", "Status"].map((x) => (
                                        <th key={x} className="px-5 py-4">{x}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o) => (
                                    <tr key={o.id} className="border-t border-gray-100 text-sm">
                                        <td className="px-5 py-4 font-semibold">{o.id}</td>
                                        <td className="px-5 py-4 text-gray-600">{o.customer}</td>
                                        <td className="px-5 py-4 text-gray-600">{o.product}</td>
                                        <td className="px-5 py-4 font-semibold">{o.amount}</td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                o.status === "Completed"
                                                    ? "bg-green-50 text-green-700"
                                                    : o.status === "Pending"
                                                        ? "bg-yellow-50 text-yellow-700"
                                                        : "bg-blue-50 text-blue-700"
                                            }`}>
                                                {o.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <RecentActivity items={activity} />
            </div>

            <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-gray-900">Team Members</h3>
                        <p className="mt-1 text-xs text-gray-500">
                            People working on your store
                        </p>
                    </div>
                    <Link to="/dashboard/team" className="text-sm font-semibold text-[#FF7200]">
                        Manage team
                    </Link>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {team.map((m) => (
                        <TeamMemberCard key={m.email} member={m} />
                    ))}
                </div>
            </section>

            <section className="rounded-2xl bg-[#171717] p-6 text-white sm:flex sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-bold">Ready to grow your business?</h3>
                    <p className="mt-1 text-sm text-gray-300">
                        Add products, publish pages, and reach more customers.
                    </p>
                </div>

                <Link
                    to="/dashboard/products/new"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#FF7200] px-4 py-2.5 text-sm font-semibold hover:bg-[#E66500] sm:mt-0"
                >
                    <Package size={17} />
                    Add a product
                </Link>
            </section>
        </div>
    );
}
