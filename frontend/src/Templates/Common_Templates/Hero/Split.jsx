//Common_Templates/Hero/Split.jsx

import { HiArrowRight, HiTrendingUp } from "react-icons/hi";
import SmartLink from "../../shared/SmartLink";
import HeroShell from "./HeroShell";

// "40, 65, 50" -> [40, 65, 50]  (clamped to 0-100, max 14 bars)
const parseBars = (text) =>
    String(text ?? "")
        .split(/[,\s]+/)
        .map((n) => Number(n))
        .filter((n) => Number.isFinite(n))
        .slice(0, 14)
        .map((n) => Math.min(100, Math.max(4, n)));

function Split({
    eyebrow, title, subtitle, buttonText, buttonLink, secondaryButtonText, secondaryButtonLink,
    image, splitLabel, splitValue, splitTrend, splitBars, splitMetrics = [], height, bgImage, overlay,
}) {
    const bars = parseBars(splitBars);
    const highlight = Math.max(0, bars.length - 2);

    return (
        <HeroShell tone="light" baseClass="bg-white" bgImage={bgImage} overlay={overlay} height={height}>
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 @2xl:grid-cols-2 @2xl:py-20">
                <div>
                    {eyebrow && <p className="text-xs font-bold uppercase tracking-widest text-brand-600">{eyebrow}</p>}
                    <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 @xl:text-4xl @4xl:text-5xl">{title}</h1>
                    {subtitle && <p className="mt-4 text-sm leading-relaxed text-gray-600 @xl:text-base">{subtitle}</p>}

                    {(buttonText || secondaryButtonText) && (
                        <div className="mt-7 flex flex-wrap gap-3">
                            {buttonText && (
                                <SmartLink href={buttonLink} className="group inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-700">
                                    {buttonText}
                                    <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </SmartLink>
                            )}
                            {secondaryButtonText && (
                                <SmartLink href={secondaryButtonLink} className="rounded-xl border border-gray-300 bg-white/80 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                                    {secondaryButtonText}
                                </SmartLink>
                            )}
                        </div>
                    )}
                </div>

                <div className="relative">
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand-200 via-amber-100 to-transparent blur-2xl" />
                    {image ? (
                        <img src={image} alt="" className="relative aspect-[4/3] w-full rounded-2xl object-cover shadow-2xl" />
                    ) : (
                        <div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    {splitLabel && <p className="text-xs text-gray-500">{splitLabel}</p>}
                                    {splitValue && <p className="text-2xl font-bold text-gray-900">{splitValue}</p>}
                                </div>
                                {splitTrend && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                                        <HiTrendingUp className="h-3.5 w-3.5" /> {splitTrend}
                                    </span>
                                )}
                            </div>

                            {bars.length > 0 && (
                                <div className="mt-6 flex h-32 items-end gap-2">
                                    {bars.map((h, i) => (
                                        <div key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-t-md ${i === highlight ? "bg-brand-500" : "bg-brand-100"}`} />
                                    ))}
                                </div>
                            )}

                            {splitMetrics.length > 0 && (
                                <div className="mt-4 grid gap-3 text-xs" style={{ gridTemplateColumns: `repeat(${Math.min(splitMetrics.length, 3)}, minmax(0, 1fr))` }}>
                                    {splitMetrics.map((m, i) => (
                                        <div key={i} className="rounded-lg bg-gray-50 p-3">
                                            <p className="text-gray-500">{m.label}</p>
                                            <p className="mt-0.5 text-base font-bold text-gray-900">{m.value}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </HeroShell>
    );
}

export default Split;
