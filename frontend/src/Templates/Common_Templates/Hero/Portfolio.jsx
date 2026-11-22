//Common_Templates/Hero/Portfolio.jsx

import { HiCode, HiDownload, HiMail, HiSparkles } from "react-icons/hi";
import SmartLink from "../../shared/SmartLink";
import HeroShell from "./HeroShell";

function Portfolio({
    eyebrow, title, subtitle, buttonText, buttonLink, secondaryButtonText, secondaryButtonLink,
    tertiaryButtonText, tertiaryButtonLink, avatarSrc, skills = [], availableText, height, bgImage, overlay,
}) {
    return (
        <HeroShell tone="light" baseClass="bg-white" bgImage={bgImage} overlay={overlay} height={height}>
            <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-14 @2xl:grid-cols-[auto_1fr] @2xl:gap-14 @2xl:py-20">
                <div className="mx-auto @2xl:mx-0">
                    <div className="relative">
                        <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-brand-400 via-amber-300 to-rose-400 opacity-80 blur-md" />
                        <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-brand-100 to-amber-50 shadow-xl @xl:h-52 @xl:w-52">
                            {avatarSrc ? <img src={avatarSrc} alt="Profile" className="h-full w-full object-cover" /> : <HiSparkles className="h-16 w-16 text-brand-500" />}
                        </div>
                        {availableText && (
                            <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white shadow">
                                <span className="h-1.5 w-1.5 rounded-full bg-white" /> {availableText}
                            </span>
                        )}
                    </div>
                </div>

                <div className="text-center @2xl:text-left">
                    {eyebrow && <p className="text-sm font-semibold text-brand-600">{eyebrow}</p>}
                    <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 @xl:text-4xl @4xl:text-5xl">{title}</h1>
                    {subtitle && <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600 @xl:text-base">{subtitle}</p>}

                    {skills.length > 0 && (
                        <div className="mt-5 flex flex-wrap justify-center gap-2 @2xl:justify-start">
                            {skills.map((skill, i) => (
                                <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{skill.text}</span>
                            ))}
                        </div>
                    )}

                    {(buttonText || secondaryButtonText || tertiaryButtonText) && (
                        <div className="mt-7 flex flex-wrap justify-center gap-3 @2xl:justify-start">
                            {buttonText && (
                                <SmartLink href={buttonLink} className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-700">
                                    <HiMail className="h-4 w-4" /> {buttonText}
                                </SmartLink>
                            )}
                            {secondaryButtonText && (
                                <SmartLink href={secondaryButtonLink} className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                                    <HiDownload className="h-4 w-4" /> {secondaryButtonText}
                                </SmartLink>
                            )}
                            {tertiaryButtonText && (
                                <SmartLink href={tertiaryButtonLink} className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-gray-500 transition hover:text-brand-600">
                                    <HiCode className="h-4 w-4" /> {tertiaryButtonText}
                                </SmartLink>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </HeroShell>
    );
}

export default Portfolio;
