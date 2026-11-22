//Common_Templates/Hero/Gradient.jsx

import { HiArrowRight, HiLightningBolt } from "react-icons/hi";
import SmartLink from "../../shared/SmartLink";
import HeroShell from "./HeroShell";

const PRESETS = {
    sunset: { b1: "bg-brand-500/40", b2: "bg-fuchsia-600/30", b3: "bg-indigo-600/30", text: "from-white via-brand-200 to-fuchsia-300", btn: "from-brand-500 to-fuchsia-600", chip: "text-brand-200" },
    ocean: { b1: "bg-sky-500/40", b2: "bg-teal-500/30", b3: "bg-blue-700/30", text: "from-white via-sky-200 to-teal-300", btn: "from-sky-500 to-teal-500", chip: "text-sky-200" },
    aurora: { b1: "bg-emerald-500/40", b2: "bg-violet-600/30", b3: "bg-teal-600/30", text: "from-white via-emerald-200 to-violet-300", btn: "from-emerald-500 to-violet-600", chip: "text-emerald-200" },
    candy: { b1: "bg-pink-500/40", b2: "bg-indigo-500/30", b3: "bg-rose-600/30", text: "from-white via-pink-200 to-indigo-300", btn: "from-pink-500 to-indigo-600", chip: "text-pink-200" },
};

function Gradient({
    eyebrow, title, subtitle, buttonText, buttonLink, secondaryButtonText, secondaryButtonLink,
    gradientPreset = "sunset", height, bgImage, overlay,
}) {
    const p = PRESETS[gradientPreset] || PRESETS.sunset;

    return (
        <HeroShell
            tone="dark"
            baseClass="bg-slate-950"
            bgImage={bgImage}
            overlay={overlay}
            height={height}
            backdrop={
                <>
                    <div className={`pointer-events-none absolute -left-24 top-0 -z-10 h-80 w-80 rounded-full blur-3xl ${p.b1}`} />
                    <div className={`pointer-events-none absolute right-0 top-20 -z-10 h-96 w-96 rounded-full blur-3xl ${p.b2}`} />
                    <div className={`pointer-events-none absolute bottom-0 left-1/3 -z-10 h-72 w-72 rounded-full blur-3xl ${p.b3}`} />
                </>
            }
        >
            <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-16 text-center @xl:py-28">
                {eyebrow && (
                    <span className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur ${p.chip}`}>
                        <HiLightningBolt className="h-3.5 w-3.5" /> {eyebrow}
                    </span>
                )}

                <h1 className={`mt-6 bg-gradient-to-r bg-clip-text text-3xl font-extrabold leading-tight tracking-tight text-transparent @xl:text-5xl @4xl:text-6xl ${p.text}`}>{title}</h1>
                {subtitle && <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 @xl:text-lg">{subtitle}</p>}

                {(buttonText || secondaryButtonText) && (
                    <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                        {buttonText && (
                            <SmartLink href={buttonLink} className={`group inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 ${p.btn}`}>
                                {buttonText}
                                <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </SmartLink>
                        )}
                        {secondaryButtonText && (
                            <SmartLink href={secondaryButtonLink} className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10">
                                {secondaryButtonText}
                            </SmartLink>
                        )}
                    </div>
                )}
            </div>
        </HeroShell>
    );
}

export default Gradient;
