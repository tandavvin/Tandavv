//Common_Templates/Custom/Features.jsx

import SectionHeader from "../../shared/SectionHeader";
import { Icon } from "../../shared/icons";
import { gridCols, sectionTheme, spacingClass } from "../../shared/sectionStyles";

function Features({ eyebrow, heading, subtitle, columns = 3, items = [], background = "gray", spacing = "normal" }) {
    const t = sectionTheme(background);

    return (
        <section className={`@container ${t.wrap}`}>
            <div className={`mx-auto max-w-6xl px-6 ${spacingClass(spacing)}`}>
                <SectionHeader eyebrow={eyebrow} heading={heading} subtitle={subtitle} theme={t} />

                <div className={`mt-10 grid gap-5 ${gridCols(columns)}`}>
                    {items.map((item, i) => (
                        <div key={i} className={`rounded-2xl border p-6 transition hover:-translate-y-1 ${t.card} ${t.cardHover}`}>
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                                <Icon name={item.icon} className="h-5 w-5" />
                            </span>
                            <h3 className={`mt-4 text-base font-bold ${t.heading}`}>{item.title}</h3>
                            {item.description && <p className={`mt-2 text-sm leading-relaxed ${t.text}`}>{item.description}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Features;
