//Editor/siteConfig.js


export const SEO_DEFAULTS = {
    title: "",
    description: "",
    favicon: "",
    shareImage: "",
};

export const mergeSeo = (saved) => ({ ...SEO_DEFAULTS, ...(saved || {}) });

export const SEO_FIELDS = [
    { key: "title", label: "Browser tab title", type: "text", group: "Search & sharing", hint: "Leave empty to use the store name." },
    { key: "description", label: "Short description", type: "textarea", rows: 3, group: "Search & sharing", hint: "Shown by search engines and when the link is shared (about 150 characters)." },
    { key: "favicon", label: "Tab icon (favicon)", type: "image", group: "Search & sharing", hint: "A small square image works best." },
    { key: "shareImage", label: "Share preview image", type: "image", group: "Search & sharing", hint: "Shown when the link is shared on social media." },
];
