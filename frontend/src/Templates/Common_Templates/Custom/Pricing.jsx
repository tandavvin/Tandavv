//Common_Templates/Custom/Pricing.jsx

import { HiCheckCircle } from "react-icons/hi";
import SectionHeader from "../../shared/SectionHeader";
import SmartLink from "../../shared/SmartLink";
import { gridCols, sectionTheme, spacingClass } from "../../shared/sectionStyles";

function Pricing({ eyebrow, heading, subtitle, plans = [], background = "gray", spacing = "normal" }) {
    const t = sectionTheme(background);

    return (
        <section className={`@container ${t.wrap}`}>
            <div className={`mx-auto max-w-6xl px-6 ${spacingClass(spacing)}`}>
                <SectionHeader eyebrow={eyebrow} heading={heading} subtitle={subtitle} theme={t} />

                <div className={`mt-12 grid items-stretch gap-6 ${gridCols(Math.min(Math.max(plans.length, 1), 3))}`}>
                    {plans.map((plan, i) => {
                        const lines = String(plan.features || "").split("\n").map((l) => l.trim()).filter(Boolean);
                        return (
                            <div
                                key={i}
                                className={`relative flex flex-col rounded-2xl border p-7 ${
                                    plan.highlighted ? "border-brand-500 bg-white shadow-xl ring-2 ring-brand-500/30 @2xl:-translate-y-2" : `${t.card}`
                                }`}
                            >
                                {plan.badge && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">{plan.badge}</span>
                                )}
                                <h3 className={`text-lg font-bold ${plan.highlighted ? "text-gray-900" : t.heading}`}>{plan.name}</h3>
                                {plan.description && <p className={`mt-1 text-sm ${plan.highlighted ? "text-gray-600" : t.text}`}>{plan.description}</p>}
                                <p className="mt-5 flex items-end gap-1">
                                    <span className={`text-4xl font-extrabold tracking-tight ${plan.highlighted ? "text-gray-900" : t.heading}`}>{plan.price}</span>
                                    {plan.period && <span className={`pb-1 text-sm ${plan.highlighted ? "text-gray-500" : t.muted}`}>{plan.period}</span>}
                                </p>

                                <ul className={`mt-6 flex-1 space-y-3 text-sm ${plan.highlighted ? "text-gray-700" : t.text}`}>
                                    {lines.map((line, j) => (
                                        <li key={j} className="flex items-start gap-2">
                                            <HiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" /> {line}
                                        </li>
                                    ))}
                                </ul>

                                {plan.buttonText && (
                                    <SmartLink
                                        href={plan.buttonLink}
                                        className={`mt-7 block rounded-full px-5 py-3 text-center text-sm font-semibold transition ${
                                            plan.highlighted ? "bg-brand-600 text-white shadow-md hover:bg-brand-700" : t.dark ? "bg-white text-gray-900 hover:bg-brand-50" : "bg-gray-900 text-white hover:bg-brand-600"
                                        }`}
                                    >
                                        {plan.buttonText}
                                    </SmartLink>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default Pricing;
