// src/Templates/shared/SectionHeader.jsx

import { MAX_W_ALIGN, TEXT_ALIGN } from "./sectionStyles";

function SectionHeader({ eyebrow, heading, subtitle, theme, align = "center" }) {
    if (!eyebrow && !heading && !subtitle) return null;
    return (
        <div className={`max-w-2xl ${MAX_W_ALIGN[align] || ""} ${TEXT_ALIGN[align] || "text-center"}`}>
            {eyebrow && <p className="text-xs font-bold uppercase tracking-widest text-brand-600">{eyebrow}</p>}
            {heading && <h2 className={`mt-2 text-2xl font-extrabold tracking-tight @xl:text-4xl ${theme.heading}`}>{heading}</h2>}
            {subtitle && <p className={`mt-3 text-sm @xl:text-base ${theme.text}`}>{subtitle}</p>}
        </div>
    );
}

export default SectionHeader;
