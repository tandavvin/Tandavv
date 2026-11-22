//Editor/sectionsConfig.js


export const BACKGROUND_OPTIONS = [
    { value: "white", label: "White" },
    { value: "gray", label: "Soft gray" },
    { value: "brand", label: "Brand tint" },
    { value: "dark", label: "Dark" },
];

export const SPACING_OPTIONS = [
    { value: "compact", label: "Compact" },
    { value: "normal", label: "Normal" },
    { value: "spacious", label: "Spacious" },
];

// appended to every section so Background + Spacing work the same everywhere
export const STYLE_FIELDS = [
    { key: "background", label: "Background", type: "select", options: BACKGROUND_OPTIONS, group: "Style" },
    { key: "spacing", label: "Top & bottom spacing", type: "select", options: SPACING_OPTIONS, group: "Style" },
];

export const SOCIAL_PLATFORMS = [
    { value: "twitter", label: "Twitter / X" },
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "youtube", label: "YouTube" },
];

export const RATING_OPTIONS = [5, 4, 3, 2, 1].map((n) => ({ value: n, label: `${"★".repeat(n)}${"☆".repeat(5 - n)}  (${n})` }));

// =====================================================================
// PRODUCTS
// =====================================================================
export const PRODUCTS_DEFAULTS = {
    visible: true,
    eyebrow: "",
    sectionTitle: "Featured Products & Templates",
    subtitle: "Hand-picked items our customers love.",
    columns: 3,
    items: [
        { name: "Mill Flour Starter Pouch", category: "Packaging & Goods", price: "₹299", image: "", badge: "", link: "#" },
        { name: "Enterprise Storefront Theme", category: "Web Templates", price: "₹1,499", image: "", badge: "Popular", link: "#" },
        { name: "Automated Inventory Addon", category: "SaaS Plugins", price: "₹799", image: "", badge: "", link: "#" },
    ],
    showButton: true,
    buttonText: "Add to cart",
    cardStyle: "shadow",
    imageRatio: "square",
    emptyText: "No products yet.",
    background: "white",
    spacing: "normal",
};

export const PRODUCTS_FIELDS = [
    { key: "eyebrow", label: "Small label above title", type: "text", group: "Text", hint: "Leave empty to hide it." },
    { key: "sectionTitle", label: "Section title", type: "text", group: "Text" },
    { key: "subtitle", label: "Subtitle", type: "textarea", rows: 2, group: "Text" },
    {
        key: "items", label: "Product cards", type: "list", group: "Products", addLabel: "+ Add product", maxItems: 24,
        newItem: { name: "New product", category: "Category", price: "₹0", image: "", badge: "", link: "#" },
        itemFields: [
            { key: "image", label: "Image", type: "image" },
            { key: "name", label: "Name", type: "text" },
            { key: "category", label: "Category", type: "text" },
            { key: "price", label: "Price", type: "text" },
            { key: "badge", label: "Badge (optional)", type: "text", placeholder: "Sale, New, Popular..." },
            { key: "link", label: "Button link", type: "url" },
        ],
        itemTitle: (item, i) => item.name || `Product ${i + 1}`,
    },
    { key: "emptyText", label: "Message when there are no products", type: "text", group: "Products", show: (c) => !c.items?.length },
    { key: "showButton", type: "toggle", label: "Show a button on each card", group: "Cards" },
    { key: "buttonText", label: "Button label", type: "text", group: "Cards", show: (c) => c.showButton },
    {
        key: "cardStyle", label: "Card style", type: "select", group: "Cards",
        options: [{ value: "shadow", label: "Soft shadow" }, { value: "border", label: "Outlined" }, { value: "flat", label: "Flat (no border)" }],
    },
    {
        key: "imageRatio", label: "Image shape", type: "select", group: "Cards",
        options: [{ value: "square", label: "Square" }, { value: "portrait", label: "Portrait (tall)" }, { value: "landscape", label: "Landscape (wide)" }],
    },
    ...STYLE_FIELDS,
];

// =====================================================================
// ABOUT
// =====================================================================
export const ABOUT_DEFAULTS = {
    visible: true,
    eyebrow: "Our story",
    heading: "About Our Store",
    description:
        "We help small businesses launch beautiful, fast storefronts without writing a single line of code.\n\nEvery template is built to be customized, so your brand always looks like yours.",
    image: "",
    layout: "image-left",
    features: [{ text: "Made for small businesses" }, { text: "Launch in minutes" }, { text: "Friendly support" }],
    stats: [],
    buttonText: "",
    buttonLink: "#",
    background: "gray",
    spacing: "normal",
};

export const ABOUT_FIELDS = [
    { key: "eyebrow", label: "Small label above heading", type: "text", group: "Text", hint: "Leave empty to hide it." },
    { key: "heading", label: "Heading", type: "text", group: "Text" },
    { key: "description", label: "Description", type: "textarea", rows: 6, group: "Text", hint: "Press Enter twice to start a new paragraph." },
    { key: "image", label: "Image", type: "image", group: "Media", hint: "Leave empty to show a placeholder." },
    {
        key: "features", label: "Check-list", type: "list", group: "Highlights", addLabel: "+ Add point", maxItems: 8,
        newItem: { text: "New point" },
        itemFields: [{ key: "text", label: "Text", type: "text" }],
    },
    {
        key: "stats", label: "Numbers", type: "list", group: "Highlights", addLabel: "+ Add number", maxItems: 4,
        newItem: { value: "100+", label: "Happy customers" },
        itemFields: [
            { key: "value", label: "Value", type: "text" },
            { key: "label", label: "Label", type: "text" },
        ],
        itemTitle: (item, i) => item.label || `Number ${i + 1}`,
    },
    { key: "buttonText", label: "Button label", type: "text", group: "Button", hint: "Leave empty to hide the button." },
    { key: "buttonLink", label: "Button link", type: "url", group: "Button", show: (c) => !!c.buttonText },
    ...STYLE_FIELDS,
];

// =====================================================================
// TESTIMONIALS
// =====================================================================
export const TESTIMONIALS_DEFAULTS = {
    visible: true,
    eyebrow: "",
    heading: "What Our Customers Say",
    subtitle: "Real reviews from real shoppers.",
    layout: "cards",
    showRatings: true,
    items: [
        { name: "Aarav Sharma", role: "Verified buyer", review: "Setting up my store took an afternoon. The templates look professional and my customers love them.", rating: 5, avatar: "" },
        { name: "Priya Patel", role: "Boutique owner", review: "Super easy to customize. I changed the colors and products and it felt like my own brand right away.", rating: 5, avatar: "" },
        { name: "Rohan Mehta", role: "Small business owner", review: "Great value and quick support. A few more templates would make it perfect.", rating: 4, avatar: "" },
    ],
    emptyText: "No reviews yet.",
    background: "white",
    spacing: "normal",
};

export const TESTIMONIALS_FIELDS = [
    { key: "eyebrow", label: "Small label above heading", type: "text", group: "Text", hint: "Leave empty to hide it." },
    { key: "heading", label: "Heading", type: "text", group: "Text" },
    { key: "subtitle", label: "Subtitle", type: "text", group: "Text" },
    { key: "showRatings", type: "toggle", label: "Show star ratings", group: "Reviews" },
    {
        key: "items", label: "Reviews", type: "list", group: "Reviews", addLabel: "+ Add review", maxItems: 12,
        newItem: { name: "New customer", role: "", review: "Write the review here.", rating: 5, avatar: "" },
        itemFields: [
            { key: "name", label: "Customer name", type: "text" },
            { key: "role", label: "Role / location (optional)", type: "text" },
            { key: "review", label: "Review", type: "textarea", rows: 3 },
            { key: "rating", label: "Rating", type: "select", numeric: true, options: RATING_OPTIONS },
            { key: "avatar", label: "Photo (optional)", type: "image" },
        ],
        itemTitle: (item, i) => item.name || `Review ${i + 1}`,
    },
    { key: "emptyText", label: "Message when there are no reviews", type: "text", group: "Reviews", show: (c) => !c.items?.length },
    ...STYLE_FIELDS,
];

// =====================================================================
// FOOTER
// =====================================================================
export const FOOTER_BG_OPTIONS = [
    { value: "white", label: "White", color: "#ffffff" },
    { value: "gray", label: "Light gray", color: "#e5e7eb" },
    { value: "black", label: "Black", color: "#171717" },
    { value: "slate", label: "Slate", color: "#1e293b" },
    { value: "orange", label: "Brand color (follows your theme)", color: "#ea580c" },
    { value: "indigo", label: "Indigo", color: "#4338ca" },
    { value: "emerald", label: "Emerald", color: "#047857" },
    { value: "rose", label: "Rose", color: "#be123c" },
];

export const FOOTER_DEFAULTS = {
    visible: true,
    useNavbarLogo: true,
    logoName: "Tandav",
    logoImg: "/logo.png",
    description: "Custom digital storefronts for growing businesses. Build, customize and launch in minutes.",
    linksHeading: "Quick links",
    links: [
        { name: "Home", href: "#top" },
        { name: "Products", href: "#products" },
        { name: "About", href: "#about" },
    ],
    contactHeading: "Contact",
    email: "",
    phone: "",
    address: "",
    socialHeading: "Follow us",
    socials: [
        { platform: "twitter", url: "https://twitter.com" },
        { platform: "facebook", url: "https://facebook.com" },
        { platform: "instagram", url: "https://instagram.com" },
    ],
    backgroundColor: "black",
    copyright: "© 2026 Tandav. All rights reserved.",
};

export const FOOTER_FIELDS = [
    { key: "useNavbarLogo", type: "toggle", label: "Use the navbar logo", hint: "Same logo name and image as the navbar", group: "Brand" },
    { key: "logoName", label: "Logo name", type: "text", group: "Brand", show: (c) => !c.useNavbarLogo },
    { key: "logoImg", label: "Logo image", type: "image", group: "Brand", show: (c) => !c.useNavbarLogo },
    { key: "description", label: "Description", type: "textarea", rows: 3, group: "Brand" },

    { key: "linksHeading", label: "Column heading", type: "text", group: "Links", hint: "Leave empty to hide the whole column.", },
    {
        key: "links", label: "Links", type: "list", group: "Links", addLabel: "+ Add link", maxItems: 10,
        newItem: { name: "New link", href: "#" },
        itemFields: [
            { key: "name", label: "Label", type: "text" },
            { key: "href", label: "Link", type: "url" },
        ],
        itemTitle: (item, i) => item.name || `Link ${i + 1}`,
    },

    { key: "contactHeading", label: "Contact heading", type: "text", group: "Contact", hint: "Shown when any contact detail below is filled in." },
    { key: "email", label: "Email", type: "text", group: "Contact", placeholder: "hello@yourstore.com" },
    { key: "phone", label: "Phone", type: "text", group: "Contact", placeholder: "+91 98765 43210" },
    { key: "address", label: "Address", type: "textarea", rows: 2, group: "Contact" },

    { key: "socialHeading", label: "Social heading", type: "text", group: "Social media", hint: "Leave empty to hide the heading." },
    {
        key: "socials", label: "Social profiles", type: "list", group: "Social media", addLabel: "+ Add profile", maxItems: 6,
        newItem: { platform: "linkedin", url: "https://" },
        itemFields: [
            { key: "platform", label: "Platform", type: "select", options: SOCIAL_PLATFORMS },
            { key: "url", label: "Link", type: "url" },
        ],
        itemTitle: (item) => item.platform,
    },

    { key: "backgroundColor", label: "Background color", type: "swatches", options: FOOTER_BG_OPTIONS, group: "Appearance", hint: "Text color adjusts automatically." },
    { key: "copyright", label: "Copyright text", type: "text", group: "Appearance" },
];

// ---------- merge helpers: saved JSON (any age) + defaults ----------
const merge = (defaults) => (saved) => ({ ...defaults, ...(saved || {}) });
export const mergeProducts = merge(PRODUCTS_DEFAULTS);
export const mergeAbout = merge(ABOUT_DEFAULTS);
export const mergeTestimonials = merge(TESTIMONIALS_DEFAULTS);
export const mergeFooter = merge(FOOTER_DEFAULTS);
