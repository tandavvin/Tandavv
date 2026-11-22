//Common_Templates/Custom/Gallery.jsx

import { HiPhotograph } from "react-icons/hi";
import SectionHeader from "../../shared/SectionHeader";
import { gridCols, sectionTheme, spacingClass } from "../../shared/sectionStyles";

const RATIO = { square: "aspect-square", portrait: "aspect-[3/4]", landscape: "aspect-[4/3]" };
const TONES = [
    "from-brand-100 to-amber-50",
    "from-sky-100 to-indigo-50",
    "from-rose-100 to-pink-50",
    "from-emerald-100 to-lime-50",
];

function Gallery({ eyebrow, heading, subtitle, columns = 3, ratio = "square", showCaptions = true, items = [], background = "white", spacing = "normal" }) {
    const t = sectionTheme(background);

    return (
        <section className={`@container ${t.wrap}`}>
            <div className={`mx-auto max-w-6xl px-6 ${spacingClass(spacing)}`}>
                <SectionHeader eyebrow={eyebrow} heading={heading} subtitle={subtitle} theme={t} />

                <div className={`mt-10 grid gap-4 ${gridCols(columns)}`}>
                    {items.map((item, i) => (
                        <figure key={i} className="group">
                            <div className={`relative overflow-hidden rounded-2xl ${RATIO[ratio] || RATIO.square}`}>
                                {item.image ? (
                                    <img src={item.image} alt={item.caption || ""} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                                ) : (
                                    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${TONES[i % TONES.length]}`}>
                                        <HiPhotograph className="h-10 w-10 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            {showCaptions && item.caption && <figcaption className={`mt-2 text-center text-xs ${t.muted}`}>{item.caption}</figcaption>}
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Gallery;
