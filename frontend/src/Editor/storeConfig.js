//Editor/storeConfig.js
//


import { mergeNavbar } from "./navbarConfig";
import { mergeHero } from "./heroConfig";
import { mergeProducts, mergeAbout, mergeTestimonials, mergeFooter } from "./sectionsConfig";
import { mergeCustomSection } from "./customSectionsConfig";
import { mergeSeo } from "./siteConfig";
import { mergeTheme } from "../utils/theme";

export const CORE_SECTIONS = [
    { id: "navbar", label: "Navbar" },
    { id: "hero", label: "Hero" },
    { id: "products", label: "Products" },
    { id: "about", label: "About" },
    { id: "testimonials", label: "Reviews" },
    { id: "footer", label: "Footer" },
];
export const CORE_IDS = new Set(CORE_SECTIONS.map((s) => s.id));

// keeps core sections, keeps custom sections that really have settings, appends anything missing
export function normalizeSections(saved, custom = {}) {
    const out = [];
    const seen = new Set();

    for (const item of Array.isArray(saved) ? saved : []) {
        if (!item || typeof item.id !== "string" || seen.has(item.id)) continue;
        if (CORE_IDS.has(item.id)) {
            out.push({ id: item.id, label: item.label || CORE_SECTIONS.find((s) => s.id === item.id).label });
            seen.add(item.id);
        } else if (custom && custom[item.id]) {
            out.push({ id: item.id, label: item.label || item.id, type: custom[item.id].type });
            seen.add(item.id);
        }
    }

    if (out.length === 0) return CORE_SECTIONS.map((s) => ({ ...s }));
    for (const core of CORE_SECTIONS) {
        if (!seen.has(core.id)) out.push({ ...core });
    }
    return out;
}

export function configFromDoc(doc = {}) {
    const rawCustom = doc.customSections && typeof doc.customSections === "object" ? doc.customSections : {};
    const sections = normalizeSections(doc.sectionsOrder, rawCustom);

    const custom = {};
    for (const s of sections) {
        if (!CORE_IDS.has(s.id)) custom[s.id] = mergeCustomSection(rawCustom[s.id]);
    }

    return {
        storeName: doc.storeName || "My Store",
        navbar: mergeNavbar(doc.navbar),
        hero: mergeHero(doc.hero),
        products: mergeProducts(doc.products),
        about: mergeAbout(doc.about),
        testimonials: mergeTestimonials(doc.testimonials),
        footer: mergeFooter(doc.footer),
        theme: mergeTheme(doc.theme),
        seo: mergeSeo(doc.seo),
        sections,
        custom,
    };
}

// what we send to the server (auto-save)
export function configToPayload(config) {
    return {
        storeName: config.storeName,
        navbar: config.navbar,
        hero: config.hero,
        products: config.products,
        about: config.about,
        testimonials: config.testimonials,
        footer: config.footer,
        theme: config.theme,
        seo: config.seo,
        sectionsOrder: config.sections,
        customSections: config.custom,
    };
}
