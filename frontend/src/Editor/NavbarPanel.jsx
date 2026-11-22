//Editor/NavbarPanel.jsx

import { useEffect, useRef, useState } from "react";
import {
    NAVBAR_DEFAULTS, NAVBAR_FIELDS, NAVBAR_PRESETS, COLOR_OPTIONS, BG_OPTIONS, TEXT_COLOR_OPTIONS,
    POSITION_OPTIONS, PADDING_OPTIONS, MARGIN_OPTIONS, RADIUS_OPTIONS, BORDER_STYLE_OPTIONS,
} from "./navbarConfig";
import { ImageField, SchemaForm } from "./panelControls";

const inputCls =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-orange-500 focus:outline-none";

// =====================================================================
// Small shared controls
// =====================================================================

const swatchColorMap = {
    brand: "bg-orange-500", "bg-brand-600": "bg-orange-600",
    white: "bg-white border border-gray-300", black: "bg-black",
    transparent: "bg-gray-100 border border-dashed border-gray-400",
    gray: "bg-gray-500", orange: "bg-orange-500", red: "bg-red-500", blue: "bg-blue-500", green: "bg-green-500",
    indigo: "bg-indigo-500", slate: "bg-slate-500", zinc: "bg-zinc-500", neutral: "bg-neutral-500",
    stone: "bg-stone-500", amber: "bg-amber-500", yellow: "bg-yellow-400", rose: "bg-rose-500",
    lime: "bg-lime-500", emerald: "bg-emerald-500", teal: "bg-teal-500", cyan: "bg-cyan-500", sky: "bg-sky-500",
    violet: "bg-violet-500", purple: "bg-purple-500", fuchsia: "bg-fuchsia-500", pink: "bg-pink-500",
    "bg-orange-600": "bg-orange-600", "bg-black": "bg-black", "bg-indigo-600": "bg-indigo-600",
    "bg-blue-600": "bg-blue-600", "bg-emerald-600": "bg-emerald-600", "bg-rose-600": "bg-rose-600",
    "bg-purple-600": "bg-purple-600", "bg-slate-800": "bg-slate-800",
    "text-white": "bg-white border", "text-yellow-300": "bg-yellow-300",
    "text-orange-200": "bg-orange-200", "text-emerald-300": "bg-emerald-300",
};

function CustomDropdown({ value, onChange, options, label, showColorSwatch = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const close = (e) => ref.current && !ref.current.contains(e.target) && setIsOpen(false);
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    const current = options.find((o) => (o.value ?? o) === value);
    const currentLabel = current?.label ?? current ?? value;

    return (
        <div className="relative" ref={ref}>
            {label && <label className="mb-1.5 block text-xs font-semibold text-gray-600">{label}</label>}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 capitalize shadow-xs focus:border-orange-500 focus:outline-none cursor-pointer"
            >
                <span className="flex items-center gap-2.5">
                    {showColorSwatch && <span className={`h-3.5 w-3.5 shrink-0 rounded-md ${swatchColorMap[value] || "bg-gray-200"}`} />}
                    {currentLabel}
                </span>
                <svg className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-[999] mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-2xl">
                    {options.map((option) => {
                        const optVal = option.value ?? option;
                        const optLabel = option.label ?? option;
                        const isSelected = value === optVal;
                        return (
                            <div
                                key={optVal}
                                onClick={() => { onChange(optVal); setIsOpen(false); }}
                                className={`flex items-center justify-between px-3 py-2 text-xs capitalize cursor-pointer transition ${
                                    isSelected ? "bg-orange-50 font-semibold text-orange-600" : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <span>{optLabel}</span>
                                {showColorSwatch && <span className={`h-3.5 w-3.5 shrink-0 rounded-md ${swatchColorMap[optVal] || "bg-gray-200"}`} />}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function Toggle({ label, hint, checked, onChange, highlight = false }) {
    return (
        <div className={`flex items-center justify-between rounded-lg border p-3 ${highlight ? "border-orange-200 bg-orange-50" : "border-gray-200 bg-gray-50"}`}>
            <div className="pr-3">
                <span className={`block text-xs font-semibold ${highlight ? "text-orange-900" : "text-gray-800"}`}>{label}</span>
                {hint && <span className={`text-[11px] ${highlight ? "text-orange-700" : "text-gray-500"}`}>{hint}</span>}
            </div>
            <label className="relative inline-flex shrink-0 items-center cursor-pointer">
                <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
                <div className="h-5 w-9 rounded-full bg-gray-300 transition peer-checked:bg-orange-600 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white" />
            </label>
        </div>
    );
}

function TextField({ label, value, onChange, placeholder }) {
    return (
        <div>
            {label && <label className="mb-1.5 block text-xs font-semibold text-gray-600">{label}</label>}
            <input type="text" value={value || ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputCls} />
        </div>
    );
}

function Group({ title, isOpen, onToggle, children }) {
    return (
        <div className={`relative rounded-xl border border-gray-200 bg-white transition-all ${isOpen ? "z-30 ring-1 ring-orange-500/30" : "z-10"}`}>
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between rounded-xl bg-gray-50 px-4 py-2.5 transition hover:bg-gray-100 cursor-pointer"
            >
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">{title}</span>
                <svg className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && <div className="space-y-3 rounded-b-xl border-t border-gray-100 bg-white p-4">{children}</div>}
        </div>
    );
}

// =====================================================================
// Step 1: preset cards
// =====================================================================

function NavSketch({ kind }) {
    const dark = kind === "dark";
    const line = dark ? "bg-white/70" : "bg-gray-600/50";
    const accent = "bg-orange-500";

    const barCls = {
        classic: "w-full border-b border-gray-400/60 bg-white/90",
        capsule: "mx-auto w-[90%] rounded-full border border-gray-300/70 bg-white shadow-md",
        glass: "mx-auto w-[90%] rounded-xl border border-white/80 bg-white/45 shadow backdrop-blur",
        dark: "w-full bg-gray-900",
        minimal: "w-full",
    }[kind];

    const inset = kind === "capsule" || kind === "glass" ? "pt-4" : "pt-0";

    return (
        <div className={`absolute inset-0 ${inset}`}>
            <div className={`flex items-center gap-2 px-3 py-1.5 ${barCls}`}>
                <span className={`block h-2.5 w-2.5 rounded-full ${accent}`} />
                <span className={`block h-1 w-5 rounded-full ${line}`} />
                <span className="flex flex-1 items-center justify-center gap-1.5">
                    {[0, 1, 2].map((i) => <span key={i} className={`block h-1 w-4 rounded-full ${line}`} />)}
                </span>
                <span className={`block h-2.5 w-6 rounded-full ${accent}`} />
            </div>
        </div>
    );
}

function PresetCard({ preset, selected, onSelect }) {
    return (
        <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            className={`group relative h-24 overflow-hidden rounded-xl border text-left transition cursor-pointer ${
                selected ? "border-orange-500 shadow-md ring-2 ring-orange-500/40" : "border-gray-200 hover:border-gray-400"
            }`}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${preset.tone} transition-opacity ${selected ? "opacity-60" : "opacity-30 group-hover:opacity-45"}`} />
            <NavSketch kind={preset.kind} />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent px-2.5 pb-2 pt-5">
                <p className={`text-xs font-bold ${selected ? "text-orange-600" : "text-gray-700"}`}>{preset.label}</p>
                <p className="truncate text-[10px] text-gray-500">{preset.desc}</p>
            </div>

            {selected && (
                <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[11px] font-bold text-white shadow">✓</span>
            )}
        </button>
    );
}

// =====================================================================
// Menu links editor (immutable updates)
// =====================================================================

function NavLinksEditor({ links, onChange }) {
    const updateLink = (i, patch) => onChange(links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
    const updateChild = (i, ci, patch) =>
        updateLink(i, { children: links[i].children.map((c, k) => (k === ci ? { ...c, ...patch } : c)) });

    const miniInput = "rounded border border-gray-300 bg-white px-2 py-1 text-xs";

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Menu items</span>
                <button
                    type="button"
                    onClick={() => onChange([...links, { name: "New Link", href: "/", badge: "", children: [] }])}
                    className="rounded bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600 transition hover:bg-orange-100 cursor-pointer"
                >
                    + Add Link
                </button>
            </div>

            {links.map((link, index) => {
                const hasChildren = link.children && link.children.length > 0;
                return (
                    <div key={index} className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <div className="flex items-start gap-2">
                            <div className="flex-1 space-y-2">
                                <input type="text" placeholder="Link name" value={link.name} onChange={(e) => updateLink(index, { name: e.target.value })} className={`w-full ${miniInput}`} />
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Route" value={link.href} onChange={(e) => updateLink(index, { href: e.target.value })} className={`w-2/3 ${miniInput}`} />
                                    <input type="text" placeholder="Badge" value={link.badge || ""} onChange={(e) => updateLink(index, { badge: e.target.value })} className={`w-1/3 ${miniInput}`} />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => onChange(links.filter((_, i) => i !== index))}
                                title="Remove link"
                                className="p-1 text-gray-400 transition hover:text-red-600 cursor-pointer"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="border-t border-gray-200 pt-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold text-gray-700">Dropdown sub-menu</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={hasChildren}
                                        onChange={(e) => updateLink(index, { children: e.target.checked ? [{ name: "Sub Link", href: "/" }] : [] })}
                                        className="peer sr-only"
                                    />
                                    <div className="h-4 w-8 rounded-full bg-gray-300 transition peer-checked:bg-orange-600 after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white" />
                                </label>
                            </div>

                            {hasChildren && (
                                <div className="mt-3 space-y-2 border-l-2 border-orange-300 pl-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase text-gray-500">Child links</span>
                                        <button
                                            type="button"
                                            onClick={() => updateLink(index, { children: [...link.children, { name: "New Sub Link", href: "/" }] })}
                                            className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 transition hover:bg-orange-200 cursor-pointer"
                                        >
                                            + Add Child
                                        </button>
                                    </div>
                                    {link.children.map((child, ci) => (
                                        <div key={ci} className="flex items-center gap-2">
                                            <input type="text" placeholder="Name" value={child.name} onChange={(e) => updateChild(index, ci, { name: e.target.value })} className={`w-1/2 ${miniInput}`} />
                                            <input type="text" placeholder="Route" value={child.href} onChange={(e) => updateChild(index, ci, { href: e.target.value })} className={`w-1/2 ${miniInput}`} />
                                            <button
                                                type="button"
                                                onClick={() => updateLink(index, { children: link.children.filter((_, k) => k !== ci) })}
                                                title="Remove child link"
                                                className="px-1 text-xs font-bold text-gray-400 hover:text-red-600 cursor-pointer"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// =====================================================================
// The panel
// =====================================================================

function NavbarPanel({ navbar, setNavbar, isLoggedIn, setIsLoggedIn }) {
    const [openGroup, setOpenGroup] = useState("brand");
    const toggleGroup = (id) => setOpenGroup((cur) => (cur === id ? "" : id));

    const set = (patch) => setNavbar((prev) => ({ ...prev, ...patch }));
    const bind = (key) => ({ value: navbar[key], onChange: (v) => set({ [key]: v }) });

    // a preset is "active" when every setting it controls matches the current navbar
    const activePreset = NAVBAR_PRESETS.find((p) => Object.entries(p.patch).every(([k, v]) => navbar[k] === v));

    return (
        <div className="space-y-5 animate-fadeIn">
            {/* STEP 1 */}
            <section>
                <div className="mb-2.5 flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white">1</span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">Choose a style</h3>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                    {NAVBAR_PRESETS.map((preset) => (
                        <PresetCard
                            key={preset.id}
                            preset={preset}
                            selected={activePreset?.id === preset.id}
                            onSelect={() => set(preset.patch)}
                        />
                    ))}
                </div>
                <p className="mt-2 text-[10px] text-gray-400">A style is a starting point. You can fine-tune everything below.</p>
            </section>

            {/* STEP 2 */}
            <section className="rounded-xl border border-orange-200 bg-white shadow-xs">
                <div className="flex items-center justify-between rounded-t-xl border-b border-orange-100 bg-orange-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white">2</span>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">Customize</h3>
                    </div>
                    <span className="rounded-full bg-orange-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                        {activePreset ? activePreset.label : "Custom"}
                    </span>
                </div>

                <div className="space-y-3 p-4">
                    {/* preview-only switch */}
                    <Toggle
                        highlight
                        label="Preview as logged-in user"
                        hint="Shows profile menu instead of Login / Sign Up (preview only)"
                        checked={isLoggedIn}
                        onChange={setIsLoggedIn}
                    />

                    {/* Brand */}
                    <Group title="Brand & Logo" isOpen={openGroup === "brand"} onToggle={() => toggleGroup("brand")}>
                        <TextField label="Logo name" {...bind("logoName")} />
                        <CustomDropdown label="Logo name color" options={COLOR_OPTIONS} showColorSwatch {...bind("logoColor")} />
                        <ImageField label="Logo image" {...bind("logoImg")} />
                        <SchemaForm fields={NAVBAR_FIELDS.brand} values={navbar} onChange={(k, v) => set({ [k]: v })} />
                    </Group>

                    {/* Layout */}
                    <Group title="Layout & Shape" isOpen={openGroup === "layout"} onToggle={() => toggleGroup("layout")}>
                        <CustomDropdown label="Menu position" options={POSITION_OPTIONS} {...bind("navPosition")} />
                        <CustomDropdown label="Padding" options={PADDING_OPTIONS} {...bind("navbarPadding")} />
                        <CustomDropdown label="Border style" options={BORDER_STYLE_OPTIONS} {...bind("borderStyle")} />

                        <Toggle label="Floating capsule" hint="Navbar floats as a rounded shape" checked={navbar.isFloatingCapsule} onChange={(v) => set({ isFloatingCapsule: v })} />
                        {navbar.isFloatingCapsule && (
                            <div className="ml-3 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                                <Toggle label="Full-width capsule" hint="Stretch edge-to-edge" checked={navbar.isCapsuleFluid} onChange={(v) => set({ isCapsuleFluid: v })} />
                                <CustomDropdown label="Capsule rounding" options={RADIUS_OPTIONS} {...bind("capsuleRadius")} />
                                <CustomDropdown label="Top margin" options={MARGIN_OPTIONS} {...bind("navbarMargin")} />
                                <CustomDropdown label="Color behind capsule" options={COLOR_OPTIONS} showColorSwatch {...bind("capsuleBgColor")} />
                            </div>
                        )}
                        <Toggle label="Frosted glass" hint="Blurred, semi-transparent background" checked={navbar.isGlassmorphic} onChange={(v) => set({ isGlassmorphic: v })} />
                        <SchemaForm fields={NAVBAR_FIELDS.layout} values={navbar} onChange={(k, v) => set({ [k]: v })} />
                    </Group>

                    {/* Colors */}
                    <Group title="Colors" isOpen={openGroup === "colors"} onToggle={() => toggleGroup("colors")}>
                        <CustomDropdown label="Background" options={COLOR_OPTIONS} showColorSwatch {...bind("backgroundColor")} />
                        <CustomDropdown label="Text" options={COLOR_OPTIONS} showColorSwatch {...bind("textColor")} />
                        <CustomDropdown label="Link hover" options={COLOR_OPTIONS} showColorSwatch {...bind("hoverColor")} />
                        <CustomDropdown label="Border" options={COLOR_OPTIONS} showColorSwatch {...bind("borderColor")} />
                    </Group>

                    {/* Links */}
                    <Group title="Menu Links" isOpen={openGroup === "links"} onToggle={() => toggleGroup("links")}>
                        <Toggle label="Show menu links" checked={navbar.showNavLinks} onChange={(v) => set({ showNavLinks: v })} />
                        <Toggle label="Underline animation" hint="Animate links on hover" checked={navbar.enableUnderlineAnimation} onChange={(v) => set({ enableUnderlineAnimation: v })} />
                        <Toggle label="Show icons" hint="Auto icons based on link names" checked={navbar.showIcons} onChange={(v) => set({ showIcons: v })} />
                        <NavLinksEditor links={navbar.navLinks} onChange={(v) => set({ navLinks: v })} />
                    </Group>

                    {/* Tools */}
                    <Group title="Header Tools" isOpen={openGroup === "tools"} onToggle={() => toggleGroup("tools")}>
                        <Toggle label="Quick search" checked={navbar.enableSearch} onChange={(v) => set({ enableSearch: v })} />
                        <Toggle label="Shopping cart" checked={navbar.enableCartBadge} onChange={(v) => set({ enableCartBadge: v })} />
                        <Toggle label="Dark / light mode icon" checked={navbar.showThemeToggle} onChange={(v) => set({ showThemeToggle: v })} />
                        <SchemaForm fields={NAVBAR_FIELDS.tools} values={navbar} onChange={(k, v) => set({ [k]: v })} />
                    </Group>

                    {/* Announcement */}
                    <Group title="Announcement Bar" isOpen={openGroup === "announce"} onToggle={() => toggleGroup("announce")}>
                        <Toggle label="Show announcement bar" hint="Ticker at the top of the page" checked={navbar.enableAnnouncement} onChange={(v) => set({ enableAnnouncement: v })} />
                        {navbar.enableAnnouncement && (
                            <div className="space-y-3">
                                <TextField label="Text" {...bind("announcementText")} />
                                <TextField label="Link URL (optional)" placeholder="https://..." {...bind("announcementLink")} />
                                <SchemaForm fields={NAVBAR_FIELDS.announce} values={navbar} onChange={(k, v) => set({ [k]: v })} />
                                <CustomDropdown label="Background color" options={BG_OPTIONS} showColorSwatch {...bind("announcementBgColor")} />
                                <CustomDropdown label="Text color" options={TEXT_COLOR_OPTIONS} showColorSwatch {...bind("announcementTextColor")} />
                            </div>
                        )}
                    </Group>

                    {/* Buttons */}
                    <Group title="Login & Sign Up Buttons" isOpen={openGroup === "buttons"} onToggle={() => toggleGroup("buttons")}>
                        <SchemaForm fields={NAVBAR_FIELDS.buttons} values={navbar} onChange={(k, v) => set({ [k]: v })} />
                        {isLoggedIn ? (
                            <p className="rounded-lg bg-orange-50 p-3 text-[11px] text-orange-800">
                                These buttons are hidden while previewing a logged-in user. Turn that off above to see them.
                            </p>
                        ) : (
                            <>
                                <p className="border-b border-gray-100 pb-1 text-[10px] font-bold uppercase tracking-widest text-orange-600">Login look</p>
                                <CustomDropdown label="Rounding" options={RADIUS_OPTIONS} {...bind("loginRadius")} />
                                <CustomDropdown label="Background" options={COLOR_OPTIONS} showColorSwatch {...bind("loginBackgroundColor")} />
                                <CustomDropdown label="Text" options={COLOR_OPTIONS} showColorSwatch {...bind("loginColor")} />
                                <CustomDropdown label="Hover background" options={COLOR_OPTIONS} showColorSwatch {...bind("loginHoverBackgroundColor")} />

                                <p className="border-b border-gray-100 pb-1 pt-2 text-[10px] font-bold uppercase tracking-widest text-orange-600">Sign-up look</p>
                                <CustomDropdown label="Rounding" options={RADIUS_OPTIONS} {...bind("signupRadius")} />
                                <CustomDropdown label="Background" options={COLOR_OPTIONS} showColorSwatch {...bind("signUpBackgroundColor")} />
                                <CustomDropdown label="Text" options={COLOR_OPTIONS} showColorSwatch {...bind("signUpColor")} />
                                <CustomDropdown label="Hover background" options={COLOR_OPTIONS} showColorSwatch {...bind("signUpHoverBackgroundColor")} />
                            </>
                        )}
                    </Group>

                    {/* Profile menu (only visible while previewing a logged-in user) */}
                    <Group title="Profile Menu (logged-in preview)" isOpen={openGroup === "profile"} onToggle={() => toggleGroup("profile")}>
                        <p className="text-[11px] text-gray-500">Shown when a customer is logged in. Turn on “Preview as logged-in user” above to see it.</p>
                        <SchemaForm fields={NAVBAR_FIELDS.profile} values={navbar} onChange={(k, v) => set({ [k]: v })} />
                    </Group>

                    <button
                        type="button"
                        onClick={() => setNavbar({ ...NAVBAR_DEFAULTS })}
                        className="text-[11px] font-semibold text-gray-400 underline-offset-2 hover:text-red-600 hover:underline cursor-pointer"
                    >
                        Reset navbar to defaults
                    </button>
                </div>
            </section>
        </div>
    );
}

export default NavbarPanel;