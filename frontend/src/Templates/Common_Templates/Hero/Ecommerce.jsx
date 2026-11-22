//Common_Templates/Hero/Ecommerce.jsx

import { HiArrowRight, HiHeart, HiShieldCheck, HiShoppingBag, HiTruck } from "react-icons/hi";
import SmartLink from "../../shared/SmartLink";
import HeroShell from "./HeroShell";

const PERK_ICONS = [HiTruck, HiShieldCheck, HiHeart];
const TONES = [
    "from-brand-100 to-amber-50",
    "from-sky-100 to-indigo-50",
    "from-rose-100 to-pink-50",
    "from-emerald-100 to-lime-50",
];

function Ecommerce({
    eyebrow, title, subtitle, buttonText, buttonLink, secondaryButtonText, secondaryButtonLink,
    perks = [], tiles = [], height, bgImage, overlay,
}) {
    return (
        <HeroShell tone="light" baseClass="bg-gradient-to-br from-amber-50 via-white to-brand-50" bgImage={bgImage} overlay={overlay} height={height}>
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 @2xl:grid-cols-2 @2xl:py-20">
                <div>
                    {eyebrow && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">
                            <HiShoppingBag className="h-3.5 w-3.5" /> {eyebrow}
                        </span>
                    )}
                    <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 @xl:text-4xl @4xl:text-5xl">{title}</h1>
                    {subtitle && <p className="mt-4 text-sm leading-relaxed text-gray-600 @xl:text-base">{subtitle}</p>}

                    {(buttonText || secondaryButtonText) && (
                        <div className="mt-7 flex flex-wrap items-center gap-3">
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

                    {perks.length > 0 && (
                        <ul className="mt-8 grid grid-cols-1 gap-3 text-xs font-medium text-gray-600 @md:grid-cols-3">
                            {perks.map((perk, i) => {
                                const Icon = PERK_ICONS[i % PERK_ICONS.length];
                                return (
                                    <li key={i} className="flex items-center gap-2">
                                        <Icon className="h-4 w-4 shrink-0 text-brand-500" /> {perk.text}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {tiles.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 @xl:gap-4">
                        {tiles.map((tile, i) => (
                            <div key={i} className={`group relative overflow-hidden rounded-2xl border border-white bg-white p-3 shadow-md transition hover:-translate-y-1 hover:shadow-xl ${i % 2 === 1 ? "mt-6" : ""}`}>
                                <div className={`flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${TONES[i % TONES.length]}`}>
                                    {tile.image ? (
                                        <img src={tile.image} alt={tile.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                                    ) : (
                                        <HiShoppingBag className="h-10 w-10 text-gray-400 transition group-hover:scale-110 group-hover:text-brand-500" />
                                    )}
                                </div>
                                {tile.tag && <span className="absolute left-5 top-5 rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-bold text-white">{tile.tag}</span>}
                                <div className="mt-3 flex items-center justify-between gap-2">
                                    <p className="truncate text-xs font-semibold text-gray-800">{tile.name}</p>
                                    <p className="shrink-0 text-xs font-bold text-brand-600">{tile.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </HeroShell>
    );
}

export default Ecommerce;
