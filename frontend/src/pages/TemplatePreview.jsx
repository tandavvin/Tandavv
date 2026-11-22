// src/Pages/TemplatePreview.jsx


// src/Pages/TemplatePreview.jsx

import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    Monitor,
    Tablet,
    Smartphone,
    ArrowLeft,
    ShoppingBag,
    Maximize2,
    Minimize2,
    RotateCcw,
    AlertCircle,
    Sparkles,
    Check,
} from "lucide-react";

import Storefront from "../Templates/Storefront";
import ModernStore from "../Templates/Website_Templates/ModernStore/ModernStore";

import { getStarter } from "../Editor/starterTemplates";
import { configFromDoc } from "../Editor/storeConfig";
import { getToken } from "../utils/api";

/* --------------------------------------------------
   TEMPLATE STARTER MAPPING
-------------------------------------------------- */

// Determines which starter content/configuration to load.

const TEMPLATE_STARTER_MAP = {
    "modern-store": "default",
    "creative-agency": "portfolio",
    "health-care": "landing",
    "restaurant": "default",
    "education": "landing",
    "business-pro": "default",
    "real-estate-hub": "default",
    "portfolio-minimal": "portfolio",
};

/* --------------------------------------------------
   TEMPLATE COMPONENT MAPPING
-------------------------------------------------- */

// Determines which visual layout to render.

const TEMPLATE_COMPONENT_MAP = {
    "modern-store": ModernStore,
};

/* --------------------------------------------------
   DEVICE CONFIGURATION
-------------------------------------------------- */

const VIEWPORTS = {
    desktop: {
        label: "Desktop",
        width: "100%",
        maxWidth: "1440px",
        icon: Monitor,
    },
    tablet: {
        label: "Tablet",
        width: "768px",
        maxWidth: "100%",
        icon: Tablet,
    },
    mobile: {
        label: "Mobile",
        width: "390px",
        maxWidth: "100%",
        icon: Smartphone,
    },
};

/* --------------------------------------------------
   MAIN COMPONENT
-------------------------------------------------- */

export default function TemplatePreviewPage() {
    const { templateId } = useParams();
    const navigate = useNavigate();

    const [viewport, setViewport] = useState("desktop");
    const [isFullscreen, setIsFullscreen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [previewError, setPreviewError] = useState(false);

    /* -----------------------------------------------
       LOAD STARTER TEMPLATE
    ----------------------------------------------- */

    const starter = useMemo(() => {
        try {
            const starterId =
                TEMPLATE_STARTER_MAP[templateId] || "default";

            return getStarter(starterId);
        } catch (error) {
            console.error("Error loading starter template:", error);
            return null;
        }
    }, [templateId]);

    /* -----------------------------------------------
       BUILD STOREFRONT CONFIGURATION
    ----------------------------------------------- */

    const storeConfig = useMemo(() => {
        try {
            if (!starter) return null;

            const rawDoc = starter.build
                ? starter.build()
                : {};

            return configFromDoc(rawDoc);
        } catch (error) {
            console.error("Error building storefront config:", error);
            return null;
        }
    }, [starter]);

    /* -----------------------------------------------
       SELECT TEMPLATE COMPONENT
    ----------------------------------------------- */

    const PreviewTemplate =
        TEMPLATE_COMPONENT_MAP[templateId] || Storefront;

    /* -----------------------------------------------
       LOADING STATE
    ----------------------------------------------- */

    useEffect(() => {
        setLoading(true);
        setPreviewError(false);

        const timer = setTimeout(() => {
            setLoading(false);

            if (!starter || !storeConfig) {
                setPreviewError(true);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [starter, storeConfig]);

    /* -----------------------------------------------
       ESCAPE KEY HANDLING
    ----------------------------------------------- */

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsFullscreen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    /* -----------------------------------------------
       SELECT TEMPLATE
    ----------------------------------------------- */

    const handleSelectTemplate = () => {
        sessionStorage.setItem(
            "selected_template_id",
            templateId
        );

        sessionStorage.setItem(
            "selected_template_version",
            "1.0.0"
        );

        const subscriptionUrl =
            `/subscription?template=${encodeURIComponent(templateId)}`;

        if (getToken()) {
            navigate(subscriptionUrl);
        } else {
            navigate("/login", {
                state: {
                    from: subscriptionUrl,
                },
            });
        }
    };

    /* -----------------------------------------------
       BACK TO MARKETPLACE
    ----------------------------------------------- */

    const handleBack = () => {
        navigate("/templates");
    };

    /* -----------------------------------------------
       RESET VIEWPORT
    ----------------------------------------------- */

    const handleResetViewport = () => {
        setViewport("desktop");
        setIsFullscreen(false);
    };

    /* -----------------------------------------------
       DEVICE SWITCHER
    ----------------------------------------------- */

    const DeviceButton = ({ device }) => {
        const DeviceIcon = VIEWPORTS[device].icon;
        const active = viewport === device;

        return (
            <button
                type="button"
                onClick={() => setViewport(device)}
                aria-label={`${VIEWPORTS[device].label} preview`}
                aria-pressed={active}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    active
                        ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                        : "text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
            >
                <DeviceIcon size={16} />

                <span className="hidden sm:inline">
                    {VIEWPORTS[device].label}
                </span>
            </button>
        );
    };

    /* -----------------------------------------------
       INVALID TEMPLATE STATE
    ----------------------------------------------- */

    if (!loading && previewError) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5 font-sans">
                <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                        <AlertCircle size={30} />
                    </div>

                    <h1 className="mt-6 text-xl font-bold text-white">
                        Template Preview Unavailable
                    </h1>

                    <p className="mt-3 text-sm leading-7 text-slate-400">
                        We couldn't load this template. It may have been
                        removed or is currently unavailable.
                    </p>

                    <button
                        type="button"
                        onClick={handleBack}
                        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700"
                    >
                        <ArrowLeft size={16} />
                        Back to Marketplace
                    </button>
                </div>
            </div>
        );
    }

    /* -----------------------------------------------
       LOADING SCREEN
    ----------------------------------------------- */

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 font-sans">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-orange-500" />

                    <p className="mt-5 text-sm font-semibold text-slate-300">
                        Preparing your template preview...
                    </p>
                </div>
            </div>
        );
    }

    /* -----------------------------------------------
       MAIN PREVIEW PAGE
    ----------------------------------------------- */

    const currentViewport = VIEWPORTS[viewport];

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-950 font-sans">

            {/* ======================================
                TOP HEADER
            ====================================== */}

            {!isFullscreen && (
                <header className="z-50 flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-3 sm:px-6">

                    {/* Left Section */}

                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-800 px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
                        >
                            <ArrowLeft size={16} />

                            <span className="hidden sm:inline">
                                Marketplace
                            </span>
                        </button>

                        <div className="hidden h-7 w-px bg-slate-700 sm:block" />

                        <div className="hidden min-w-0 sm:block">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Previewing Template
                                </span>

                                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[9px] font-bold text-green-400">
                                    <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                                    LIVE PREVIEW
                                </span>
                            </div>

                            <p className="mt-1 truncate text-sm font-bold text-white">
                                {starter?.label || templateId}
                            </p>
                        </div>
                    </div>

                    {/* Center Device Switcher */}

                    <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-800/60 p-1">
                        <DeviceButton device="desktop" />
                        <DeviceButton device="tablet" />
                        <DeviceButton device="mobile" />
                    </div>

                    {/* Right Section */}

                    <div className="flex shrink-0 items-center gap-2">

                        <button
                            type="button"
                            onClick={handleResetViewport}
                            title="Reset preview"
                            className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white sm:flex"
                        >
                            <RotateCcw size={16} />
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsFullscreen(true)}
                            title="Full screen preview"
                            className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white md:flex"
                        >
                            <Maximize2 size={17} />
                        </button>

                        <button
                            type="button"
                            onClick={handleSelectTemplate}
                            className="flex items-center gap-2 rounded-xl bg-orange-600 px-3 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 sm:px-5"
                        >
                            <ShoppingBag size={15} />

                            <span className="hidden sm:inline">
                                Select Template
                            </span>

                            <span className="sm:hidden">
                                Select
                            </span>
                        </button>
                    </div>
                </header>
            )}

            {/* ======================================
                FULLSCREEN HEADER
            ====================================== */}

            {isFullscreen && (
                <div className="absolute right-5 top-5 z-[60] flex items-center gap-2">

                    <button
                        type="button"
                        onClick={() => setIsFullscreen(false)}
                        className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-xs font-bold text-white shadow-xl backdrop-blur transition hover:bg-slate-800"
                    >
                        <Minimize2 size={16} />
                        Exit Full Screen
                    </button>

                    <button
                        type="button"
                        onClick={handleSelectTemplate}
                        className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-xs font-bold text-white shadow-xl transition hover:bg-orange-700"
                    >
                        <ShoppingBag size={15} />
                        Select Template
                    </button>
                </div>
            )}

            {/* ======================================
                PREVIEW WORKSPACE
            ====================================== */}

            <main
                className={`flex min-h-0 flex-1 items-start justify-center overflow-auto bg-slate-950 p-3 transition-all duration-300 sm:p-6 ${
                    isFullscreen ? "p-0 sm:p-0" : ""
                }`}
            >
                <div
                    style={{
                        width: currentViewport.width,
                        maxWidth: currentViewport.maxWidth,
                        height: "100%",
                    }}
                    className={`relative shrink-0 overflow-hidden bg-white transition-all duration-300 ${
                        viewport === "mobile" && !isFullscreen
                            ? "rounded-2xl border border-slate-700 shadow-2xl"
                            : viewport === "tablet" && !isFullscreen
                            ? "rounded-xl border border-slate-700 shadow-2xl"
                            : isFullscreen
                            ? "rounded-none"
                            : "rounded-xl border border-slate-800 shadow-2xl"
                    }`}
                >
                    {/* Selected Template */}

                    <div className="h-full w-full overflow-y-auto overflow-x-hidden bg-white">

                        <PreviewTemplate
                            config={storeConfig}
                            editor={false}
                        />

                    </div>
                </div>
            </main>

            {/* ======================================
                BOTTOM STATUS BAR
            ====================================== */}

            {!isFullscreen && (
                <footer className="flex h-10 shrink-0 items-center justify-between border-t border-slate-800 bg-slate-900 px-4 sm:px-6">

                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                        <Sparkles size={13} className="text-orange-500" />

                        <span>
                            Preview Mode
                        </span>

                        <span className="hidden text-slate-600 sm:inline">
                            •
                        </span>

                        <span className="hidden sm:inline">
                            Changes are not saved in this preview
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
                        <Check size={13} className="text-green-500" />

                        {currentViewport.label} View
                    </div>
                </footer>
            )}
        </div>
    );
}
