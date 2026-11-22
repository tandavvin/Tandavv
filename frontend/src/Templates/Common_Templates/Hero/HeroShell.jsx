//Common_Templates/Hero/HeroShell.jsx
//
// Shared frame for every hero: optional background image + overlay, section height,
// and the dark/light tone. `backdrop` is for layout-specific decoration (blobs, video...).

import { heroHeightClass } from "../../shared/sectionStyles";

function HeroShell({ tone = "light", baseClass = "", bgImage, overlay = 70, height = "auto", backdrop = null, children }) {
    const dark = tone === "dark";
    const strength = Math.min(100, Math.max(0, Number(overlay) || 0)) / 100;
    const veil = dark ? `rgba(0,0,0,${strength})` : `rgba(255,255,255,${strength})`;

    return (
        <section className={`@container relative isolate flex items-center overflow-hidden ${dark ? "text-white" : ""} ${baseClass} ${heroHeightClass(height)}`}>
            {backdrop}
            {bgImage ? (
                <>
                    <img src={bgImage} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
                    <div className="absolute inset-0 -z-10" style={{ background: veil }} />
                </>
            ) : null}
            <div className="w-full">{children}</div>
        </section>
    );
}

export default HeroShell;
