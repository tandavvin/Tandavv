//Common_Templates/Testimonials.jsx
//
// layout: "cards" (grid of review cards) | "quotes" (large centered quotes)

import { HiStar } from "react-icons/hi";
import SectionHeader from "../shared/SectionHeader";
import { sectionTheme, spacingClass } from "../shared/sectionStyles";

function Stars({ rating = 5 }) {
    return (
        <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((n) => (
                <HiStar key={n} className={`h-4 w-4 ${n <= rating ? "text-amber-400" : "text-gray-300"}`} />
            ))}
        </div>
    );
}

function Avatar({ name, src }) {
    if (src) return <img src={src} alt={name} className="h-10 w-10 shrink-0 rounded-full object-cover" />;
    const initials = (name || "?").split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-amber-400 text-sm font-bold text-white">
            {initials}
        </div>
    );
}

function Testimonials({
    eyebrow, heading, subtitle, layout = "cards", showRatings = true, items = [], emptyText,
    background = "white", spacing = "normal",
}) {
    const t = sectionTheme(background);

    return (
        <section className={`@container ${t.wrap}`}>
            <div className={`mx-auto max-w-6xl px-6 ${spacingClass(spacing)}`}>
                <SectionHeader eyebrow={eyebrow} heading={heading} subtitle={subtitle} theme={t} />

                {items.length === 0 ? (
                    emptyText ? <p className={`mt-10 text-center text-sm ${t.muted}`}>{emptyText}</p> : null
                ) : layout === "quotes" ? (
                    <div className="mx-auto mt-12 max-w-3xl space-y-10">
                        {items.map((item, i) => (
                            <figure key={i} className="text-center">
                                {showRatings && <div className="flex justify-center"><Stars rating={item.rating} /></div>}
                                <blockquote className={`mt-4 text-base font-medium leading-relaxed @xl:text-xl ${t.heading}`}>“{item.review}”</blockquote>
                                <figcaption className="mt-5 flex items-center justify-center gap-3">
                                    <Avatar name={item.name} src={item.avatar} />
                                    <div className="text-left">
                                        <p className={`text-sm font-bold ${t.heading}`}>{item.name}</p>
                                        {item.role && <p className={`text-xs ${t.muted}`}>{item.role}</p>}
                                    </div>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                ) : (
                    <div className="mt-10 grid grid-cols-1 gap-5 @md:grid-cols-2 @3xl:grid-cols-3">
                        {items.map((item, i) => (
                            <figure key={i} className={`flex flex-col rounded-2xl border p-5 shadow-sm transition hover:-translate-y-1 ${t.card} ${t.cardHover}`}>
                                {showRatings && <Stars rating={item.rating} />}
                                <blockquote className={`mt-3 flex-1 text-sm leading-relaxed ${t.text}`}>“{item.review}”</blockquote>
                                <figcaption className="mt-5 flex items-center gap-3">
                                    <Avatar name={item.name} src={item.avatar} />
                                    <div>
                                        <p className={`text-sm font-bold ${t.heading}`}>{item.name}</p>
                                        {item.role && <p className={`text-xs ${t.muted}`}>{item.role}</p>}
                                    </div>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Testimonials;
