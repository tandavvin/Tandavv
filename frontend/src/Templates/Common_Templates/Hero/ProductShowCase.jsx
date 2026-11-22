//Common_Templates/Hero/ProductShowCase.jsx

import { HiArrowRight, HiCube, HiShieldCheck, HiStar, HiTruck } from "react-icons/hi";
import SmartLink from "../../shared/SmartLink";
import HeroShell from "./HeroShell";

const CHIP_ICONS = [HiStar, HiTruck, HiShieldCheck];
const CHIP_POSITIONS = [
    "left-0 top-6 @3xl:-left-24",
    "right-0 top-1/2 @3xl:-right-28",
    "bottom-0 left-6 @3xl:-left-16",
];
const CHIP_COLORS = ["text-amber-400", "text-brand-500", "text-emerald-500"];

function ProductShowCase({
    eyebrow, title, subtitle, buttonText, buttonLink, secondaryButtonText, secondaryButtonLink,
    productImg, productChips = [], productPriceLabel, productPrice, height, bgImage, overlay,
}) {
    return (
        <HeroShell tone="light" baseClass="bg-gradient-to-b from-gray-50 to-white" bgImage={bgImage} overlay={overlay} height={height}>
            <div className="relative mx-auto max-w-5xl px-6 py-14 text-center @xl:py-20">
                {eyebrow && <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 ring-1 ring-brand-200">{eyebrow}</span>}
                <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-gray-900 @xl:text-5xl">{title}</h1>
                {subtitle && <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-600 @xl:text-lg">{subtitle}</p>}

                <div className="relative mx-auto mt-12 flex max-w-md items-center justify-center">
                    <div className="absolute h-72 w-72 rounded-full bg-brand-200/60 blur-3xl" />

                    <div className="relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-[2.5rem] border border-white bg-white shadow-2xl ring-1 ring-gray-100 @xl:h-72 @xl:w-72">
                        {productImg ? <img src={productImg} alt="Featured product" className="h-full w-full object-cover" /> : <HiCube className="h-28 w-28 text-brand-500" />}
                    </div>

                    {productChips.slice(0, 3).map((chip, i) => {
                        const Icon = CHIP_ICONS[i];
                        return (
                            <div key={i} className={`absolute hidden items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-lg @xl:flex ${CHIP_POSITIONS[i]}`}>
                                <Icon className={`h-4 w-4 ${CHIP_COLORS[i]}`} /> {chip.text}
                            </div>
                        );
                    })}
                </div>

                {(buttonText || secondaryButtonText || productPrice) && (
                    <div className="mt-12 flex flex-col items-center gap-3 @md:flex-row @md:justify-center">
                        {buttonText && (
                            <SmartLink href={buttonLink} className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700">
                                {buttonText}
                                <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </SmartLink>
                        )}
                        {secondaryButtonText && (
                            <SmartLink href={secondaryButtonLink} className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-brand-300 hover:text-brand-600">
                                {secondaryButtonText}
                            </SmartLink>
                        )}
                        {productPrice && (
                            <span className="text-sm text-gray-500">
                                {productPriceLabel} <span className="text-lg font-bold text-gray-900">{productPrice}</span>
                            </span>
                        )}
                    </div>
                )}
            </div>
        </HeroShell>
    );
}

export default ProductShowCase;
