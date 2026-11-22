// src/utils/theme.js
//
// Site-wide theme: a brand color (drives every `brand-*` Tailwind color in the templates),
// a font and the page background. The values are applied as CSS variables on the storefront root,
// so the live preview and the published site look identical.

import { useEffect } from "react";

const palette = (arr) =>
    Object.fromEntries([50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade, i) => [shade, arr[i]]));

export const BRAND_PALETTES = {
    orange: palette(["#fff7ed", "#ffedd5", "#fed7aa", "#fdba74", "#fb923c", "#f97316", "#ea580c", "#c2410c", "#9a3412", "#7c2d12"]),
    amber: palette(["#fffbeb", "#fef3c7", "#fde68a", "#fcd34d", "#fbbf24", "#f59e0b", "#d97706", "#b45309", "#92400e", "#78350f"]),
    rose: palette(["#fff1f2", "#ffe4e6", "#fecdd3", "#fda4af", "#fb7185", "#f43f5e", "#e11d48", "#be123c", "#9f1239", "#881337"]),
    pink: palette(["#fdf2f8", "#fce7f3", "#fbcfe8", "#f9a8d4", "#f472b6", "#ec4899", "#db2777", "#be185d", "#9d174d", "#831843"]),
    violet: palette(["#f5f3ff", "#ede9fe", "#ddd6fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95"]),
    indigo: palette(["#eef2ff", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81"]),
    blue: palette(["#eff6ff", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a"]),
    teal: palette(["#f0fdfa", "#ccfbf1", "#99f6e4", "#5eead4", "#2dd4bf", "#14b8a6", "#0d9488", "#0f766e", "#115e59", "#134e4a"]),
    emerald: palette(["#ecfdf5", "#d1fae5", "#a7f3d0", "#6ee7b7", "#34d399", "#10b981", "#059669", "#047857", "#065f46", "#064e3b"]),
    slate: palette(["#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b", "#475569", "#334155", "#1e293b", "#0f172a"]),
};

export const BRAND_OPTIONS = Object.keys(BRAND_PALETTES).map((value) => ({
    value,
    label: value[0].toUpperCase() + value.slice(1),
    color: BRAND_PALETTES[value][600],
}));

export const FONT_OPTIONS = [
    { value: "system", label: "System default", family: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif", google: "" },
    { value: "inter", label: "Inter - clean & modern", family: "'Inter', ui-sans-serif, system-ui, sans-serif", google: "Inter:wght@400;500;600;700;800" },
    { value: "poppins", label: "Poppins - friendly & round", family: "'Poppins', ui-sans-serif, system-ui, sans-serif", google: "Poppins:wght@400;500;600;700;800" },
    { value: "montserrat", label: "Montserrat - bold & urban", family: "'Montserrat', ui-sans-serif, system-ui, sans-serif", google: "Montserrat:wght@400;500;600;700;800" },
    { value: "playfair", label: "Playfair Display - elegant serif", family: "'Playfair Display', Georgia, serif", google: "Playfair+Display:wght@400;500;600;700;800" },
    { value: "lora", label: "Lora - classic serif", family: "'Lora', Georgia, serif", google: "Lora:wght@400;500;600;700" },
    { value: "mono", label: "Monospace - techy", family: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", google: "" },
];

export const PAGE_BG_OPTIONS = [
    { value: "white", label: "White", color: "#ffffff" },
    { value: "gray", label: "Soft gray", color: "#f9fafb" },
    { value: "cream", label: "Warm cream", color: "#fffaf3" },
];

export const THEME_DEFAULTS = { brand: "orange", font: "system", pageBackground: "white" };

export const mergeTheme = (saved) => ({ ...THEME_DEFAULTS, ...(saved || {}) });

// inline style for the storefront root element
export function themeStyle(theme) {
    const t = mergeTheme(theme);
    const palette = BRAND_PALETTES[t.brand] || BRAND_PALETTES.orange;
    const font = FONT_OPTIONS.find((f) => f.value === t.font) || FONT_OPTIONS[0];
    const bg = PAGE_BG_OPTIONS.find((b) => b.value === t.pageBackground) || PAGE_BG_OPTIONS[0];

    const vars = {};
    for (const [shade, hex] of Object.entries(palette)) vars[`--brand-${shade}`] = hex;
    return { ...vars, fontFamily: font.family, backgroundColor: bg.color };
}

// loads the chosen Google font once (system fonts need nothing)
export function useGoogleFont(fontValue) {
    useEffect(() => {
        const font = FONT_OPTIONS.find((f) => f.value === fontValue);
        if (!font || !font.google) return;
        const id = `gf-${font.value}`;
        if (document.getElementById(id)) return;
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
        document.head.appendChild(link);
    }, [fontValue]);
}
