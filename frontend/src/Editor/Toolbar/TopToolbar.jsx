import {
    ArrowLeft,
    Monitor,
    Laptop,
    Tablet,
    Smartphone,
    Undo2,
    Redo2,
    Plus,
    Check,
    LoaderCircle,
    Globe,
    ChevronDown,
} from "lucide-react";

export default function TopToolbar({
    config,
    meta,
    canUndo,
    canRedo,
    undo,
    redo,
    saving,
    savedConfig,
    configState,
    viewport,
    setViewport,
    onPublish,
    onNewStore,
    navigate,
}) {
    const isDirty = savedConfig !== configState;

    const statusText = saving
        ? "Saving changes..."
        : isDirty
            ? "Unsaved changes"
            : "All changes saved";

    const viewports = [
        { id: "responsive", label: "Responsive", icon: Monitor },
        { id: "laptop", label: "Laptop", icon: Laptop },
        { id: "tablet", label: "Tablet", icon: Tablet },
        { id: "mobile", label: "Mobile", icon: Smartphone },
    ];

    return (
        <header className="relative z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 shadow-sm">

            {/* LEFT: BRANDING & STORE */}
            <div className="flex min-w-0 items-center gap-3">

                <button
                    onClick={() => navigate("/dashboard")}
                    title="Back to Dashboard"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                >
                    <ArrowLeft size={17} />
                </button>

                <div className="h-7 w-px shrink-0 bg-gray-200" />

                <div className="flex shrink-0 items-center gap-2">
                    <img
                        src="/logo.png"
                        alt="Tandav"
                        className="h-8 w-8 object-contain"
                    />

                    <div className="hidden sm:block">
                        <p className="text-sm font-bold tracking-tight text-gray-900">
                            Tandav
                        </p>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                            Studio
                        </p>
                    </div>
                </div>

                <div className="hidden h-7 w-px shrink-0 bg-gray-200 md:block" />

                <div className="hidden min-w-0 items-center gap-2 md:flex">
                    <span className="text-xs text-gray-400">Editing</span>

                    <span
                        title={config?.storeName || "My Store"}
                        className="max-w-[170px] truncate rounded-md border border-orange-100 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700"
                    >
                        {config?.storeName || "My Store"}
                    </span>
                </div>
            </div>

            {/* CENTER: VIEWPORT SWITCHER */}
            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-xl border border-gray-200 bg-gray-100 p-1 lg:flex">
                {viewports.map((item) => {
                    const Icon = item.icon;
                    const active = viewport === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setViewport(item.id)}
                            title={`${item.label} preview`}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
                                active
                                    ? "bg-white text-orange-600 shadow-sm"
                                    : "text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                            }`}
                        >
                            <Icon size={15} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* RIGHT: HISTORY, STATUS & ACTIONS */}
            <div className="ml-auto flex shrink-0 items-center gap-1">

                {/* UNDO / REDO */}
                <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1">
                    <button
                        onClick={undo}
                        disabled={!canUndo}
                        title="Undo (Ctrl + Z)"
                        className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <Undo2 size={17} />
                    </button>

                    <button
                        onClick={redo}
                        disabled={!canRedo}
                        title="Redo (Ctrl + Y)"
                        className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <Redo2 size={17} />
                    </button>
                </div>

                {/* SAVE STATUS */}
                <div
                    title={statusText}
                    className="hidden items-center gap-2 rounded-lg px-2 py-2 text-xs text-gray-500 xl:flex"
                >
                    {saving ? (
                        <LoaderCircle
                            size={14}
                            className="animate-spin text-amber-500"
                        />
                    ) : isDirty ? (
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                    ) : (
                        <Check size={14} className="text-emerald-600" />
                    )}

                    <span>{statusText}</span>
                </div>

                {/* NEW STORE */}
                <button
                    onClick={onNewStore}
                    className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                >
                    <Plus size={15} />
                    <span className="hidden sm:inline">New Store</span>
                </button>

                {/* PUBLISH */}
                <button
                    onClick={onPublish}
                    className={`flex h-9 items-center gap-2 rounded-lg px-4 text-xs font-semibold text-white shadow-sm transition ${
                        meta?.published
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-orange-600 hover:bg-orange-700"
                    }`}
                >
                    {meta?.published ? (
                        <>
                            <Globe size={15} />
                            <span>Live Site</span>
                        </>
                    ) : (
                        <>
                            <Globe size={15} />
                            <span>Publish</span>
                        </>
                    )}
                </button>
            </div>
        </header>
    );
}