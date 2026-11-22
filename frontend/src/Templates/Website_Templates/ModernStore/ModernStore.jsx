
import { useState } from "react";

import Navbar from "../../Common_Templates/Navbar";
import HeroSection from "../../Common_Templates/Hero/HeroSection";
import Products from "../../Common_Templates/Products";
import About from "../../Common_Templates/About";
import Testimonials from "../../Common_Templates/Testimonials";
import Footer from "../../Common_Templates/Footer";
import CustomSection from "../../Common_Templates/CustomSection";

import { themeStyle, useGoogleFont } from "../../../utils/theme";

const isVisible = (config, id) => {
    switch (id) {
        case "navbar":
            return true;
        case "hero":
            return config.hero?.visible !== false;
        case "products":
            return config.products?.visible !== false;
        case "about":
            return config.about?.visible !== false;
        case "testimonials":
            return config.testimonials?.visible !== false;
        case "footer":
            return config.footer?.visible !== false;
        default:
            return config.custom?.[id]?.visible !== false;
    }
};

function ModernStore({ config, storeSlug = null }) {
    const [darkMode, setDarkMode] = useState(false);

    useGoogleFont(config.theme?.font);

    const { navbar, footer } = config;

    const renderSection = (section) => {
        switch (section.id) {
            case "navbar":
                return (
                    <div className="relative z-50">
                        <Navbar
                            {...navbar}
                            announcementText={
                                navbar.enableAnnouncement
                                    ? navbar.announcementText
                                    : ""
                            }
                            isLoggedIn={false}
                            darkMode={darkMode}
                            onToggleDarkMode={() =>
                                setDarkMode((previous) => !previous)
                            }
                        />
                    </div>
                );

            case "hero":
                return (
                    <section className="bg-[#faf9f6]">
                        <HeroSection
                            {...config.hero}
                            variant="split"
                        />
                    </section>
                );

            case "products":
                return (
                    <section className="bg-white py-8 md:py-14">
                        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
                            <div className="mb-5 flex items-center justify-between border-b border-stone-200 pb-4">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500">
                                    CURATED FOR YOU
                                </span>

                                <span className="hidden text-xs text-stone-400 sm:block">
                                    Discover our collection
                                </span>
                            </div>

                            <Products
                                {...config.products}
                                storeSlug={storeSlug}
                            />
                        </div>
                    </section>
                );

            case "about":
                return (
                    <section className="bg-[#f5f3ef] py-8 md:py-12">
                        <About
                            {...config.about}
                            layout="image-right"
                        />
                    </section>
                );

            case "testimonials":
                return (
                    <section className="bg-white py-8 md:py-12">
                        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
                            <div className="mb-8 flex items-center justify-between border-b border-stone-200 pb-4">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500">
                                    CUSTOMER STORIES
                                </span>

                                <span className="text-xs text-stone-400">
                                    Trusted by our customers
                                </span>
                            </div>

                            <Testimonials
                                {...config.testimonials}
                                layout="cards"
                            />
                        </div>
                    </section>
                );

            case "footer":
                return (
                    <div className="border-t border-stone-800">
                        <Footer
                            {...footer}
                            logoName={
                                footer.useNavbarLogo
                                    ? navbar.logoName
                                    : footer.logoName
                            }
                            logoImg={
                                footer.useNavbarLogo
                                    ? navbar.logoImg
                                    : footer.logoImg
                            }
                        />
                    </div>
                );

            default: {
                const custom = config.custom?.[section.id];

                return custom ? (
                    <CustomSection {...custom} />
                ) : null;
            }
        }
    };

    return (
        <div
            id="top"
            style={themeStyle(config.theme)}
            className="relative isolate min-h-full overflow-hidden bg-white text-stone-900"
        >
            {config.sections.map((section) => {
                if (!isVisible(config, section.id)) {
                    return null;
                }

                return (
                    <div key={section.id} id={section.id}>
                        {renderSection(section)}
                    </div>
                );
            })}
        </div>
    );
}

export default ModernStore;
