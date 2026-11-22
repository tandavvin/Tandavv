//Common_Templates/Custom/Cta.jsx

import SmartLink from "../../shared/SmartLink";
import { ITEMS_ALIGN, JUSTIFY_ALIGN, TEXT_ALIGN, spacingClass } from "../../shared/sectionStyles";

const STYLES = {
    brand: { wrap: "bg-brand-600 text-white", sub: "text-white/85", primary: "bg-white text-brand-700 hover:bg-brand-50", secondary: "border border-white/60 text-white hover:bg-white/10" },
    dark: { wrap: "bg-neutral-900 text-white", sub: "text-white/70", primary: "bg-brand-600 text-white hover:bg-brand-700", secondary: "border border-white/30 text-white hover:bg-white/10" },
    light: { wrap: "bg-brand-50 text-gray-900", sub: "text-gray-600", primary: "bg-brand-600 text-white hover:bg-brand-700", secondary: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50" },
};
// over a photo the text is always white
const ON_IMAGE = { wrap: "bg-neutral-900 text-white", sub: "text-white/85", primary: "bg-white text-gray-900 hover:bg-brand-50", secondary: "border border-white/60 text-white hover:bg-white/10" };

function Cta({
    heading, subtitle, buttonText, buttonLink, secondaryButtonText, secondaryButtonLink,
    style = "brand", align = "center", bgImage, overlay = 60, spacing = "normal",
}) {
    const s = bgImage ? ON_IMAGE : STYLES[style] || STYLES.brand;
    const strength = Math.min(100, Math.max(0, Number(overlay) || 0)) / 100;

    return (
        <section className={`@container relative isolate overflow-hidden ${s.wrap}`}>
            {bgImage && (
                <>
                    <img src={bgImage} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
                    <div className="absolute inset-0 -z-10" style={{ background: `rgba(0,0,0,${strength})` }} />
                </>
            )}
            <div className={`mx-auto flex max-w-4xl flex-col px-6 ${spacingClass(spacing)} ${ITEMS_ALIGN[align] || "items-center"} ${TEXT_ALIGN[align] || "text-center"}`}>
                {heading && <h2 className="max-w-2xl text-2xl font-extrabold tracking-tight @xl:text-4xl">{heading}</h2>}
                {subtitle && <p className={`mt-3 max-w-xl text-sm @xl:text-base ${s.sub}`}>{subtitle}</p>}
                {(buttonText || secondaryButtonText) && (
                    <div className={`mt-7 flex flex-wrap gap-3 ${JUSTIFY_ALIGN[align] || "justify-center"}`}>
                        {buttonText && <SmartLink href={buttonLink} className={`rounded-full px-7 py-3 text-sm font-semibold shadow-md transition ${s.primary}`}>{buttonText}</SmartLink>}
                        {secondaryButtonText && <SmartLink href={secondaryButtonLink} className={`rounded-full px-7 py-3 text-sm font-semibold transition ${s.secondary}`}>{secondaryButtonText}</SmartLink>}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Cta;
