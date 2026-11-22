//Common_Templates/Custom/TextBlock.jsx

import { TEXT_ALIGN, sectionTheme, spacingClass } from "../../shared/sectionStyles";

function TextBlock({ eyebrow, heading, body, align = "left", width = "narrow", background = "white", spacing = "normal" }) {
    const t = sectionTheme(background);

    return (
        <section className={`@container ${t.wrap}`}>
            <div className={`mx-auto px-6 ${width === "wide" ? "max-w-5xl" : "max-w-2xl"} ${spacingClass(spacing)} ${TEXT_ALIGN[align] || "text-left"}`}>
                {eyebrow && <p className="text-xs font-bold uppercase tracking-widest text-brand-600">{eyebrow}</p>}
                {heading && <h2 className={`mt-2 text-2xl font-extrabold tracking-tight @xl:text-4xl ${t.heading}`}>{heading}</h2>}
                {body && <p className={`mt-5 whitespace-pre-line text-sm leading-relaxed @xl:text-base ${t.text}`}>{body}</p>}
            </div>
        </section>
    );
}

export default TextBlock;
