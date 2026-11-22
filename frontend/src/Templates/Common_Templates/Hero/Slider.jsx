//Common_Templates/Hero/Slider.jsx
//
// Full-screen image hero with a "Popular Places" card carousel.

import { useRef } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import SmartLink from "../../shared/SmartLink";
import { SocialIcon } from "../../shared/socialIcons";
import HeroShell from "./HeroShell";

const FALLBACK_TONES = [
    "from-sky-500 via-orange-400 to-amber-600",
    "from-indigo-700 via-purple-600 to-rose-500",
    "from-slate-400 via-slate-500 to-emerald-700",
    "from-teal-600 via-emerald-700 to-slate-900",
];

function Slider({
    eyebrow, title, subtitle, buttonText, buttonLink, bgImage, overlay = 55, height,
    sliderHeading, places = [], socials = [],
}) {
    const trackRef = useRef(null);

    const scrollCards = (direction) => {
        const el = trackRef.current;
        if (!el) return;
        const step = (el.firstElementChild?.getBoundingClientRect().width || 200) + 16;
        el.scrollBy({ left: direction * step, behavior: "smooth" });
    };

    return (
        <HeroShell
            tone="dark"
            baseClass="bg-slate-900"
            bgImage={bgImage}
            overlay={overlay}
            height={height}
            backdrop={
                !bgImage ? (
                    <>
                        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-sky-900 via-brand-400 to-slate-800" />
                        <div className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-t from-slate-900 via-slate-700/70 to-transparent" />
                    </>
                ) : null
            }
        >
            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-black/50 via-black/10 to-transparent" />

            <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 @2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] @2xl:py-16">
                {/* Left: socials + text */}
                <div className="relative flex gap-5 @2xl:pl-2">
                    {socials.length > 0 && (
                        <div className="hidden flex-col items-center gap-5 @xl:flex">
                            <span className="h-40 w-px bg-white/70" />
                            <div className="flex flex-col gap-4 text-white/90">
                                {socials.map((s, i) => (
                                    <SmartLink key={i} href={s.url} aria-label={s.platform} className="transition hover:text-brand-300">
                                        <SocialIcon platform={s.platform} className="h-3.5 w-3.5" />
                                    </SmartLink>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="max-w-md">
                        <span className="block h-1 w-14 rounded-full bg-white" />
                        {eyebrow && <p className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-white/90 @xl:text-sm">{eyebrow}</p>}
                        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight @xl:text-4xl @4xl:text-5xl">{title}</h1>
                        {subtitle && <p className="mt-4 text-sm leading-relaxed text-white/85 @xl:text-base">{subtitle}</p>}

                        {buttonText && (
                            <SmartLink href={buttonLink} className="mt-7 inline-block rounded-full border border-white/80 px-7 py-2.5 text-sm font-medium text-white transition hover:bg-white hover:text-gray-900">
                                {buttonText}
                            </SmartLink>
                        )}
                    </div>
                </div>

                {/* Right: card carousel */}
                {places.length > 0 && (
                    <div className="min-w-0">
                        {sliderHeading && (
                            <div className="mb-4 flex justify-end">
                                <span className="border-b-2 border-brand-400 pb-0.5 text-sm font-semibold text-brand-200">{sliderHeading}</span>
                            </div>
                        )}

                        <div ref={trackRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {places.map((place, i) => (
                                <article key={i} className="group relative h-64 w-40 shrink-0 snap-start overflow-hidden rounded-xl shadow-xl @xl:h-80 @xl:w-48">
                                    {place.image ? (
                                        <img src={place.image} alt={place.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className={`absolute inset-0 bg-gradient-to-b ${FALLBACK_TONES[i % FALLBACK_TONES.length]} transition duration-500 group-hover:scale-110`} />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    <div className="absolute inset-x-0 bottom-0 p-3.5">
                                        <span className="block h-0.5 w-9 bg-white" />
                                        {place.tag && <p className="mt-2 text-[10px] uppercase tracking-wide text-white/80">{place.tag}</p>}
                                        <h3 className="mt-0.5 text-sm font-bold leading-snug @xl:text-base">{place.title}</h3>
                                        {place.description && <p className="mt-1.5 line-clamp-3 text-[10px] leading-snug text-white/75">{place.description}</p>}
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="mt-5 flex justify-center gap-4 @2xl:justify-start">
                            <button type="button" onClick={() => scrollCards(-1)} aria-label="Previous" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/80 transition hover:bg-white hover:text-gray-900 cursor-pointer">
                                <HiChevronLeft className="h-5 w-5" />
                            </button>
                            <button type="button" onClick={() => scrollCards(1)} aria-label="Next" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/80 transition hover:bg-white hover:text-gray-900 cursor-pointer">
                                <HiChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </HeroShell>
    );
}

export default Slider;
