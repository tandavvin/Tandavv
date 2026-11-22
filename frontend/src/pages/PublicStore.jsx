// src/pages/PublicStore.jsx



import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Storefront from "../Templates/Storefront";
import { configFromDoc } from "../Editor/storeConfig";
import { apiFetch } from "../utils/api";
import NotFound from "./NotFound";
import ProductDetails from "./ProductDetails";

function upsertTag(selector, create) {
    let el = document.head.querySelector(selector);
    const created = !el;

    if (!el) {
        el = create();
        document.head.appendChild(el);
    }

    return { el, created };
}

// Writes SEO details into <head> and restores them when leaving the page.
function useSeo(config) {
    useEffect(() => {
        if (!config) return;

        const { seo, storeName } = config;
        const previousTitle = document.title;
        const touched = [];

        document.title = seo.title || storeName;

        const setMeta = (attr, key, content) => {
            if (!content) return;

            const { el, created } = upsertTag(
                `meta[${attr}="${key}"]`,
                () => {
                    const m = document.createElement("meta");
                    m.setAttribute(attr, key);
                    return m;
                }
            );

            const before = el.getAttribute("content");
            el.setAttribute("content", content);

            touched.push(() =>
                created
                    ? el.remove()
                    : el.setAttribute("content", before ?? "")
            );
        };

        setMeta("name", "description", seo.description);
        setMeta("property", "og:title", seo.title || storeName);
        setMeta("property", "og:description", seo.description);
        setMeta("property", "og:image", seo.shareImage);
        setMeta("property", "og:type", "website");

        if (seo.favicon) {
            const { el, created } = upsertTag(
                'link[rel="icon"]',
                () => {
                    const l = document.createElement("link");
                    l.rel = "icon";
                    return l;
                }
            );

            const before = el.getAttribute("href");
            el.setAttribute("href", seo.favicon);

            touched.push(() =>
                created
                    ? el.remove()
                    : el.setAttribute("href", before ?? "")
            );
        }

        return () => {
            document.title = previousTitle;
            touched.forEach((undo) => undo());
        };
    }, [config]);
}

function SuspendedStore() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-orange-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.7 3h16.96a2 2 0 0 0 1.7-3L13.7 3.86a2 2 0 0 0-3.4 0Z"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900">
                    Store Temporarily Unavailable
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                    This store is currently unavailable. Please check back
                    later or contact the store owner for more information.
                </p>

                <div className="mt-6 rounded-lg bg-gray-50 px-4 py-3">
                    <p className="text-xs text-gray-500">
                        We apologize for the inconvenience.
                    </p>
                </div>

            </div>
        </div>
    );
}


function PublicStore() {
    const { slug, productId } = useParams();

    const [result, setResult] = useState({
        slug: null,
        config: null,
        notFound: false,
        suspended: false,
        error: "",
    });

    useEffect(() => {
        let cancelled = false;

        apiFetch(`/public/${encodeURIComponent(slug)}`, {
            auth: false,
        })
            .then((res) => {
                if (cancelled) return;

                setResult({
                    slug,
                    config: configFromDoc(res.data),
                    notFound: false,
                    suspended: false,
                    error: "",
                });
            })
            .catch((err) => {
                if (cancelled) return;

                setResult({
                    slug,
                    config: null,
                    notFound: err.status === 404,
                    suspended: err.code === "STORE_SUSPENDED",
                    error: err.message,
                });
            });

        return () => {
            cancelled = true;
        };
    }, [slug]);

    const current = result.slug === slug ? result : null;

    useSeo(current?.config || null);

    if (!current) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
            </div>
        );
    }

    if (current.suspended) {
        return <SuspendedStore />;
    }

    if (current.notFound) {
        return (
            <NotFound
                title="This store is not available"
                text="It may not be published yet, or the address may have changed."
            />
        );
    }

    if (!current.config) {
        return (
            <NotFound
                title="Something went wrong"
                text={current.error || "We could not load this store. Please try again later."}
            />
        );
    }

    // Product details page
    if (productId) {
        const product = current.config.products?.items?.find(
            (item) => String(item._id) === String(productId)
        );

        const availableProduct = product || null;

        return (
            <ProductDetails
                product={availableProduct}
                storeName={current.config.storeName}
                storeSlug={slug}
            />
        );
    }

    // Normal storefront
    return (
        <Storefront
            config={current.config}
            storeSlug={slug}
        />
    );
}


export default PublicStore;
