//Common_Templates/Hero/Video.jsx
//
// A full-bleed background video (paste an .mp4 URL in the editor). Without a video it falls back to
// the background image, or to an animated gradient, so it never looks empty.

import { HiArrowRight, HiPlay } from "react-icons/hi";
import SmartLink from "../../shared/SmartLink";
import { ITEMS_ALIGN, JUSTIFY_ALIGN, TEXT_ALIGN } from "../../shared/sectionStyles";
import HeroShell from "./HeroShell";

function Video({
    eyebrow, title, subtitle, buttonText, buttonLink, secondaryButtonText, secondaryButtonLink,
    videoSrc, poster, bgImage, overlay = 55, height, align = "left",
}) {
    const strength = Math.min(100, Math.max(0, Number(overlay) || 0)) / 100;

    let backdrop = null;
    if (videoSrc) {
        backdrop = (
            <>
                <video className="absolute inset-0 -z-20 h-full w-full object-cover" autoPlay muted loop playsInline poster={poster || undefined} src={videoSrc} />
                <div className="absolute inset-0 -z-10" style={{ background: `rgba(0,0,0,${strength})` }} />
            </>
        );
    } else if (!bgImage) {
        backdrop = (
            <>
                <div className="absolute inset-0 -z-20 animate-pulse bg-gradient-to-br from-brand-700 via-neutral-900 to-indigo-900" />
                <div className="absolute inset-0 -z-10" style={{ background: `rgba(0,0,0,${strength * 0.6})` }} />
            </>
        );
    }

    return (
        <HeroShell tone="dark" baseClass="bg-neutral-900" bgImage={videoSrc ? "" : bgImage} overlay={overlay} height={height || "md"} backdrop={backdrop}>
            <div className={`relative mx-auto flex max-w-5xl flex-col px-6 py-14 ${ITEMS_ALIGN[align] || ""} ${TEXT_ALIGN[align] || ""}`}>
                {eyebrow && <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{eyebrow}</span>}

                <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white @xl:text-5xl @4xl:text-6xl">{title}</h1>
                {subtitle && <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-200 @xl:text-lg">{subtitle}</p>}

                {(buttonText || secondaryButtonText) && (
                    <div className={`mt-8 flex flex-wrap items-center gap-4 ${JUSTIFY_ALIGN[align] || ""}`}>
                        {buttonText && (
                            <SmartLink href={buttonLink} className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-700">
                                {buttonText}
                                <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </SmartLink>
                        )}
                        {secondaryButtonText && (
                            <SmartLink href={secondaryButtonLink} className="inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-brand-300">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                                    <HiPlay className="h-5 w-5" />
                                </span>
                                {secondaryButtonText}
                            </SmartLink>
                        )}
                    </div>
                )}
            </div>
        </HeroShell>
    );
}

export default Video;
