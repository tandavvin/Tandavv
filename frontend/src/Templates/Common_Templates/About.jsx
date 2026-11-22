//Common_Templates/About.jsx
//
// layout: "image-left" | "image-right" | "centered"

import { HiCheckCircle, HiPhotograph } from "react-icons/hi";
import SmartLink from "../shared/SmartLink";
import { sectionTheme, spacingClass } from "../shared/sectionStyles";

function About({
    eyebrow, heading, description, image, layout = "image-left", features = [], stats = [],
    buttonText, buttonLink, background = "gray", spacing = "normal",
}) {
    const t = sectionTheme(background);
    const centered = layout === "centered";
    const imageRight = layout === "image-right";

    const picture = (
        <div className={`relative overflow-hidden rounded-3xl shadow-xl ${centered ? "aspect-[16/8] w-full" : "aspect-[4/3]"}`}>
            {image ? (
                <img src={image} alt={heading} className="h-full w-full object-cover" />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-200 via-amber-100 to-rose-100">
                    <HiPhotograph className="h-16 w-16 text-brand-400/80" />
                </div>
            )}
        </div>
    );

    const text = (
        <div className={centered ? "mx-auto max-w-2xl" : ""}>
            {eyebrow && <p className="text-xs font-bold uppercase tracking-widest text-brand-600">{eyebrow}</p>}
            {heading && <h2 className={`mt-2 text-2xl font-extrabold leading-tight tracking-tight @xl:text-4xl ${t.heading}`}>{heading}</h2>}
            {description && <p className={`mt-4 whitespace-pre-line text-sm leading-relaxed @xl:text-base ${t.text}`}>{description}</p>}

            {features.length > 0 && (
                <ul className={`mt-5 space-y-2 text-sm ${t.text} ${centered ? "mx-auto inline-block text-left" : ""}`}>
                    {features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <HiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" /> {f.text}
                        </li>
                    ))}
                </ul>
            )}

            {stats.length > 0 && (
                <dl
                    className={`mt-7 grid gap-5 border-t pt-6 ${t.line}`}
                    style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0, 1fr))` }}
                >
                    {stats.map((s, i) => (
                        <div key={i}>
                            <dt className={`text-xl font-extrabold @xl:text-3xl ${t.heading}`}>{s.value}</dt>
                            <dd className={`text-xs ${t.muted}`}>{s.label}</dd>
                        </div>
                    ))}
                </dl>
            )}

            {buttonText && (
                <SmartLink href={buttonLink} className="mt-7 inline-block rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-700">
                    {buttonText}
                </SmartLink>
            )}
        </div>
    );

    return (
        <section className={`@container ${t.wrap}`}>
            {centered ? (
                <div className={`mx-auto flex max-w-4xl flex-col items-center gap-10 px-6 text-center ${spacingClass(spacing)}`}>
                    {picture}
                    {text}
                </div>
            ) : (
                <div className={`mx-auto grid max-w-6xl items-center gap-10 px-6 @2xl:grid-cols-2 @2xl:gap-14 ${spacingClass(spacing)}`}>
                    <div className={imageRight ? "@2xl:order-2" : ""}>{picture}</div>
                    {text}
                </div>
            )}
        </section>
    );
}

export default About;
