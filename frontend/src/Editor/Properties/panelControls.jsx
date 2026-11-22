import { useRef, useState } from "react";
import { deleteUpload, listUploads, uploadImageFile } from "../utils/api";

export const inputCls =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none";

// ---------------------------------------------------------------------
// layout pieces
// ---------------------------------------------------------------------
export function StepHeader({ n, title }) {
    return (
        <div className="mb-2.5 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white">{n}</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">{title}</h3>
        </div>
    );
}

// Visual option card: tinted background + wireframe (children) + highlighted name
export function OptionCard({ selected, onSelect, tone, label, desc, children }) {
    return (
        <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            className={`group relative h-24 overflow-hidden rounded-xl border text-left transition cursor-pointer ${
                selected ? "border-orange-500 shadow-md ring-2 ring-orange-500/40" : "border-gray-200 hover:border-gray-400"
            }`}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${tone} transition-opacity ${selected ? "opacity-60" : "opacity-30 group-hover:opacity-45"}`} />
            <div className="absolute inset-0">{children}</div>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent px-2.5 pb-2 pt-5">
                <p className={`truncate text-xs font-bold ${selected ? "text-orange-600" : "text-gray-700"}`}>{label}</p>
                {desc && <p className="truncate text-[10px] text-gray-500">{desc}</p>}
            </div>

            {selected && (
                <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[11px] font-bold text-white shadow">✓</span>
            )}
        </button>
    );
}

export function Toggle({ label, hint, checked, onChange, highlight = false }) {
    return (
        <div className={`flex items-center justify-between rounded-lg border p-3 ${highlight ? "border-orange-200 bg-orange-50" : "border-gray-200 bg-gray-50"}`}>
            <div className="pr-3">
                <span className={`block text-xs font-semibold ${highlight ? "text-orange-900" : "text-gray-800"}`}>{label}</span>
                {hint && <span className={`text-[11px] ${highlight ? "text-orange-700" : "text-gray-500"}`}>{hint}</span>}
            </div>
            <label className="relative inline-flex shrink-0 items-center cursor-pointer">
                <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" aria-label={label} />
                <div className="h-5 w-9 rounded-full bg-gray-300 transition peer-checked:bg-orange-600 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white" />
            </label>
        </div>
    );
}

// The "2 Customize [Name]" card. Pass onVisibleChange to add the "Show this section" switch.
export function CustomizeCard({ label, visible, onVisibleChange, step = 2, children }) {
    return (
        <section className="rounded-xl border border-orange-200 bg-white shadow-xs">
            <div className="flex items-center justify-between rounded-t-xl border-b border-orange-100 bg-orange-50 px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white">{step}</span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">Customize</h3>
                </div>
                <span className="max-w-[55%] truncate rounded-full bg-orange-600 px-2.5 py-0.5 text-[11px] font-bold text-white">{label}</span>
            </div>
            <div className="space-y-5 p-4">
                {onVisibleChange && (
                    <Toggle highlight label="Show this section" hint="Turn off to hide it from the page" checked={visible} onChange={onVisibleChange} />
                )}
                {children}
            </div>
        </section>
    );
}

export function GroupTitle({ children }) {
    return <p className="border-b border-gray-100 pb-1 text-[10px] font-bold uppercase tracking-widest text-orange-600">{children}</p>;
}

export function Label({ children }) {
    return <label className="mb-1.5 block text-xs font-semibold text-gray-600">{children}</label>;
}

function Hint({ children }) {
    return children ? <p className="mt-1 text-[10px] leading-snug text-gray-400">{children}</p> : null;
}

export function AddButton({ onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full rounded-lg border border-orange-200 bg-orange-50 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-100 cursor-pointer"
        >
            {children}
        </button>
    );
}

export function ResetButton({ onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="text-[11px] font-semibold text-gray-400 underline-offset-2 hover:text-red-600 hover:underline cursor-pointer"
        >
            {children}
        </button>
    );
}

// ---------------------------------------------------------------------
// simple inputs
// ---------------------------------------------------------------------
export function TextField({ label, hint, value, onChange, placeholder }) {
    return (
        <div>
            {label && <Label>{label}</Label>}
            <input type="text" value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputCls} />
            <Hint>{hint}</Hint>
        </div>
    );
}

export function TextArea({ label, hint, value, onChange, rows = 3 }) {
    return (
        <div>
            {label && <Label>{label}</Label>}
            <textarea rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={inputCls} />
            <Hint>{hint}</Hint>
        </div>
    );
}

export function SelectField({ label, hint, value, onChange, options, numeric = false }) {
    return (
        <div>
            {label && <Label>{label}</Label>}
            <select value={value ?? ""} onChange={(e) => onChange(numeric ? Number(e.target.value) : e.target.value)} className={inputCls}>
                {options.map((o) => (
                    <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
                ))}
            </select>
            <Hint>{hint}</Hint>
        </div>
    );
}

export function NumberField({ label, hint, value, onChange, min = 0, max = 999 }) {
    return (
        <div>
            {label && <Label>{label}</Label>}
            <input
                type="number"
                min={min}
                max={max}
                value={value ?? 0}
                onChange={(e) => {
                    const n = Number(e.target.value);
                    onChange(Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min);
                }}
                className={inputCls}
            />
            <Hint>{hint}</Hint>
        </div>
    );
}

export function RangeField({ label, hint, value, onChange, min = 0, max = 100, step = 1, unit = "" }) {
    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between">
                <Label>{label}</Label>
                <span className="mb-1.5 text-[11px] font-semibold text-gray-500">{value ?? min}{unit}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value ?? min}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer"
            />
            <Hint>{hint}</Hint>
        </div>
    );
}

export function SwatchPicker({ label, hint, value, onChange, options }) {
    return (
        <div>
            {label && <Label>{label}</Label>}
            <div className="flex flex-wrap gap-2">
                {options.map((o) => (
                    <button
                        key={o.value}
                        type="button"
                        title={o.label}
                        aria-label={o.label}
                        aria-pressed={value === o.value}
                        onClick={() => onChange(o.value)}
                        className={`h-7 w-7 rounded-full border border-black/10 shadow-xs transition cursor-pointer ${
                            value === o.value ? "ring-2 ring-orange-500 ring-offset-2" : "hover:scale-110"
                        }`}
                        style={{ backgroundColor: o.color }}
                    />
                ))}
            </div>
            <Hint>{hint}</Hint>
        </div>
    );
}

// ---------------------------------------------------------------------
// image: paste a URL, upload a file, or pick from your uploads
// ---------------------------------------------------------------------
export function ImageField({ label, hint, value, onChange, placeholder }) {
    const fileRef = useRef(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [libOpen, setLibOpen] = useState(false);
    const [library, setLibrary] = useState(null);

    async function handleFile(e) {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        setBusy(true);
        setError("");
        try {
            onChange(await uploadImageFile(file));
            setLibrary(null); // refresh next time the library opens
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    async function toggleLibrary() {
        const next = !libOpen;
        setLibOpen(next);
        if (next && library === null) {
            try {
                setLibrary(await listUploads());
            } catch (err) {
                setError(err.message);
                setLibrary([]);
            }
        }
    }

    async function removeFromLibrary(item) {
        if (!window.confirm("Delete this image from your uploads?")) return;
        try {
            await deleteUpload(item.name);
            setLibrary((prev) => (prev || []).filter((x) => x.name !== item.name));
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div>
            {label && <Label>{label}</Label>}
            <div className="flex items-center gap-2">
                <input type="text" value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || "https://... or upload"} className={inputCls} />
                {value ? (
                    <img
                        key={value}
                        src={value}
                        alt=""
                        onError={(e) => (e.currentTarget.style.display = "none")}
                        className="h-8 w-8 shrink-0 rounded-md border border-gray-200 object-cover"
                    />
                ) : null}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={handleFile} className="hidden" />
                <button type="button" disabled={busy} onClick={() => fileRef.current?.click()}
                    className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-700 transition hover:border-orange-400 hover:text-orange-600 disabled:opacity-50 cursor-pointer">
                    {busy ? "Uploading..." : "Upload"}
                </button>
                <button type="button" onClick={toggleLibrary}
                    className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-700 transition hover:border-orange-400 hover:text-orange-600 cursor-pointer">
                    {libOpen ? "Hide library" : "My uploads"}
                </button>
                {value ? (
                    <button type="button" onClick={() => onChange("")} className="px-1.5 py-1 text-[11px] font-semibold text-gray-400 hover:text-red-600 cursor-pointer">
                        Clear
                    </button>
                ) : null}
            </div>

            {libOpen && (
                <div className="mt-2 rounded-lg border border-gray-200 bg-white p-2">
                    {library === null ? (
                        <p className="py-3 text-center text-[11px] text-gray-400">Loading...</p>
                    ) : library.length === 0 ? (
                        <p className="py-3 text-center text-[11px] text-gray-400">No uploads yet. Use “Upload” to add your first image.</p>
                    ) : (
                        <div className="grid grid-cols-4 gap-1.5">
                            {library.map((item) => (
                                <div key={item.name} className="group relative aspect-square overflow-hidden rounded-md border border-gray-200">
                                    <button type="button" onClick={() => { onChange(item.url); setLibOpen(false); }} className="h-full w-full cursor-pointer" title="Use this image">
                                        <img src={item.url} alt="" className="h-full w-full object-cover" />
                                    </button>
                                    <button type="button" onClick={() => removeFromLibrary(item)} aria-label="Delete image"
                                        className="absolute right-0.5 top-0.5 hidden h-4 w-4 items-center justify-center rounded-full bg-black/70 text-[10px] leading-none text-white group-hover:flex cursor-pointer">
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {error && <p className="mt-1 text-[11px] font-medium text-red-600">{error}</p>}
            <Hint>{hint}</Hint>
        </div>
    );
}

// ---------------------------------------------------------------------
// lists
// ---------------------------------------------------------------------
function IconButton({ onClick, disabled, label, children, danger = false }) {
    return (
        <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            disabled={disabled}
            aria-label={label}
            title={label}
            className={`flex h-6 w-6 items-center justify-center rounded text-xs transition disabled:opacity-25 cursor-pointer ${
                danger ? "text-gray-400 hover:bg-red-50 hover:text-red-600" : "text-gray-400 hover:bg-gray-200 hover:text-gray-700"
            }`}
        >
            {children}
        </button>
    );
}

export function ItemCard({ title, onRemove, onMoveUp, onMoveDown, defaultOpen = true, children }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="rounded-lg border border-gray-200 bg-gray-50">
            <div onClick={() => setOpen(!open)} className="flex cursor-pointer items-center justify-between gap-2 px-2.5 py-2">
                <div className="flex min-w-0 items-center gap-1.5">
                    <svg className={`h-3 w-3 shrink-0 text-gray-400 transition-transform ${open ? "rotate-90" : ""}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                    </svg>
                    <span className="truncate text-[11px] font-bold text-gray-700">{title}</span>
                </div>
                <div className="flex shrink-0 items-center">
                    {onMoveUp && <IconButton onClick={onMoveUp} disabled={!onMoveUp} label="Move up">↑</IconButton>}
                    {onMoveDown && <IconButton onClick={onMoveDown} disabled={!onMoveDown} label="Move down">↓</IconButton>}
                    <IconButton onClick={onRemove} label="Remove" danger>✕</IconButton>
                </div>
            </div>
            {open && <div className="space-y-2.5 border-t border-gray-200 p-2.5">{children}</div>}
        </div>
    );
}

function ListEditor({ def, value, onChange }) {
    const items = Array.isArray(value) ? value : [];
    const max = def.maxItems ?? 30;
    const compact = def.itemFields.length === 1 && def.itemFields[0].type === "text";
    const [justAdded, setJustAdded] = useState(-1);

    const update = (i, patch) => onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
    const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
    const move = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= items.length) return;
        const next = [...items];
        [next[i], next[j]] = [next[j], next[i]];
        onChange(next);
    };
    const add = () => {
        onChange([...items, { ...def.newItem }]);
        setJustAdded(items.length);
    };

    return (
        <div className="space-y-2">
            {def.label && (
                <Label>
                    {def.label} <span className="font-normal text-gray-400">({items.length})</span>
                </Label>
            )}

            {items.length === 0 && <p className="rounded-lg border border-dashed border-gray-300 py-3 text-center text-[11px] text-gray-400">Nothing here yet.</p>}

            {items.map((item, i) =>
                compact ? (
                    <div key={i} className="flex items-center gap-1">
                        <input
                            type="text"
                            value={item[def.itemFields[0].key] ?? ""}
                            onChange={(e) => update(i, { [def.itemFields[0].key]: e.target.value })}
                            className={inputCls}
                            aria-label={`${def.label} ${i + 1}`}
                        />
                        <IconButton onClick={() => move(i, -1)} disabled={i === 0} label="Move up">↑</IconButton>
                        <IconButton onClick={() => move(i, 1)} disabled={i === items.length - 1} label="Move down">↓</IconButton>
                        <IconButton onClick={() => remove(i)} label="Remove" danger>✕</IconButton>
                    </div>
                ) : (
                    <ItemCard
                        key={i}
                        title={def.itemTitle ? def.itemTitle(item, i) : `Item ${i + 1}`}
                        defaultOpen={items.length <= 3 || i === justAdded}
                        onRemove={() => remove(i)}
                        onMoveUp={i > 0 ? () => move(i, -1) : undefined}
                        onMoveDown={i < items.length - 1 ? () => move(i, 1) : undefined}
                    >
                        {def.itemFields.map((f) => (
                            <FieldControl key={f.key} def={f} value={item[f.key]} onChange={(v) => update(i, { [f.key]: v })} />
                        ))}
                    </ItemCard>
                )
            )}

            {items.length < max && <AddButton onClick={add}>{def.addLabel || "+ Add"}</AddButton>}
            <Hint>{def.hint}</Hint>
        </div>
    );
}

// ---------------------------------------------------------------------
// one field, by type
// ---------------------------------------------------------------------
export function FieldControl({ def, value, onChange }) {
    const common = { label: def.label, hint: def.hint, value, onChange };

    switch (def.type) {
        case "text":
            return <TextField {...common} placeholder={def.placeholder} />;
        case "url":
            return <TextField {...common} placeholder={def.placeholder || "#section, /page or https://..."} />;
        case "textarea":
            return <TextArea {...common} rows={def.rows} />;
        case "select":
            return <SelectField {...common} options={def.options} numeric={def.numeric} />;
        case "number":
            return <NumberField {...common} min={def.min} max={def.max} />;
        case "range":
            return <RangeField {...common} min={def.min} max={def.max} step={def.step} unit={def.unit} />;
        case "toggle":
            return <Toggle label={def.label} hint={def.hint} checked={value} onChange={onChange} />;
        case "swatches":
            return <SwatchPicker {...common} options={def.options} />;
        case "image":
            return <ImageField {...common} placeholder={def.placeholder} />;
        case "list":
            return <ListEditor def={def} value={value} onChange={onChange} />;
        default:
            return null;
    }
}

// Renders every field of a section, grouped under small headings (in order of first appearance).
export function SchemaForm({ fields, values, onChange }) {
    const groups = [];
    for (const f of fields) {
        if (f.show && !f.show(values)) continue;
        const name = f.group || "";
        let g = groups.find((x) => x.name === name);
        if (!g) groups.push((g = { name, items: [] }));
        g.items.push(f);
    }

    return (
        <>
            {groups.map(({ name, items }) => (
                <div key={name || "plain"} className="space-y-3">
                    {name && <GroupTitle>{name}</GroupTitle>}
                    {items.map((f) => (
                        <FieldControl key={f.key} def={f} value={values[f.key]} onChange={(v) => onChange(f.key, v)} />
                    ))}
                </div>
            ))}
        </>
    );
}
