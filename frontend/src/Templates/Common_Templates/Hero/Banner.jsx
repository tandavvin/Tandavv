//Common_Templates/Hero/Banner.jsx

import { HiArrowRight, HiSparkles } from "react-icons/hi";
import SmartLink from "../../shared/SmartLink";
import { ITEMS_ALIGN, JUSTIFY_ALIGN, TEXT_ALIGN } from "../../shared/sectionStyles";
import HeroShell from "./HeroShell";

function Banner({
    eyebrow, title, subtitle, buttonText, buttonLink, secondaryButtonText, secondaryButtonLink,
    stats = [], align = "left", height, bgImage, overlay,
}) {
    return (
        <HeroShell
            tone="light"
            baseClass="bg-gradient-to-br from-brand-50 via-white to-amber-50"
            bgImage={bgImage}
            overlay={overlay}
            height={height}
            backdrop={
                <>
                    <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-brand-200/60 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl" />
                </>
            }
        >
            <div className={`relative mx-auto flex max-w-5xl flex-col px-6 py-16 @xl:py-24 ${ITEMS_ALIGN[align] || ""} ${TEXT_ALIGN[align] || ""}`}>
                {eyebrow && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white/80 px-3 py-1 text-xs font-semibold text-brand-600 shadow-xs">
                        <HiSparkles className="h-3.5 w-3.5" /> {eyebrow}
                    </span>
                )}

                <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-gray-900 @xl:text-5xl @4xl:text-6xl">{title}</h1>
                {subtitle && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 @xl:text-lg">{subtitle}</p>}

                {(buttonText || secondaryButtonText) && (
                    <div className={`mt-8 flex flex-wrap items-center gap-3 ${JUSTIFY_ALIGN[align] || ""}`}>
                        {buttonText && (
                            <SmartLink href={buttonLink} className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700">
                                {buttonText}
                                <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </SmartLink>
                        )}
                        {secondaryButtonText && (
                            <SmartLink href={secondaryButtonLink} className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-brand-300 hover:text-brand-600">
                                {secondaryButtonText}
                            </SmartLink>
                        )}
                    </div>
                )}

                {stats.length > 0 && (
                    <dl
                        className="mt-12 grid max-w-xl gap-6 border-t border-brand-100 pt-6"
                        style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0, 1fr))` }}
                    >
                        {stats.map((stat, i) => (
                            <div key={i}>
                                <dt className="text-xl font-bold text-gray-900 @xl:text-2xl">{stat.value}</dt>
                                <dd className="text-xs text-gray-500">{stat.label}</dd>
                            </div>
                        ))}
                    </dl>
                )}
            </div>
        </HeroShell>
    );
}

export default Banner;
