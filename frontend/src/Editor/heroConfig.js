//Editor/heroConfig.js
//
// Single source of truth for the Hero:
//  - HERO_BASE / VARIANT_COPY : every saved setting and its default (per layout wording)
//  - HERO_FIELDS              : how each setting is edited in the sidebar
//  - HERO_VARIANTS            : the layouts shown in the picker and which fields each one uses
//
// To make a new element editable: 1) read the prop in the hero component, 2) give it a default in
// HERO_BASE, 3) describe it in HERO_FIELDS, 4) add its key to that layout's `fields` list.

const LOREM = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";

export const HERO_BASE = {
    variant: "banner",
    visible: true,

    // text
    eyebrow: "",
    title: "Empowering Small Businesses with Custom Digital Storefronts",
    subtitle: "Build, customize, and launch your multi-tenant storefront in minutes with automated inventory and secure payments.",

    // buttons
    buttonText: "Get Started Free",
    buttonLink: "#products",
    secondaryButtonText: "",
    secondaryButtonLink: "#about",
    tertiaryButtonText: "",
    tertiaryButtonLink: "#",

    // layout + background
    height: "auto",
    align: "left",
    bgImage: "",
    overlay: 70,

    // media
    videoSrc: "",
    poster: "",
    productImg: "",
    avatarSrc: "",
    image: "",

    // banner
    stats: [
        { value: "2k+", label: "Stores" },
        { value: "99.9%", label: "Uptime" },
        { value: "24/7", label: "Support" },
    ],
    // centered
    bullets: [{ text: "No credit card" }, { text: "Free 14-day trial" }, { text: "Cancel anytime" }],
    // split
    splitLabel: "Revenue this week",
    splitValue: "₹48,290",
    splitTrend: "+18%",
    splitBars: "40, 65, 50, 80, 62, 95, 78",
    splitMetrics: [
        { label: "Orders", value: "312" },
        { label: "Visitors", value: "8,940" },
    ],
    // gradient
    gradientPreset: "sunset",
    // product showcase
    productChips: [{ text: "4.9 rating" }, { text: "Free shipping" }, { text: "2-year warranty" }],
    productPriceLabel: "From",
    productPrice: "₹1,499",
    // portfolio
    skills: [{ text: "Design" }, { text: "Development" }, { text: "Branding" }, { text: "Strategy" }],
    availableText: "Available",
    // e-commerce
    perks: [{ text: "Free delivery ₹999+" }, { text: "Secure payments" }, { text: "Easy returns" }],
    tiles: [
        { name: "Everyday Tee", price: "₹499", tag: "-30%", image: "" },
        { name: "Canvas Tote", price: "₹799", tag: "New", image: "" },
        { name: "Studio Mug", price: "₹349", tag: "", image: "" },
        { name: "Notebook Set", price: "₹599", tag: "Hot", image: "" },
    ],
    // slider
    sliderHeading: "Popular Places",
    places: [
        { tag: "Mountain in Japan", title: "Tokyo Cityscape", description: LOREM, image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80" },
        { tag: "Beautiful Thailand", title: "Beach Province", description: LOREM, image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80" },
        { tag: "Beautiful View", title: "Day Light in Morocco", description: LOREM, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" },
    ],
    socials: [
        { platform: "twitter", url: "https://twitter.com" },
        { platform: "facebook", url: "https://facebook.com" },
        { platform: "instagram", url: "https://instagram.com" },
    ],
};

// wording / overlay that belongs to each layout; applied again when the user switches layouts
// (only for values they have not changed themselves)
export const VARIANT_COPY = {
    banner: { eyebrow: "New · Multi-tenant storefronts", secondaryButtonText: "Learn more", tertiaryButtonText: "", overlay: 75 },
    centered: { eyebrow: "Trusted by growing brands", secondaryButtonText: "Book a demo", tertiaryButtonText: "", overlay: 75 },
    split: { eyebrow: "Grow faster", secondaryButtonText: "View pricing", tertiaryButtonText: "", overlay: 75 },
    gradient: { eyebrow: "Launch in minutes", secondaryButtonText: "See how it works", tertiaryButtonText: "", overlay: 55 },
    video: { eyebrow: "", secondaryButtonText: "Watch story", tertiaryButtonText: "", overlay: 55 },
    product: { eyebrow: "New arrival", secondaryButtonText: "", tertiaryButtonText: "", overlay: 75 },
    portfolio: { eyebrow: "Hi, I'm glad you're here 👋", secondaryButtonText: "Resume", tertiaryButtonText: "Projects", overlay: 75 },
    ecommerce: { eyebrow: "Season sale · up to 50% off", secondaryButtonText: "Browse categories", tertiaryButtonText: "", overlay: 75 },
    slider: { eyebrow: "Discover the world", secondaryButtonText: "", tertiaryButtonText: "", overlay: 55 },
};

export const HERO_DEFAULTS = { ...HERO_BASE, ...VARIANT_COPY.banner };

// saved hero (any age) + defaults for its layout
export function mergeHero(saved) {
    const variant = saved?.variant && VARIANT_COPY[saved.variant] ? saved.variant : "banner";
    return { ...HERO_BASE, ...VARIANT_COPY[variant], ...(saved || {}), variant };
}

// switch layout, replacing layout-specific wording only where the user has not edited it
export function switchHeroVariant(hero, nextVariant) {
    const prev = VARIANT_COPY[hero.variant] || {};
    const next = VARIANT_COPY[nextVariant] || {};
    const patch = { variant: nextVariant };
    for (const key of new Set([...Object.keys(prev), ...Object.keys(next)])) {
        if (hero[key] === prev[key] || hero[key] === undefined) patch[key] = next[key] ?? HERO_BASE[key];
    }
    return { ...hero, ...patch };
}

// ---------- editable fields ----------
const HEIGHT_OPTIONS = [
    { value: "auto", label: "Auto (fits content)" },
    { value: "sm", label: "Small (320px)" },
    { value: "md", label: "Medium (480px)" },
    { value: "lg", label: "Large (640px)" },
    { value: "screen", label: "Full screen" },
];
const ALIGN_OPTIONS = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
];
const SOCIAL_PLATFORMS = [
    { value: "twitter", label: "Twitter / X" },
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "youtube", label: "YouTube" },
];
export const GRADIENT_PRESETS = [
    { value: "sunset", label: "Sunset (orange + pink)" },
    { value: "ocean", label: "Ocean (blue + teal)" },
    { value: "aurora", label: "Aurora (green + violet)" },
    { value: "candy", label: "Candy (pink + indigo)" },
];

export const HERO_FIELDS = {
    eyebrow: { key: "eyebrow", label: "Badge / small label", type: "text", group: "Text", hint: "Leave empty to hide it." },
    title: { key: "title", label: "Headline", type: "textarea", rows: 2, group: "Text" },
    subtitle: { key: "subtitle", label: "Subtitle", type: "textarea", rows: 3, group: "Text" },

    buttonText: { key: "buttonText", label: "Main button label", type: "text", group: "Buttons" },
    buttonLink: { key: "buttonLink", label: "Main button link", type: "url", group: "Buttons", hint: "#products, /page, https://..., mailto:..." },
    secondaryButtonText: { key: "secondaryButtonText", label: "Second button label", type: "text", group: "Buttons", hint: "Leave empty to hide the button." },
    secondaryButtonLink: { key: "secondaryButtonLink", label: "Second button link", type: "url", group: "Buttons", show: (c) => !!c.secondaryButtonText },
    tertiaryButtonText: { key: "tertiaryButtonText", label: "Third button label", type: "text", group: "Buttons", hint: "Leave empty to hide the button." },
    tertiaryButtonLink: { key: "tertiaryButtonLink", label: "Third button link", type: "url", group: "Buttons", show: (c) => !!c.tertiaryButtonText },

    height: { key: "height", label: "Section height", type: "select", options: HEIGHT_OPTIONS, group: "Layout" },
    align: { key: "align", label: "Text alignment", type: "select", options: ALIGN_OPTIONS, group: "Layout" },

    bgImage: {
        key: "bgImage", label: "Background image", type: "image", group: "Background", hint: "Optional. Upload one or paste a URL.",
        // a playing video replaces the image, so hide the image field while a video is set
        show: (c) => !(c.variant === "video" && c.videoSrc),
    },
    overlay: {
        key: "overlay", label: "Image overlay strength", type: "range", min: 0, max: 90, step: 5, unit: "%", group: "Background",
        hint: "Higher = softer image, easier to read the text.",
        show: (c) => !!c.bgImage || (c.variant === "video" && !!c.videoSrc),
    },
    videoSrc: { key: "videoSrc", label: "Background video URL (.mp4)", type: "url", group: "Media", hint: "Leave empty for an animated gradient." },
    poster: { key: "poster", label: "Video poster image", type: "image", group: "Media" },
    productImg: { key: "productImg", label: "Product image", type: "image", group: "Media" },
    avatarSrc: { key: "avatarSrc", label: "Profile photo", type: "image", group: "Media" },
    image: { key: "image", label: "Side image", type: "image", group: "Media", hint: "Replaces the sample analytics card." },

    stats: {
        key: "stats", label: "Stats row", type: "list", group: "Content", addLabel: "+ Add stat", maxItems: 4,
        newItem: { value: "100+", label: "Customers" },
        itemFields: [
            { key: "value", label: "Value", type: "text", placeholder: "2k+" },
            { key: "label", label: "Label", type: "text", placeholder: "Stores" },
        ],
        itemTitle: (item, i) => item.label || `Stat ${i + 1}`,
    },
    bullets: {
        key: "bullets", label: "Trust points", type: "list", group: "Content", addLabel: "+ Add point", maxItems: 6,
        newItem: { text: "New point" },
        itemFields: [{ key: "text", label: "Text", type: "text" }],
    },
    splitLabel: { key: "splitLabel", label: "Card title", type: "text", group: "Sample card", show: (c) => !c.image },
    splitValue: { key: "splitValue", label: "Big number", type: "text", group: "Sample card", show: (c) => !c.image },
    splitTrend: { key: "splitTrend", label: "Trend badge", type: "text", group: "Sample card", show: (c) => !c.image, hint: "Leave empty to hide." },
    splitBars: { key: "splitBars", label: "Chart bars (0-100, comma separated)", type: "text", group: "Sample card", show: (c) => !c.image },
    splitMetrics: {
        key: "splitMetrics", label: "Small metrics", type: "list", group: "Sample card", addLabel: "+ Add metric", maxItems: 4, show: (c) => !c.image,
        newItem: { label: "Metric", value: "0" },
        itemFields: [
            { key: "label", label: "Label", type: "text" },
            { key: "value", label: "Value", type: "text" },
        ],
        itemTitle: (item, i) => item.label || `Metric ${i + 1}`,
    },
    gradientPreset: { key: "gradientPreset", label: "Color mood", type: "select", options: GRADIENT_PRESETS, group: "Background" },

    productChips: {
        key: "productChips", label: "Floating labels", type: "list", group: "Content", addLabel: "+ Add label", maxItems: 3,
        newItem: { text: "New label" },
        itemFields: [{ key: "text", label: "Text", type: "text" }],
    },
    productPriceLabel: { key: "productPriceLabel", label: "Price prefix", type: "text", group: "Content", placeholder: "From" },
    productPrice: { key: "productPrice", label: "Price", type: "text", group: "Content", hint: "Leave empty to hide the price." },

    skills: {
        key: "skills", label: "Skill tags", type: "list", group: "Content", addLabel: "+ Add skill", maxItems: 10,
        newItem: { text: "New skill" },
        itemFields: [{ key: "text", label: "Text", type: "text" }],
    },
    availableText: { key: "availableText", label: "Availability badge", type: "text", group: "Content", hint: "Leave empty to hide it." },

    perks: {
        key: "perks", label: "Perks strip", type: "list", group: "Content", addLabel: "+ Add perk", maxItems: 6,
        newItem: { text: "New perk" },
        itemFields: [{ key: "text", label: "Text", type: "text" }],
    },
    tiles: {
        key: "tiles", label: "Product tiles", type: "list", group: "Content", addLabel: "+ Add tile", maxItems: 8,
        newItem: { name: "New product", price: "₹0", tag: "", image: "" },
        itemFields: [
            { key: "image", label: "Image", type: "image" },
            { key: "name", label: "Name", type: "text" },
            { key: "price", label: "Price", type: "text" },
            { key: "tag", label: "Tag (optional)", type: "text" },
        ],
        itemTitle: (item, i) => item.name || `Tile ${i + 1}`,
    },

    sliderHeading: { key: "sliderHeading", label: "Cards heading", type: "text", group: "Cards" },
    places: {
        key: "places", label: "Carousel cards", type: "list", group: "Cards", addLabel: "+ Add card", maxItems: 10,
        newItem: { tag: "New tag", title: "Card title", description: "Short description", image: "" },
        itemFields: [
            { key: "image", label: "Image", type: "image" },
            { key: "tag", label: "Tag", type: "text" },
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "text" },
        ],
        itemTitle: (item, i) => item.title || `Card ${i + 1}`,
    },
    socials: {
        key: "socials", label: "Social icons", type: "list", group: "Social", addLabel: "+ Add profile", maxItems: 6,
        newItem: { platform: "linkedin", url: "https://" },
        itemFields: [
            { key: "platform", label: "Platform", type: "select", options: SOCIAL_PLATFORMS },
            { key: "url", label: "Link", type: "url" },
        ],
        itemTitle: (item) => item.platform,
    },
};

const COMMON = ["eyebrow", "title", "subtitle", "buttonText", "buttonLink"];
const BG = ["height", "bgImage", "overlay"];

// layout = wireframe style in the thumbnail, tone = tint behind it
export const HERO_VARIANTS = [
    { id: "banner", label: "Banner", desc: "Classic headline & CTA", layout: "left", tone: "from-orange-300 to-amber-200", fields: [...COMMON, "secondaryButtonText", "secondaryButtonLink", "stats", "align", ...BG] },
    { id: "slider", label: "Slider", desc: "Photo + card carousel", layout: "cards", tone: "from-sky-400 to-orange-300", dark: true, fields: [...COMMON, "bgImage", "overlay", "height", "sliderHeading", "places", "socials"] },
    { id: "centered", label: "Centered", desc: "Minimal, center-aligned", layout: "center", tone: "from-gray-300 to-gray-100", fields: [...COMMON, "secondaryButtonText", "secondaryButtonLink", "bullets", ...BG] },
    { id: "split", label: "Split Screen", desc: "Text with a side visual", layout: "split", tone: "from-orange-200 to-rose-200", fields: [...COMMON, "secondaryButtonText", "secondaryButtonLink", "image", "splitLabel", "splitValue", "splitTrend", "splitBars", "splitMetrics", ...BG] },
    { id: "gradient", label: "Gradient", desc: "Vibrant abstract look", layout: "center", tone: "from-fuchsia-500 to-indigo-600", dark: true, fields: [...COMMON, "secondaryButtonText", "secondaryButtonLink", "gradientPreset", ...BG] },
    { id: "video", label: "Video", desc: "Immersive background", layout: "left", tone: "from-slate-700 to-orange-700", dark: true, fields: [...COMMON, "secondaryButtonText", "secondaryButtonLink", "align", "videoSrc", "poster", "height", "bgImage", "overlay"] },
    { id: "product", label: "Product Show", desc: "Spotlight a top product", layout: "center", tone: "from-amber-200 to-orange-100", fields: [...COMMON, "productImg", "productChips", "productPriceLabel", "productPrice", ...BG] },
    { id: "portfolio", label: "Portfolio", desc: "Personal introduction", layout: "split", tone: "from-emerald-200 to-sky-200", fields: [...COMMON, "secondaryButtonText", "secondaryButtonLink", "tertiaryButtonText", "tertiaryButtonLink", "avatarSrc", "skills", "availableText", ...BG] },
    { id: "ecommerce", label: "E-Commerce", desc: "Sale & product tiles", layout: "split", tone: "from-rose-300 to-orange-200", fields: [...COMMON, "secondaryButtonText", "secondaryButtonLink", "perks", "tiles", ...BG] },
];
