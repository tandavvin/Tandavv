//Editor/customSectionsConfig.js


import { STYLE_FIELDS } from "./sectionsConfig";
import { ICON_OPTIONS } from "../Templates/shared/iconMap";

const COLUMN_OPTIONS = [
    { value: 2, label: "2 columns" },
    { value: 3, label: "3 columns" },
    { value: 4, label: "4 columns" },
];
const ALIGN_OPTIONS = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
];

export const CUSTOM_TYPES = {
    cta: {
        label: "Call to action",
        desc: "Big banner with a button",
        tone: "from-orange-400 to-rose-300",
        defaults: {
            heading: "Ready to get started?",
            subtitle: "Join thousands of happy customers today.",
            buttonText: "Get started",
            buttonLink: "#",
            secondaryButtonText: "",
            secondaryButtonLink: "#",
            style: "brand",
            align: "center",
            bgImage: "",
            overlay: 60,
            spacing: "normal",
        },
        fields: [
            { key: "heading", label: "Heading", type: "text", group: "Text" },
            { key: "subtitle", label: "Subtitle", type: "textarea", rows: 2, group: "Text" },
            { key: "buttonText", label: "Main button label", type: "text", group: "Buttons", hint: "Leave empty to hide the button." },
            { key: "buttonLink", label: "Main button link", type: "url", group: "Buttons", show: (c) => !!c.buttonText },
            { key: "secondaryButtonText", label: "Second button label", type: "text", group: "Buttons", hint: "Leave empty to hide the button." },
            { key: "secondaryButtonLink", label: "Second button link", type: "url", group: "Buttons", show: (c) => !!c.secondaryButtonText },
            {
                key: "style", label: "Color style", type: "select", group: "Style",
                options: [{ value: "brand", label: "Brand color" }, { value: "dark", label: "Dark" }, { value: "light", label: "Light" }],
            },
            { key: "align", label: "Text alignment", type: "select", options: ALIGN_OPTIONS, group: "Style" },
            { key: "bgImage", label: "Background image (optional)", type: "image", group: "Style", hint: "Text turns white on top of an image." },
            { key: "overlay", label: "Image overlay strength", type: "range", min: 0, max: 90, step: 5, unit: "%", group: "Style", show: (c) => !!c.bgImage },
            { key: "spacing", label: "Top & bottom spacing", type: "select", group: "Style", options: STYLE_FIELDS[1].options },
        ],
    },

    faq: {
        label: "FAQ",
        desc: "Questions & answers",
        tone: "from-sky-400 to-indigo-300",
        defaults: {
            eyebrow: "",
            heading: "Frequently asked questions",
            subtitle: "Everything you need to know before you buy.",
            openFirst: true,
            items: [
                { question: "How long does delivery take?", answer: "Orders usually arrive within 3-5 business days." },
                { question: "Can I return an item?", answer: "Yes. You can return any unused item within 30 days for a full refund." },
                { question: "Do you ship internationally?", answer: "We currently ship across India, and international shipping is coming soon." },
                { question: "How can I contact support?", answer: "Write to us any time - we reply within one business day." },
            ],
            background: "white",
            spacing: "normal",
        },
        fields: [
            { key: "eyebrow", label: "Small label above heading", type: "text", group: "Text", hint: "Leave empty to hide it." },
            { key: "heading", label: "Heading", type: "text", group: "Text" },
            { key: "subtitle", label: "Subtitle", type: "text", group: "Text" },
            {
                key: "items", label: "Questions", type: "list", group: "Questions", addLabel: "+ Add question", maxItems: 20,
                newItem: { question: "New question?", answer: "Write the answer here." },
                itemFields: [
                    { key: "question", label: "Question", type: "text" },
                    { key: "answer", label: "Answer", type: "textarea", rows: 3 },
                ],
                itemTitle: (item, i) => item.question || `Question ${i + 1}`,
            },
            { key: "openFirst", type: "toggle", label: "Open the first answer by default", group: "Questions" },
            ...STYLE_FIELDS,
        ],
    },

    features: {
        label: "Features",
        desc: "Icons with short text",
        tone: "from-emerald-400 to-teal-300",
        defaults: {
            eyebrow: "",
            heading: "Why choose us",
            subtitle: "Everything you need to run a great store.",
            columns: 3,
            items: [
                { icon: "bolt", title: "Lightning fast", description: "Pages load instantly so customers never wait." },
                { icon: "shield", title: "Secure payments", description: "Every checkout is protected end to end." },
                { icon: "support", title: "Friendly support", description: "Real people ready to help, every day of the week." },
            ],
            background: "gray",
            spacing: "normal",
        },
        fields: [
            { key: "eyebrow", label: "Small label above heading", type: "text", group: "Text", hint: "Leave empty to hide it." },
            { key: "heading", label: "Heading", type: "text", group: "Text" },
            { key: "subtitle", label: "Subtitle", type: "text", group: "Text" },
            {
                key: "items", label: "Features", type: "list", group: "Features", addLabel: "+ Add feature", maxItems: 12,
                newItem: { icon: "star", title: "New feature", description: "Describe it in one short sentence." },
                itemFields: [
                    { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
                    { key: "title", label: "Title", type: "text" },
                    { key: "description", label: "Description", type: "textarea", rows: 2 },
                ],
                itemTitle: (item, i) => item.title || `Feature ${i + 1}`,
            },
            { key: "columns", label: "Columns", type: "select", numeric: true, options: COLUMN_OPTIONS, group: "Layout" },
            ...STYLE_FIELDS,
        ],
    },

    gallery: {
        label: "Image gallery",
        desc: "Grid of photos",
        tone: "from-fuchsia-400 to-pink-300",
        defaults: {
            eyebrow: "",
            heading: "Gallery",
            subtitle: "A peek at our latest work.",
            columns: 3,
            ratio: "square",
            showCaptions: true,
            items: [
                { image: "", caption: "Photo one" },
                { image: "", caption: "Photo two" },
                { image: "", caption: "Photo three" },
                { image: "", caption: "Photo four" },
                { image: "", caption: "Photo five" },
                { image: "", caption: "Photo six" },
            ],
            background: "white",
            spacing: "normal",
        },
        fields: [
            { key: "eyebrow", label: "Small label above heading", type: "text", group: "Text", hint: "Leave empty to hide it." },
            { key: "heading", label: "Heading", type: "text", group: "Text" },
            { key: "subtitle", label: "Subtitle", type: "text", group: "Text" },
            {
                key: "items", label: "Photos", type: "list", group: "Photos", addLabel: "+ Add photo", maxItems: 24,
                newItem: { image: "", caption: "New photo" },
                itemFields: [
                    { key: "image", label: "Image", type: "image" },
                    { key: "caption", label: "Caption", type: "text" },
                ],
                itemTitle: (item, i) => item.caption || `Photo ${i + 1}`,
            },
            { key: "columns", label: "Columns", type: "select", numeric: true, options: COLUMN_OPTIONS, group: "Layout" },
            {
                key: "ratio", label: "Photo shape", type: "select", group: "Layout",
                options: [{ value: "square", label: "Square" }, { value: "portrait", label: "Portrait (tall)" }, { value: "landscape", label: "Landscape (wide)" }],
            },
            { key: "showCaptions", type: "toggle", label: "Show captions", group: "Layout" },
            ...STYLE_FIELDS,
        ],
    },

    pricing: {
        label: "Pricing",
        desc: "Plans & prices",
        tone: "from-violet-400 to-indigo-300",
        defaults: {
            eyebrow: "",
            heading: "Simple, honest pricing",
            subtitle: "Pick the plan that fits your business.",
            plans: [
                { name: "Starter", price: "₹0", period: "/month", description: "Everything you need to get going.", features: "1 storefront\nBasic templates\nCommunity support", buttonText: "Start free", buttonLink: "#", highlighted: false, badge: "" },
                { name: "Pro", price: "₹999", period: "/month", description: "For growing businesses.", features: "5 storefronts\nAll templates\nCustom domain\nPriority support", buttonText: "Choose Pro", buttonLink: "#", highlighted: true, badge: "Most popular" },
                { name: "Business", price: "₹2,499", period: "/month", description: "For teams that need more.", features: "Unlimited storefronts\nTeam access\nAdvanced analytics\nDedicated manager", buttonText: "Contact sales", buttonLink: "#", highlighted: false, badge: "" },
            ],
            background: "gray",
            spacing: "normal",
        },
        fields: [
            { key: "eyebrow", label: "Small label above heading", type: "text", group: "Text", hint: "Leave empty to hide it." },
            { key: "heading", label: "Heading", type: "text", group: "Text" },
            { key: "subtitle", label: "Subtitle", type: "text", group: "Text" },
            {
                key: "plans", label: "Plans", type: "list", group: "Plans", addLabel: "+ Add plan", maxItems: 4,
                newItem: { name: "New plan", price: "₹0", period: "/month", description: "Short description", features: "Feature one\nFeature two", buttonText: "Choose plan", buttonLink: "#", highlighted: false, badge: "" },
                itemFields: [
                    { key: "name", label: "Plan name", type: "text" },
                    { key: "price", label: "Price", type: "text" },
                    { key: "period", label: "Period", type: "text", placeholder: "/month" },
                    { key: "description", label: "Short description", type: "text" },
                    { key: "features", label: "Features (one per line)", type: "textarea", rows: 4 },
                    { key: "buttonText", label: "Button label", type: "text" },
                    { key: "buttonLink", label: "Button link", type: "url" },
                    { key: "highlighted", label: "Highlight this plan", type: "toggle" },
                    { key: "badge", label: "Badge (optional)", type: "text", placeholder: "Most popular" },
                ],
                itemTitle: (item, i) => item.name || `Plan ${i + 1}`,
            },
            ...STYLE_FIELDS,
        ],
    },

    text: {
        label: "Text block",
        desc: "Heading and paragraph",
        tone: "from-gray-400 to-gray-200",
        defaults: {
            eyebrow: "",
            heading: "A few words about us",
            body: "Write anything you like here: your story, your values, shipping details or a short announcement.\n\nPress Enter twice to start a new paragraph.",
            align: "left",
            width: "narrow",
            background: "white",
            spacing: "normal",
        },
        fields: [
            { key: "eyebrow", label: "Small label above heading", type: "text", group: "Text", hint: "Leave empty to hide it." },
            { key: "heading", label: "Heading", type: "text", group: "Text" },
            { key: "body", label: "Text", type: "textarea", rows: 8, group: "Text" },
            { key: "align", label: "Alignment", type: "select", options: ALIGN_OPTIONS, group: "Layout" },
            {
                key: "width", label: "Text width", type: "select", group: "Layout",
                options: [{ value: "narrow", label: "Narrow (easy to read)" }, { value: "wide", label: "Wide" }],
            },
            ...STYLE_FIELDS,
        ],
    },
};

export const CUSTOM_TYPE_LIST = Object.entries(CUSTOM_TYPES).map(([id, t]) => ({ id, ...t }));

const clone = (v) => JSON.parse(JSON.stringify(v));

export function makeCustomSection(type, overrides = {}) {
    const spec = CUSTOM_TYPES[type] || CUSTOM_TYPES.text;
    return { visible: true, ...clone(spec.defaults), ...overrides, type: CUSTOM_TYPES[type] ? type : "text" };
}

// saved section (any age) + defaults of its type
export function mergeCustomSection(saved) {
    const type = CUSTOM_TYPES[saved?.type] ? saved.type : "text";
    return { visible: true, ...clone(CUSTOM_TYPES[type].defaults), ...(saved || {}), type };
}

export function nextSectionId(type, existingIds) {
    const taken = new Set(existingIds);
    let n = 1;
    while (taken.has(`${type}-${n}`)) n += 1;
    return `${type}-${n}`;
}
