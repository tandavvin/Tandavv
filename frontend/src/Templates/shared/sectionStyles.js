// src/Templates/shared/sectionStyles.js
//
// Shared look-and-feel tokens used by every section so "Background", "Spacing", "Height" and
// "Alignment" behave the same everywhere. (All class names are written out in full so Tailwind finds them.)

export const SECTION_BACKGROUNDS = {
    white: { wrap: "bg-white", heading: "text-gray-900", text: "text-gray-600", muted: "text-gray-500", card: "bg-gray-50 border-gray-200", cardBg: "bg-white", cardHover: "hover:shadow-lg", line: "border-gray-200", dark: false },
    gray: { wrap: "bg-gray-50", heading: "text-gray-900", text: "text-gray-600", muted: "text-gray-500", card: "bg-white border-gray-200", cardBg: "bg-white", cardHover: "hover:shadow-lg", line: "border-gray-200", dark: false },
    brand: { wrap: "bg-brand-50", heading: "text-gray-900", text: "text-gray-700", muted: "text-gray-500", card: "bg-white border-brand-100", cardBg: "bg-white", cardHover: "hover:shadow-lg", line: "border-brand-200", dark: false },
    dark: { wrap: "bg-neutral-900", heading: "text-white", text: "text-white/70", muted: "text-white/50", card: "bg-white/5 border-white/10", cardBg: "bg-white/5", cardHover: "hover:bg-white/10", line: "border-white/15", dark: true },
};

export const sectionTheme = (background) => SECTION_BACKGROUNDS[background] || SECTION_BACKGROUNDS.white;

export const SECTION_SPACING = {
    compact: "py-8 @xl:py-12",
    normal: "py-14 @xl:py-20",
    spacious: "py-20 @xl:py-28",
};
export const spacingClass = (spacing) => SECTION_SPACING[spacing] || SECTION_SPACING.normal;

export const HERO_HEIGHTS = {
    auto: "",
    sm: "min-h-[320px]",
    md: "min-h-[480px]",
    lg: "min-h-[640px]",
    screen: "min-h-screen",
};
export const heroHeightClass = (height) => HERO_HEIGHTS[height] ?? "";

export const TEXT_ALIGN = { left: "text-left", center: "text-center", right: "text-right" };
export const ITEMS_ALIGN = { left: "items-start", center: "items-center", right: "items-end" };
export const JUSTIFY_ALIGN = { left: "justify-start", center: "justify-center", right: "justify-end" };
export const MAX_W_ALIGN = { left: "", center: "mx-auto", right: "ml-auto" };

// grid columns that respond to the preview width (container queries)
export const GRID_COLS = {
    1: "grid-cols-1",
    2: "grid-cols-1 @md:grid-cols-2",
    3: "grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3",
    4: "grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4",
};
export const gridCols = (n) => GRID_COLS[Number(n)] || GRID_COLS[3];
