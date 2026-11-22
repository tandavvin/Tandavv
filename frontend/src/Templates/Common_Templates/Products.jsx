//Common_Templates/Products.jsx


import { HiShoppingBag } from "react-icons/hi";
import { Link } from "react-router-dom";
import SmartLink from "../shared/SmartLink";
import SectionHeader from "../shared/SectionHeader";
import { gridCols, sectionTheme, spacingClass } from "../shared/sectionStyles";

const TONES = [
    "from-brand-100 to-amber-50",
    "from-sky-100 to-indigo-50",
    "from-rose-100 to-pink-50",
    "from-emerald-100 to-lime-50",
];

const RATIO = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
};

const CARD = {
    shadow: "border border-transparent shadow-sm hover:-translate-y-1 hover:shadow-xl",
    border: "border hover:-translate-y-1",
    flat: "border border-transparent",
};

function Products({
    eyebrow,
    sectionTitle,
    subtitle,
    columns = 3,
    items = [],
    showButton = true,
    buttonText,
    cardStyle = "shadow",
    imageRatio = "square",
    emptyText,
    background = "white",
    spacing = "normal",
    storeSlug = null,
}) {
    const t = sectionTheme(background);

    // Display only active products on the public storefront.
    const activeItems = items.filter(
        (product) => product.status === "active"
    );

    const buttonCls = t.dark
        ? "bg-white text-gray-900 hover:bg-brand-500 hover:text-white"
        : "bg-gray-900 text-white hover:bg-brand-600";

    return (
        <section className={`@container ${t.wrap}`}>
            <div className={`mx-auto max-w-6xl px-6 ${spacingClass(spacing)}`}>
                <SectionHeader
                    eyebrow={eyebrow}
                    heading={sectionTitle}
                    subtitle={subtitle}
                    theme={t}
                />

                {activeItems.length === 0 ? (
                    emptyText ? (
                        <p className={`mt-10 text-center text-sm ${t.muted}`}>
                            {emptyText}
                        </p>
                    ) : null
                ) : (
                    <div className={`mt-10 grid gap-5 ${gridCols(columns)}`}>
                        {activeItems.map((product, i) => {
                            const productUrl =
                                storeSlug && product._id
                                    ? `/s/${storeSlug}/product/${product._id}`
                                    : null;

                            const cardContent = (
                                <>
                                    <div
                                        className={`relative overflow-hidden bg-gray-100 ${RATIO[imageRatio] || RATIO.square
                                            }`}
                                    >
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div
                                                className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${TONES[i % TONES.length]
                                                    }`}
                                            >
                                                <HiShoppingBag className="h-12 w-12 text-gray-400 transition group-hover:text-brand-500" />
                                            </div>
                                        )}

                                        {product.badge && (
                                            <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                                                {product.badge}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        {product.category && (
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
                                                {product.category}
                                            </p>
                                        )}

                                        <h3
                                            className={`mt-1 text-sm font-bold @xl:text-base ${t.heading}`}
                                        >
                                            {product.name}
                                        </h3>

                                        <div className="mt-3 flex items-center justify-between gap-2">
                                            <span
                                                className={`text-base font-extrabold ${t.heading}`}
                                            >
                                                {product.price}
                                            </span>

                                            {showButton && buttonText && (
                                                <span
                                                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${buttonCls}`}
                                                >
                                                    {buttonText}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </>
                            );

                            return (
                                <article
                                    key={product._id || `${product.name}-${i}`}
                                    className={`group overflow-hidden rounded-2xl transition ${t.cardBg} ${t.line} ${CARD[cardStyle] || CARD.shadow
                                        }`}
                                >
                                    {productUrl ? (
                                        <Link
                                            to={productUrl}
                                            className="block"
                                        >
                                            {cardContent}
                                        </Link>
                                    ) : (
                                        <div>
                                            {cardContent}

                                            {showButton && buttonText && product.link && (
                                                <div className="px-4 pb-4">
                                                    <SmartLink
                                                        href={product.link}
                                                        className={`inline-block rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${buttonCls}`}
                                                    >
                                                        {buttonText}
                                                    </SmartLink>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Products;
