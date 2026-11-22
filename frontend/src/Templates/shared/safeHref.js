// src/Templates/shared/safeHref.js
//
// Links come from user-editable settings and end up on public pages, so they are normalised:
//   https://..., mailto:, tel:, #anchor and /route are kept; "example.com" becomes https://example.com;
//   anything with another scheme (javascript:, data:, ...) becomes "#".

export function safeHref(value) {
    const href = String(value ?? "").trim();
    if (!href) return "#";
    if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
    if (href.startsWith("#") || href.startsWith("/")) return href;
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return "#"; // some other scheme: block it
    if (/^[\w-]+(\.[\w-]+)+(\/|$)/.test(href)) return `https://${href}`;
    return `/${href}`;
}

export const isExternalHref = (href) => /^https?:/i.test(href);
export const isPlainAnchorHref = (href) => href.startsWith("#") || /^(mailto:|tel:)/i.test(href);
