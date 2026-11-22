//Common_Templates/Hero/Centered.jsx

import { HiArrowRight, HiCheckCircle } from "react-icons/hi";
import SmartLink from "../../shared/SmartLink";
import HeroShell from "./HeroShell";

function Centered({
    eyebrow, title, subtitle, buttonText, buttonLink, secondaryButtonText, secondaryButtonLink,
    bullets = [], height, bgImage, overlay,
}) {
    return (
        <HeroShell
            tone="light"
            baseClass="bg-white"
            bgImage={bgImage}
            overlay={overlay}
            height={height}
            backdrop={
                <div
                    className="pointer-events-none absolute inset-0 -z-10 opacity-60"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, rgb(0 0 0 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgb(0 0 0 / 0.04) 1px, transparent 1px)",
                        backgroundSize: "36px 36px",
                        maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
                        WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
                    }}
                />
            }
        >
            <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-16 text-center @xl:py-28">
                {eyebrow && <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 ring-1 ring-brand-200">{eyebrow}</span>}

                <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 @xl:text-5xl @4xl:text-6xl">{title}</h1>
                {subtitle && <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-600 @xl:text-lg">{subtitle}</p>}

                {(buttonText || secondaryButtonText) && (
                    <div className="mt-8 flex flex-col items-center gap-3 @md:flex-row">
                        {buttonText && (
                            <SmartLink href={buttonLink} className="group inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">
                                {buttonText}
                                <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </SmartLink>
                        )}
                        {secondaryButtonText && (
                            <SmartLink href={secondaryButtonLink} className="rounded-full px-6 py-3 text-sm font-semibold text-gray-700 transition hover:text-brand-600">
                                {secondaryButtonText}
                            </SmartLink>
                        )}
                    </div>
                )}

                {bullets.length > 0 && (
                    <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
                        {bullets.map((item, i) => (
                            <li key={i} className="inline-flex items-center gap-1.5">
                                <HiCheckCircle className="h-4 w-4 text-emerald-500" /> {item.text}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </HeroShell>
    );
}

export default Centered;
