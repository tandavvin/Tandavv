//Common_Templates/Custom/Faq.jsx

import SectionHeader from "../../shared/SectionHeader";
import { sectionTheme, spacingClass } from "../../shared/sectionStyles";

function Faq({ eyebrow, heading, subtitle, items = [], openFirst = true, background = "white", spacing = "normal" }) {
    const t = sectionTheme(background);

    return (
        <section className={`@container ${t.wrap}`}>
            <div className={`mx-auto max-w-3xl px-6 ${spacingClass(spacing)}`}>
                <SectionHeader eyebrow={eyebrow} heading={heading} subtitle={subtitle} theme={t} />

                <div className="mt-10 space-y-3">
                    {items.map((item, i) => (
                        <details key={i} open={openFirst && i === 0} className={`group rounded-xl border px-5 py-4 ${t.card}`}>
                            <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold @xl:text-base ${t.heading} [&::-webkit-details-marker]:hidden`}>
                                {item.question}
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600 transition group-open:rotate-45" aria-hidden="true">+</span>
                            </summary>
                            <p className={`mt-3 whitespace-pre-line text-sm leading-relaxed ${t.text}`}>{item.answer}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Faq;
