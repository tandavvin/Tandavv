import { useState } from "react";

export function NewStoreModal({ onClose, onCreate, busy, error }) {
    const [name, setName] = useState("");
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="text-base font-bold text-gray-900">Create New Store</h3>
                <input type="text" placeholder="Store Name" value={name} onChange={(e) => setName(e.target.value)} className="mt-4 w-full rounded-lg border px-3 py-2 text-xs" />
                {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
                <div className="mt-6 flex justify-end gap-2">
                    <button onClick={onClose} className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold">Cancel</button>
                    <button onClick={() => onCreate(name, "default")} disabled={busy || !name.trim()} className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white">Create</button>
                </div>
            </div>
        </div>
    );
}

export function AddSectionModal({ onClose, onAdd }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="text-base font-bold text-gray-900">Add Section</h3>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    {["cta", "faq", "features", "gallery", "pricing", "text"].map((type) => (
                        <button key={type} onClick={() => onAdd(type, type.toUpperCase())} className="rounded-lg border p-3 text-left text-xs font-semibold capitalize hover:border-orange-500">{type}</button>
                    ))}
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold">Cancel</button>
                </div>
            </div>
        </div>
    );
}

export function PublishModal({ store, storeName, busy, error, onClose, onPublish }) {
    const [slug, setSlug] = useState(store.slug || "my-store");
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="text-base font-bold text-gray-900">Publish Store</h3>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-4 w-full rounded-lg border px-3 py-2 text-xs" />
                {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
                <div className="mt-6 flex justify-end gap-2">
                    <button onClick={onClose} className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold">Cancel</button>
                    <button onClick={() => onPublish(true, slug)} disabled={busy} className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white">Publish Now</button>
                </div>
            </div>
        </div>
    );
}