export const NAVBAR_DEFAULTS = {
    logoName: "Tandav",
    logoImg: "/logo.png",
    logoColor: "yellow",
    borderColor: "yellow",
    backgroundColor: "white",
    textColor: "gray",
    hoverColor: "brand",
    navPosition: "center",
    borderStyle: "solid",
    navbarPadding: "py-3.5 px-6 sm:px-8",
    navbarMargin: "mt-4",
    showNavLinks: true,
    enableUnderlineAnimation: true,
    showIcons: true,
    isFloatingCapsule: false,
    isCapsuleFluid: false,
    capsuleRadius: "rounded-full",
    capsuleBgColor: "white",
    isGlassmorphic: false,
    showThemeToggle: false,
    enableSearch: false,
    enableCartBadge: false,
    enableAnnouncement: false,
    announcementText: "🎉 Launching Multi-Tenant Storefronts!",
    announcementBgColor: "bg-brand-600",
    announcementTextColor: "text-white",
    announcementLink: "",
    signUpBackgroundColor: "brand",
    signUpColor: "white",
    signUpHoverBackgroundColor: "brand",
    signupRadius: "rounded-full",
    loginBackgroundColor: "brand",
    loginColor: "white",
    loginHoverBackgroundColor: "brand",
    loginRadius: "rounded-full",
    navLinks: [
        { name: "Home", href: "#top", badge: "", children: [] },
        { name: "Products", href: "#products", badge: "Hot", children: [] },
        { name: "About", href: "#about", badge: "", children: [] },
    ],

    // ---- newly editable elements ----
    logoSize: "md",
    logoLink: "#top",
    isSticky: true,
    searchPlaceholder: "Search...",
    cartCount: 2,
    announcementLinkText: "Learn more",
    showLoginButton: true,
    loginText: "Login",
    loginLink: "#",
    showSignUpButton: true,
    signUpText: "Sign Up",
    signUpLink: "#",
    logoutText: "Log out",
    profileMenu: [
        { name: "My Profile", href: "#" },
        { name: "Store Settings", href: "#" },
    ],
};

export const mergeNavbar = (saved) => ({ ...NAVBAR_DEFAULTS, ...(saved || {}) });

export const COLOR_OPTIONS = [
    "brand", "white", "black", "transparent", "gray", "orange", "red",
    "blue", "green", "indigo", "slate", "zinc", "neutral",
    "stone", "amber", "yellow", "rose", "lime", "emerald",
    "teal", "cyan", "sky", "violet", "purple", "fuchsia", "pink",
];

export const BG_OPTIONS = [
    "bg-brand-600", "bg-orange-600", "bg-black", "bg-indigo-600", "bg-blue-600",
    "bg-emerald-600", "bg-rose-600", "bg-purple-600", "bg-slate-800",
];

export const TEXT_COLOR_OPTIONS = ["text-white", "text-yellow-300", "text-orange-200", "text-emerald-300"];

export const POSITION_OPTIONS = [
    { value: "start", label: "Start (Left)" },
    { value: "center", label: "Center" },
    { value: "end", label: "End (Right)" },
];

export const PADDING_OPTIONS = [
    { value: "py-2 px-4", label: "Compact Padding" },
    { value: "py-3.5 px-6 sm:px-8", label: "Standard Padding" },
    { value: "py-5 px-8 sm:px-12", label: "Spacious Padding" },
];

export const MARGIN_OPTIONS = [
    { value: "mt-2", label: "Small Margin (Top 2)" },
    { value: "mt-4", label: "Medium Margin (Top 4)" },
    { value: "mt-8", label: "Large Margin (Top 8)" },
];

export const RADIUS_OPTIONS = [
    { value: "rounded-full", label: "Full Pill" },
    { value: "rounded-3xl", label: "Extra Large (3xl)" },
    { value: "rounded-2xl", label: "Large (2xl)" },
    { value: "rounded-xl", label: "Medium (xl)" },
    { value: "rounded-none", label: "Square" },
];

export const BORDER_STYLE_OPTIONS = [
    { value: "solid", label: "Solid Border" },
    { value: "dashed", label: "Dashed Border" },
    { value: "none", label: "No Border" },
];

// kind = wireframe style in the thumbnail, tone = tint behind it, patch = settings applied on click
export const NAVBAR_PRESETS = [
    {
        id: "classic", label: "Classic Bar", desc: "Full-width, solid white", kind: "classic", tone: "from-gray-300 to-gray-100",
        patch: {
            isFloatingCapsule: false, isCapsuleFluid: false, isGlassmorphic: false,
            backgroundColor: "white", textColor: "gray", hoverColor: "brand",
            borderColor: "gray", borderStyle: "solid",
        },
    },
    {
        id: "capsule", label: "Floating Capsule", desc: "Rounded pill, floats", kind: "capsule", tone: "from-orange-300 to-amber-100",
        patch: {
            isFloatingCapsule: true, isCapsuleFluid: false, capsuleRadius: "rounded-full", isGlassmorphic: false,
            backgroundColor: "white", textColor: "gray", hoverColor: "brand",
            borderColor: "gray", borderStyle: "solid",
        },
    },
    {
        id: "glass", label: "Frosted Glass", desc: "Blurred, see-through", kind: "glass", tone: "from-sky-400 to-fuchsia-300",
        patch: {
            isFloatingCapsule: true, isCapsuleFluid: true, capsuleRadius: "rounded-2xl", isGlassmorphic: true,
            backgroundColor: "white", capsuleBgColor: "orange", textColor: "gray", hoverColor: "brand",
            borderColor: "white", borderStyle: "solid",
        },
    },
    {
        id: "dark", label: "Dark Mode", desc: "Black bar, light text", kind: "dark", tone: "from-slate-700 to-slate-400",
        patch: {
            isFloatingCapsule: false, isCapsuleFluid: false, isGlassmorphic: false,
            backgroundColor: "black", textColor: "white", hoverColor: "brand",
            borderColor: "black", borderStyle: "solid",
        },
    },
    {
        id: "minimal", label: "Minimal", desc: "No background or border", kind: "minimal", tone: "from-amber-100 to-white",
        patch: {
            isFloatingCapsule: false, isCapsuleFluid: false, isGlassmorphic: false,
            backgroundColor: "transparent", textColor: "gray", hoverColor: "brand",
            borderColor: "transparent", borderStyle: "none",
        },
    },
];

const LOGO_SIZES = [
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
];

// New navbar elements, grouped by the sidebar section they live in.
export const NAVBAR_FIELDS = {
    brand: [
        { key: "logoSize", label: "Logo size", type: "select", options: LOGO_SIZES },
        { key: "logoLink", label: "Logo link", type: "url", hint: "Where the logo goes when clicked, e.g. #top" },
    ],
    layout: [
        { key: "isSticky", type: "toggle", label: "Stick to top while scrolling", hint: "Navbar stays visible as visitors scroll" },
    ],
    tools: [
        { key: "searchPlaceholder", label: "Search box placeholder", type: "text", show: (c) => c.enableSearch },
        { key: "cartCount", label: "Cart badge number (preview)", type: "number", min: 0, max: 99, show: (c) => c.enableCartBadge },
    ],
    announce: [
        { key: "announcementLinkText", label: "Link text", type: "text", show: (c) => !!c.announcementLink },
    ],
    buttons: [
        { key: "showLoginButton", type: "toggle", label: "Show login button", group: "Login button" },
        { key: "loginText", label: "Label", type: "text", group: "Login button", show: (c) => c.showLoginButton },
        { key: "loginLink", label: "Link", type: "url", group: "Login button", show: (c) => c.showLoginButton },
        { key: "showSignUpButton", type: "toggle", label: "Show sign-up button", group: "Sign-up button" },
        { key: "signUpText", label: "Label", type: "text", group: "Sign-up button", show: (c) => c.showSignUpButton },
        { key: "signUpLink", label: "Link", type: "url", group: "Sign-up button", show: (c) => c.showSignUpButton },
    ],
    profile: [
        {
            key: "profileMenu", label: "Menu items", type: "list", addLabel: "+ Add item", maxItems: 8,
            newItem: { name: "New item", href: "#" },
            itemFields: [
                { key: "name", label: "Label", type: "text" },
                { key: "href", label: "Link", type: "url" },
            ],
            itemTitle: (item, i) => item.name || `Item ${i + 1}`,
        },
        { key: "logoutText", label: "Log-out label", type: "text" },
    ],
};
