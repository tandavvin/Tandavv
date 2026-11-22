// src/Templates/Storefront.jsx


import { useState } from "react";
import Navbar from "./Common_Templates/Navbar";
import HeroSection from "./Common_Templates/Hero/HeroSection";
import Products from "./Common_Templates/Products";
import About from "./Common_Templates/About";
import Testimonials from "./Common_Templates/Testimonials";
import Footer from "./Common_Templates/Footer";
import CustomSection from "./Common_Templates/CustomSection";
import { themeStyle, useGoogleFont } from "../utils/theme";

function Frame({ id, label, editor, active, onSelect, className = "", children }) {
    if (!editor) {
        return (
            <div id={id} className={className}>
                {children}
            </div>
        );
    }

    return (
        <div
            id={`sec-${id}`}
            data-section={id}
            // keep every link inside the preview from navigating away from the editor
            onClickCapture={(e) => {
                if (e.target.closest?.("a[href]")) e.preventDefault();
            }}
            onClick={() => onSelect?.(id)}
            className={`group/section relative scroll-mt-24 ${className} ${active
                ? "outline-2 -outline-offset-2 outline-orange-500"
                : "hover:outline-2 hover:-outline-offset-2 hover:outline-orange-300"
                }`}
        >
            <span
                className={`pointer-events-none absolute left-2 top-2 z-[60] rounded bg-orange-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow ${active ? "block" : "hidden group-hover/section:block"
                    }`}
            >
                {label}
            </span>
            {children}
        </div>
    );
}

const isVisible = (config, id) => {
    switch (id) {
        case "navbar": return true;
        case "hero": return config.hero.visible !== false;
        case "products": return config.products.visible !== false;
        case "about": return config.about.visible !== false;
        case "testimonials": return config.testimonials.visible !== false;
        case "footer": return config.footer.visible !== false;
        default: return config.custom?.[id]?.visible !== false;
    }
};

function Storefront({
    config,
    editor = false,
    activeSection = null,
    onSelectSection,
    isLoggedIn = false,
    user = null,
    onLogout,
    storeSlug = null,
}) {
    const [darkMode, setDarkMode] = useState(false);
    useGoogleFont(config.theme?.font);

    const { navbar, footer } = config;

    const renderSection = (section) => {
        switch (section.id) {
            case "navbar":
                return (
                    <Navbar
                        {...navbar}
                        announcementText={navbar.enableAnnouncement ? navbar.announcementText : ""}
                        isLoggedIn={isLoggedIn}
                        userName={user?.name || "Store Owner"}
                        userEmail={user?.email || ""}
                        onLogout={onLogout}
                        darkMode={darkMode}
                        onToggleDarkMode={() => setDarkMode((d) => !d)}
                    />
                );
            case "hero":
                return <HeroSection {...config.hero} />;
            case "products":
                return (
                    <Products
                        {...config.products}
                        storeSlug={storeSlug}
                    />
                );
            case "about":
                return <About {...config.about} />;
            case "testimonials":
                return <Testimonials {...config.testimonials} />;
            case "footer":
                return (
                    <Footer
                        {...footer}
                        logoName={footer.useNavbarLogo ? navbar.logoName : footer.logoName}
                        logoImg={footer.useNavbarLogo ? navbar.logoImg : footer.logoImg}
                    />
                );
            default: {
                const custom = config.custom?.[section.id];
                return custom ? <CustomSection {...custom} /> : null;
            }
        }
    };

    return (
        <div id="top" style={themeStyle(config.theme)} className="relative isolate min-h-full">
            {config.sections.map((section) => {
                if (!isVisible(config, section.id)) return null;

                const isNavbar = section.id === "navbar";
                // the navbar's frame is what sticks to the top while scrolling
                const frameClass = isNavbar ? `${navbar.isSticky ? "sticky top-0" : "relative"} z-50` : "";

                return (
                    <Frame
                        key={section.id}
                        id={section.id}
                        label={section.label}
                        editor={editor}
                        active={activeSection === section.id}
                        onSelect={onSelectSection}
                        className={frameClass}
                    >
                        {renderSection(section)}
                    </Frame>
                );
            })}
        </div>
    );
}

export default Storefront;
