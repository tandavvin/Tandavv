import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Storefront from "../Templates/Storefront";
import EditorSidebar from "./Sidebar/EditorSidebar";
import PropertiesInspector from "./Properties/PropertiesInspector";
import TopToolbar from "./Toolbar/TopToolbar";
import { AddSectionModal, NewStoreModal, PublishModal } from "./modals";
import { configFromDoc, configToPayload } from "./storeConfig";
import { apiFetch, getStoredUser, isUnauthorized } from "../utils/api";
import { useHistoryState } from "../utils/useHistoryState";

const EMPTY_CONFIG = configFromDoc({});

export default function TemplateEditor() {
    const { storeId } = useParams();
    const navigate = useNavigate();
    const user = getStoredUser();

    const { state: config, set: setConfig, undo, redo, reset, canUndo, canRedo } = useHistoryState(EMPTY_CONFIG);

    const [loaded, setLoaded] = useState({ id: null, error: "" });
    const [meta, setMeta] = useState({ published: false, slug: "" });
    const [savedConfig, setSavedConfig] = useState(null);
    const [saving, setSaving] = useState(false);

    // Professional Editor State
    const [selectedElement, setSelectedElement] = useState({ type: "section", id: "hero" });
    const [viewport, setViewport] = useState("responsive");
    const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);
    const [leftWidth, setLeftWidth] = useState(360);
    const [rightWidth, setRightWidth] = useState(320);
    const [modal, setModal] = useState(null);
    const [modalBusy, setModalBusy] = useState(false);
    const [modalError, setModalError] = useState("");

    const isResizingLeft = useRef(false);
    const isResizingRight = useRef(false);

    const location = useLocation();
    const hashId = useMemo(() => {
        try { return decodeURIComponent(location.hash.replace(/^#/, "")); } catch { return ""; }
    }, [location.hash]);
    
    const setActiveSection = useCallback(
        (id) => navigate({ pathname: location.pathname, search: location.search, hash: id ? `#${id}` : "" }, { replace: true }),
        [navigate, location.pathname, location.search]
    );

    const PREVIEW_MODES = [
        { id: "responsive", label: "Responsive", width: "w-full min-h-full" },
        { id: "mobile", label: "Mobile (380px)", width: "w-[380px]" },
        { id: "tablet", label: "Tablet (768px)", width: "w-[768px]" },
        { id: "laptop", label: "Laptop (1024px)", width: "w-[1024px]" },
    ];

    // Load store configuration
    useEffect(() => {
        let cancelled = false;
        apiFetch(`/config?storeId=${encodeURIComponent(storeId)}`)
            .then((res) => {
                if (cancelled) return;
                const cfg = configFromDoc(res.data);
                reset(cfg);
                setSavedConfig(cfg);
                setMeta({ published: !!res.data.published, slug: res.data.slug || "" });
                if (!window.location.hash) navigate({ pathname: window.location.pathname, search: window.location.search, hash: "#hero" }, { replace: true });
                setLoaded({ id: storeId, error: "" });
            })
            .catch((err) => {
                if (cancelled) return;
                if (isUnauthorized(err)) navigate("/login", { replace: true });
                else setLoaded({ id: storeId, error: err.message });
            });
        return () => { cancelled = true; };
    }, [storeId, navigate, reset]);

    // Resizable panels handlers
    useEffect(() => {
        const onMove = (e) => {
            if (isResizingLeft.current) {
                if (e.clientX > 280 && e.clientX < 500) setLeftWidth(e.clientX);
            }
            if (isResizingRight.current) {
                const newWidth = window.innerWidth - e.clientX;
                if (newWidth > 260 && newWidth < 480) setRightWidth(newWidth);
            }
        };
        const onUp = () => {
            isResizingLeft.current = false;
            isResizingRight.current = false;
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, []);

    const save = useCallback(
        async (snapshot) => {
            setSaving(true);
            try {
                await apiFetch(`/config?storeId=${encodeURIComponent(storeId)}`, { method: "PUT", body: configToPayload(snapshot) });
                setSavedConfig(snapshot);
            } catch (err) {
                console.error("Save failed:", err);
            } finally {
                setSaving(false);
            }
        },
        [storeId]
    );

    useEffect(() => {
        if (!loaded.id || savedConfig === config || saving) return;
        const timer = setTimeout(() => save(config), 1000);
        return () => clearTimeout(timer);
    }, [config, loaded.id, savedConfig, saving, save]);

    const publish = async (published, slug) => {
        setModalBusy(true);
        setModalError("");
        try {
            const res = await apiFetch(`/config/${storeId}/publish`, { method: "PATCH", body: { published, slug } });
            setMeta({ published: !!res.data.published, slug: res.data.slug || "" });
            setModal(null);
        } catch (err) {
            setModalError(err.message);
        } finally {
            setModalBusy(false);
        }
    };

    if (loaded.error) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="rounded-xl border bg-white p-6 text-center shadow">
                    <h2 className="font-bold text-gray-900">Failed to load store</h2>
                    <p className="mt-1 text-xs text-gray-500">{loaded.error}</p>
                    <button onClick={() => navigate("/dashboard")} className="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white cursor-pointer">Back to Dashboard</button>
                </div>
            </div>
        );
    }

    if (!loaded.id) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 text-xs text-gray-500 font-medium">
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-orange-600 border-t-transparent" /> Initializing professional editor workspace...
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-100 font-sans select-none">
            {/* Professional Top Toolbar */}
            <TopToolbar
                config={config}
                meta={meta}
                canUndo={canUndo}
                canRedo={canRedo}
                undo={undo}
                redo={redo}
                saving={saving}
                savedConfig={savedConfig}
                configState={config}
                viewport={viewport}
                setViewport={setViewport}
                onPublish={() => setModal("publish")}
                onNewStore={() => setModal("newStore")}
                navigate={navigate}
            />

            {/* 3-Panel Workspace */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Left Sidebar (4 Tabs: Add, Sections, Pages, Layers) */}
                <EditorSidebar
                    leftWidth={leftWidth}
                    config={config}
                    setConfig={setConfig}
                    activeSection={hashId}
                    setActiveSection={setActiveSection}
                    setSelectedElement={setSelectedElement}
                    openAddModal={() => setModal("addSection")}
                />

                {/* Left Panel Resizer */}
                <div onMouseDown={(e) => { e.preventDefault(); isResizingLeft.current = true; }} className="w-1 cursor-col-resize bg-gray-200 hover:bg-orange-500 transition-colors z-10" />

                {/* Center Canvas Workspace */}
                <main className="flex flex-1 flex-col overflow-hidden bg-gray-200 relative">
                    <div className="flex-1 overflow-auto p-8 flex items-start justify-center [scrollbar-width:thin]">
                        <div className={`bg-white shadow-2xl transition-all duration-300 rounded-lg overflow-hidden my-auto ${PREVIEW_MODES.find((m) => m.id === viewport)?.width || "w-full h-full min-h-full"
                            }`}>
                            <Storefront
                                config={config}
                                editor
                                activeSection={hashId}
                                onSelectSection={(id) => {
                                    setActiveSection(id);
                                    setSelectedElement({ type: "section", id });
                                    setIsPropertiesOpen(true);
                                }}
                                isLoggedIn={false}
                                user={user}
                            />
                        </div>
                    </div>
                </main>

                {/* Right Panel Resizer */}
                {isPropertiesOpen && (
                    <div onMouseDown={(e) => { e.preventDefault(); isResizingRight.current = true; }} className="w-1 cursor-col-resize bg-gray-200 hover:bg-orange-500 transition-colors z-10" />
                )}

                {/* Right Properties Inspector */}
                {isPropertiesOpen && (
                    <PropertiesInspector
                        rightWidth={rightWidth}
                        selectedElement={selectedElement}
                        config={config}
                        setConfig={setConfig}
                        onClose={() => setIsPropertiesOpen(false)}
                    />
                )}
            </div>

            {modal === "newStore" && <NewStoreModal onClose={() => setModal(null)} onCreate={(name, id) => { }} busy={modalBusy} error={modalError} />}
            {modal === "addSection" && <AddSectionModal onClose={() => setModal(null)} onAdd={(type, name) => { }} />}
            {modal === "publish" && <PublishModal store={meta} storeName={config.storeName} busy={modalBusy} error={modalError} onClose={() => setModal(null)} onPublish={publish} />}
        </div>
    );
}