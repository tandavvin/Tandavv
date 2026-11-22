//Editor/modals.jsx


import { useState } from "react";
import { CUSTOM_TYPE_LIST } from "./customSectionsConfig";
import { STARTERS } from "./starterTemplates";

const inputCls = "w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-orange-500 focus:outline-none";

function Overlay({ title, subtitle, onClose, children, wide = false }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <div className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl ${wide ? "max-w-lg" : "max-w-sm"}`} role="dialog" aria-modal="true" aria-label={title}>
                <h3 className="mb-1 text-base font-bold text-gray-900">{title}</h3>
                {subtitle && <p className="mb-4 text-xs text-gray-500">{subtitle}</p>}
                {children}
            </div>
        </div>
    );
}

function ModalButtons({ onCancel, submitLabel, busy, disabled }) {
    return (
        <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onCancel} className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 cursor-pointer">Cancel</button>
            <button type="submit" disabled={busy || disabled} className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-orange-700 disabled:opacity-50 cursor-pointer">
                {busy ? "Please wait..." : submitLabel}
            </button>
        </div>
    );
}

const ErrorLine = ({ children }) => (children ? <p className="rounded-lg bg-red-50 p-2.5 text-xs text-red-600">{children}</p> : null);

// ---------------------------------------------------------------------
export function NewStoreModal({ onClose, onCreate, busy, error }) {
    const [name, setName] = useState("");
    const [starterId, setStarterId] = useState("default");

    return (
        <Overlay title="Create a new store" subtitle="Pick a starting point. You can change everything afterwards." onClose={onClose} wide>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (name.trim()) onCreate(name.trim(), starterId);
                }}
                className="space-y-4"
            >
                <input type="text" required autoFocus placeholder="e.g. Organic Flour, Fashion Hub" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />

                <div className="grid grid-cols-2 gap-2.5">
                    {STARTERS.map((s) => (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => setStarterId(s.id)}
                            aria-pressed={starterId === s.id}
                            className={`relative overflow-hidden rounded-xl border p-3 text-left transition cursor-pointer ${starterId === s.id ? "border-orange-500 ring-2 ring-orange-500/40" : "border-gray-200 hover:border-gray-400"}`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${s.tone} ${starterId === s.id ? "opacity-40" : "opacity-20"}`} />
                            <p className={`relative text-xs font-bold ${starterId === s.id ? "text-orange-700" : "text-gray-800"}`}>{s.label}</p>
                            <p className="relative mt-0.5 text-[10px] leading-snug text-gray-600">{s.desc}</p>
                        </button>
                    ))}
                </div>

                <ErrorLine>{error}</ErrorLine>
                <ModalButtons onCancel={onClose} submitLabel="Create store" busy={busy} disabled={!name.trim()} />
            </form>
        </Overlay>
    );
}

// ---------------------------------------------------------------------
export function AddSectionModal({ onClose, onAdd }) {
    const [type, setType] = useState("cta");
    const [name, setName] = useState("");

    return (
        <Overlay title="Add a section" subtitle="Choose a ready-made block. Every part of it is editable." onClose={onClose} wide>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onAdd(type, name.trim());
                }}
                className="space-y-4"
            >
                <div className="grid grid-cols-2 gap-2.5">
                    {CUSTOM_TYPE_LIST.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setType(t.id)}
                            aria-pressed={type === t.id}
                            className={`relative overflow-hidden rounded-xl border p-3 text-left transition cursor-pointer ${type === t.id ? "border-orange-500 ring-2 ring-orange-500/40" : "border-gray-200 hover:border-gray-400"}`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${t.tone} ${type === t.id ? "opacity-40" : "opacity-20"}`} />
                            <p className={`relative text-xs font-bold ${type === t.id ? "text-orange-700" : "text-gray-800"}`}>{t.label}</p>
                            <p className="relative mt-0.5 text-[10px] leading-snug text-gray-600">{t.desc}</p>
                        </button>
                    ))}
                </div>

                <input type="text" placeholder="Section name (optional)" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
                <ModalButtons onCancel={onClose} submitLabel="Add section" />
            </form>
        </Overlay>
    );
}

// ---------------------------------------------------------------------
const toSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);

export function PublishModal({ store, storeName, busy, error, onClose, onPublish }) {
    const [slug, setSlug] = useState(store.slug || toSlug(storeName));
    const [copied, setCopied] = useState(false);

    const liveUrl = `${window.location.origin}/s/${slug}`;
    const slugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 3;

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(liveUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            window.prompt("Copy your store link:", liveUrl);
        }
    };

    return (
        <Overlay title={store.published ? "Your store is live" : "Publish your store"} subtitle={store.published ? "Anyone with the link can visit it. Changes you make here go live automatically." : "Choose a web address. Anyone with the link will be able to visit your store."} onClose={onClose} wide>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (slugValid) onPublish(true, slug);
                }}
                className="space-y-4"
            >
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-600">Store address</label>
                    <div className="flex items-center overflow-hidden rounded-lg border border-gray-300 focus-within:border-orange-500">
                        <span className="shrink-0 bg-gray-50 px-3 py-2 text-xs text-gray-500">{window.location.host}/s/</span>
                        <input type="text" value={slug} onChange={(e) => setSlug(toSlug(e.target.value))} className="w-full px-2 py-2 text-xs text-gray-900 focus:outline-none" placeholder="my-store" />
                    </div>
                    <p className="mt-1 text-[10px] text-gray-400">3-40 characters: lowercase letters, numbers and hyphens.</p>
                </div>

                {store.published && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                        <a href={liveUrl} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-xs font-semibold text-emerald-800 hover:underline">{liveUrl}</a>
                        <button type="button" onClick={copy} className="shrink-0 rounded-md bg-white px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-xs cursor-pointer">{copied ? "Copied!" : "Copy"}</button>
                    </div>
                )}

                <ErrorLine>{error}</ErrorLine>

                <div className="flex flex-wrap justify-end gap-2 pt-1">
                    {store.published && (
                        <button type="button" disabled={busy} onClick={() => onPublish(false, store.slug)} className="mr-auto rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 cursor-pointer">
                            Unpublish
                        </button>
                    )}
                    <button type="button" onClick={onClose} className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 cursor-pointer">Close</button>
                    <button type="submit" disabled={busy || !slugValid} className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-orange-700 disabled:opacity-50 cursor-pointer">
                        {busy ? "Please wait..." : store.published ? "Update address" : "Publish"}
                    </button>
                </div>
            </form>
        </Overlay>
    );
}
