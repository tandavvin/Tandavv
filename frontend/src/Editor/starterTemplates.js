//Editor/starterTemplates.js


import { makeCustomSection } from "./customSectionsConfig";
import { CORE_SECTIONS } from "./storeConfig";

const coreLabel = (id) => CORE_SECTIONS.find((s) => s.id === id)?.label || id;

// turns { order: ["navbar", "faq-1", ...], custom: { "faq-1": {...} } } into saved-document form
function toDoc({ order, custom = {}, labels = {}, ...sections }) {
    const customSections = {};
    for (const [id, cfg] of Object.entries(custom)) customSections[id] = cfg;

    return {
        ...sections,
        sectionsOrder: order.map((id) => ({
            id,
            label: labels[id] || coreLabel(id),
            ...(customSections[id] ? { type: customSections[id].type } : {}),
        })),
        customSections,
    };
}

export const STARTERS = [
    {
        id: "default",
        label: "Classic Store",
        desc: "A balanced online-shop layout",
        tone: "from-orange-300 to-amber-200",
        build: () => ({}),
    },
    {
        id: "fashion",
        label: "Fashion Boutique",
        desc: "Elegant serif look, shop first",
        tone: "from-rose-300 to-pink-200",
        build: () =>
            toDoc({
                theme: { brand: "rose", font: "playfair", pageBackground: "cream" },
                navbar: {
                    logoName: "Maison", logoColor: "rose", enableSearch: true, enableCartBadge: true, showSignUpButton: false,
                    loginText: "Sign in",
                    navLinks: [
                        { name: "Home", href: "#top", badge: "", children: [] },
                        { name: "Shop", href: "#products", badge: "New", children: [] },
                        { name: "Our story", href: "#about", badge: "", children: [] },
                        { name: "Reviews", href: "#testimonials", badge: "", children: [] },
                    ],
                },
                hero: {
                    variant: "ecommerce",
                    eyebrow: "New season · up to 40% off",
                    title: "Style that moves with you",
                    subtitle: "New-season essentials, made in small batches and delivered to your door.",
                    buttonText: "Shop the collection",
                    secondaryButtonText: "Look book",
                    tiles: [
                        { name: "Linen Shirt", price: "₹1,899", tag: "New", image: "" },
                        { name: "Wrap Dress", price: "₹2,799", tag: "-20%", image: "" },
                        { name: "Canvas Tote", price: "₹999", tag: "", image: "" },
                        { name: "Silk Scarf", price: "₹1,299", tag: "Hot", image: "" },
                    ],
                },
                products: {
                    sectionTitle: "New arrivals", subtitle: "Fresh pieces added every week.", columns: 4, imageRatio: "portrait", buttonText: "Add to bag",
                    items: [
                        { name: "Linen Shirt", category: "Tops", price: "₹1,899", image: "", badge: "New", link: "#" },
                        { name: "Wrap Dress", category: "Dresses", price: "₹2,799", image: "", badge: "-20%", link: "#" },
                        { name: "Wide-leg Trousers", category: "Bottoms", price: "₹2,199", image: "", badge: "", link: "#" },
                        { name: "Canvas Tote", category: "Bags", price: "₹999", image: "", badge: "", link: "#" },
                        { name: "Silk Scarf", category: "Accessories", price: "₹1,299", image: "", badge: "", link: "#" },
                        { name: "Leather Belt", category: "Accessories", price: "₹899", image: "", badge: "", link: "#" },
                    ],
                },
                about: { eyebrow: "Our story", heading: "Crafted with care", layout: "image-right", description: "Every piece is designed in-house and made in small batches by people we know by name.\n\nWe believe clothes should feel good, last long and look effortless.", features: [{ text: "Natural, breathable fabrics" }, { text: "Made in small batches" }, { text: "Free returns within 30 days" }], background: "white" },
                testimonials: { layout: "quotes", background: "gray" },
                footer: { description: "Considered clothing for everyday life.", email: "hello@maison.example", socialHeading: "Follow along" },
                order: ["navbar", "hero", "features-1", "products", "about", "testimonials", "cta-1", "footer"],
                labels: { "features-1": "Perks", "cta-1": "Newsletter banner" },
                custom: {
                    "features-1": makeCustomSection("features", {
                        heading: "Shop with confidence", subtitle: "", background: "white",
                        items: [
                            { icon: "truck", title: "Free shipping", description: "On every order above ₹999." },
                            { icon: "heart", title: "Easy returns", description: "Changed your mind? Send it back within 30 days." },
                            { icon: "shield", title: "Secure checkout", description: "Your payment details are always protected." },
                        ],
                    }),
                    "cta-1": makeCustomSection("cta", { heading: "Get 10% off your first order", subtitle: "Join our list for new arrivals and private sales.", buttonText: "Join the list", style: "dark" }),
                },
            }),
    },
    {
        id: "portfolio",
        label: "Personal Portfolio",
        desc: "Show your work and say hello",
        tone: "from-indigo-300 to-sky-200",
        build: () =>
            toDoc({
                theme: { brand: "indigo", font: "poppins", pageBackground: "white" },
                navbar: {
                    logoName: "Alex Rivera", logoImg: "", logoColor: "indigo", showLoginButton: false, signUpText: "Hire me", signUpLink: "mailto:hello@example.com",
                    navLinks: [
                        { name: "Home", href: "#top", badge: "", children: [] },
                        { name: "Work", href: "#products", badge: "", children: [] },
                        { name: "Services", href: "#features-1", badge: "", children: [] },
                        { name: "About", href: "#about", badge: "", children: [] },
                    ],
                },
                hero: {
                    variant: "portfolio",
                    eyebrow: "Hi, I'm Alex 👋",
                    title: "I design calm, useful digital products.",
                    subtitle: "Product designer with 8 years of experience helping start-ups turn ideas into products people love.",
                    buttonText: "Say hello",
                    buttonLink: "mailto:hello@example.com",
                    secondaryButtonText: "Download CV",
                    tertiaryButtonText: "See my work",
                    tertiaryButtonLink: "#products",
                },
                products: {
                    eyebrow: "Portfolio", sectionTitle: "Selected work", subtitle: "A few projects I'm proud of.", columns: 3, imageRatio: "landscape", showButton: false, background: "gray",
                    items: [
                        { name: "Fintech dashboard", category: "Product design", price: "2025", image: "", badge: "", link: "#" },
                        { name: "Travel booking app", category: "Mobile app", price: "2024", image: "", badge: "", link: "#" },
                        { name: "Brand refresh", category: "Branding", price: "2024", image: "", badge: "", link: "#" },
                    ],
                },
                about: { eyebrow: "About me", heading: "Designer, tinkerer, coffee person", layout: "image-left", background: "white", features: [{ text: "8 years in product design" }, { text: "Worked with 40+ start-ups" }], stats: [{ value: "40+", label: "Projects" }, { value: "8", label: "Years" }, { value: "12", label: "Awards" }] },
                testimonials: { eyebrow: "Kind words", heading: "What clients say", layout: "cards", background: "gray" },
                footer: { backgroundColor: "slate", description: "Available for freelance projects and full-time roles.", email: "hello@example.com", linksHeading: "Explore" },
                order: ["navbar", "hero", "products", "features-1", "about", "testimonials", "footer"],
                labels: { products: "Work", "features-1": "Services" },
                custom: {
                    "features-1": makeCustomSection("features", {
                        heading: "How I can help", subtitle: "", background: "white",
                        items: [
                            { icon: "puzzle", title: "Product design", description: "From first sketch to polished, shippable screens." },
                            { icon: "sparkles", title: "Brand identity", description: "Logos, colors and type that feel unmistakably you." },
                            { icon: "chat", title: "Design workshops", description: "Get your team aligned and moving in a single day." },
                        ],
                    }),
                },
            }),
    },
    {
        id: "landing",
        label: "SaaS Landing Page",
        desc: "Features, pricing, FAQ and a big CTA",
        tone: "from-violet-300 to-fuchsia-200",
        build: () =>
            toDoc({
                theme: { brand: "violet", font: "inter", pageBackground: "white" },
                navbar: {
                    logoName: "Flowly", logoImg: "", logoColor: "violet", loginText: "Log in", signUpText: "Start free trial",
                    navLinks: [
                        { name: "Features", href: "#features-1", badge: "", children: [] },
                        { name: "Pricing", href: "#pricing-1", badge: "", children: [] },
                        { name: "FAQ", href: "#faq-1", badge: "", children: [] },
                    ],
                },
                hero: {
                    variant: "gradient",
                    eyebrow: "Now with AI summaries",
                    title: "Run your whole business from one simple dashboard.",
                    subtitle: "Flowly brings your sales, customers and tasks together so your team can focus on what matters.",
                    buttonText: "Start free trial",
                    buttonLink: "#pricing-1",
                    secondaryButtonText: "See how it works",
                    secondaryButtonLink: "#features-1",
                    gradientPreset: "aurora",
                },
                products: { visible: false },
                about: { visible: false },
                testimonials: { eyebrow: "Loved by teams", heading: "Teams ship faster with Flowly", layout: "cards", background: "gray" },
                footer: { backgroundColor: "slate", description: "The simple way to run your business.", linksHeading: "Product" },
                order: ["navbar", "hero", "features-1", "testimonials", "pricing-1", "faq-1", "cta-1", "footer", "products", "about"],
                labels: { "features-1": "Features", "pricing-1": "Pricing", "faq-1": "FAQ", "cta-1": "Final call to action" },
                custom: {
                    "features-1": makeCustomSection("features", { eyebrow: "Features", heading: "Everything in one place", subtitle: "Stop juggling tools. Flowly keeps it simple.", columns: 3, background: "white",
                        items: [
                            { icon: "bolt", title: "Instant setup", description: "Connect your tools and be up and running in minutes." },
                            { icon: "chat", title: "Team inbox", description: "Every customer message, shared and never missed." },
                            { icon: "badge", title: "Smart reports", description: "See what is working with clear, automatic reports." },
                            { icon: "lock", title: "Private by default", description: "Your data stays yours, protected end to end." },
                            { icon: "globe", title: "Works anywhere", description: "Use it on any device, from anywhere in the world." },
                            { icon: "support", title: "Human support", description: "Talk to a real person whenever you need help." },
                        ] }),
                    "pricing-1": makeCustomSection("pricing", { eyebrow: "Pricing" }),
                    "faq-1": makeCustomSection("faq", { eyebrow: "FAQ", background: "gray" }),
                    "cta-1": makeCustomSection("cta", { heading: "Start your free 14-day trial", subtitle: "No credit card needed. Cancel any time.", buttonText: "Get started free", style: "brand" }),
                },
            }),
    },
];

export const getStarter = (id) => STARTERS.find((s) => s.id === id) || STARTERS[0];
export const buildStarterDoc = (id) => getStarter(id).build();
