//Common_Templates/Navbar.jsx
//
// Every label, link, button and icon here is controlled by props that come from the editor
// (see src/Editor/navbarConfig.js). Color names use fixed Tailwind classes, plus the special
// color "brand" which follows the site theme.

import { useState } from "react";
import {
    HiHome, HiSparkles, HiTag, HiInformationCircle, HiMail, HiCube, HiBell, HiSun, HiMoon,
    HiChevronDown, HiSearch, HiShoppingBag, HiPhone, HiExternalLink,
} from "react-icons/hi";
import SmartLink from "../shared/SmartLink";

const logoColorMap = {
    brand: "bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent",
    white: "bg-gradient-to-r from-neutral-100 to-gray-200 bg-clip-text text-transparent",
    black: "bg-gradient-to-r from-neutral-800 to-black bg-clip-text text-transparent",
    transparent: "bg-transparent text-transparent",
    gray: "bg-gradient-to-r from-gray-500 to-gray-600 bg-clip-text text-transparent",
    orange: "bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent",
    red: "bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent",
    blue: "bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent",
    green: "bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent",
    indigo: "bg-gradient-to-r from-indigo-500 to-indigo-600 bg-clip-text text-transparent",
    slate: "bg-gradient-to-r from-slate-500 to-slate-600 bg-clip-text text-transparent",
    zinc: "bg-gradient-to-r from-zinc-500 to-zinc-600 bg-clip-text text-transparent",
    neutral: "bg-gradient-to-r from-neutral-500 to-neutral-600 bg-clip-text text-transparent",
    stone: "bg-gradient-to-r from-stone-500 to-stone-600 bg-clip-text text-transparent",
    amber: "bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent",
    yellow: "bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent",
    rose: "bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent",
    lime: "bg-gradient-to-r from-lime-500 to-lime-600 bg-clip-text text-transparent",
    emerald: "bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent",
    teal: "bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent",
    cyan: "bg-gradient-to-r from-cyan-500 to-cyan-600 bg-clip-text text-transparent",
    sky: "bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent",
    violet: "bg-gradient-to-r from-violet-500 to-violet-600 bg-clip-text text-transparent",
    purple: "bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent",
    fuchsia: "bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 bg-clip-text text-transparent",
    pink: "bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent",
};

const borderColorMap = {
    brand: "border-brand-200",
    gray: "border-gray-200", orange: "border-orange-200", red: "border-red-200", blue: "border-blue-200",
    green: "border-green-200", indigo: "border-indigo-200", slate: "border-slate-200", zinc: "border-zinc-200",
    neutral: "border-neutral-200", stone: "border-stone-200", amber: "border-amber-200", yellow: "border-yellow-200",
    rose: "border-rose-200", lime: "border-lime-200", emerald: "border-emerald-200", teal: "border-teal-200",
    cyan: "border-cyan-200", sky: "border-sky-200", violet: "border-violet-200", purple: "border-purple-200",
    fuchsia: "border-fuchsia-200", pink: "border-pink-200", white: "border-white", black: "border-black", transparent: "border-transparent"
};

const borderStyleMap = {
    solid: "border",
    dashed: "border border-dashed",
    none: "border-0"
};

const backgroundColorMap = {
    brand: "bg-brand-100",
    white: "bg-white", black: "bg-black", transparent: "bg-transparent", gray: "bg-gray-100",
    orange: "bg-orange-100", red: "bg-red-100", blue: "bg-blue-100", green: "bg-green-100",
    indigo: "bg-indigo-100", slate: "bg-slate-100", zinc: "bg-zinc-100", neutral: "bg-neutral-100",
    stone: "bg-stone-100", amber: "bg-amber-100", yellow: "bg-yellow-100", rose: "bg-rose-100",
    lime: "bg-lime-100", emerald: "bg-emerald-100", teal: "bg-teal-100", cyan: "bg-cyan-100",
    sky: "bg-sky-100", violet: "bg-violet-100", purple: "bg-purple-100", fuchsia: "bg-fuchsia-100", pink: "bg-pink-100"
};

const capsuleAreaBgMap = {
    brand: "bg-brand-50",
    white: "bg-white", black: "bg-black", transparent: "bg-transparent", gray: "bg-gray-100",
    orange: "bg-orange-50", red: "bg-red-50", blue: "bg-blue-50", green: "bg-green-50",
    amber: "bg-amber-50", yellow: "bg-yellow-50", rose: "bg-rose-50", emerald: "bg-emerald-50",
    teal: "bg-teal-50", cyan: "bg-cyan-50", sky: "bg-sky-50", violet: "bg-violet-50", purple: "bg-purple-50", pink: "bg-pink-50"
};

const textColorMap = {
    brand: "text-brand-600",
    white: "text-white", black: "text-black", transparent: "text-transparent", gray: "text-gray-600",
    orange: "text-orange-600", red: "text-red-600", blue: "text-blue-600", green: "text-green-600",
    indigo: "text-indigo-600", slate: "text-slate-600", zinc: "text-zinc-600", neutral: "text-neutral-600",
    stone: "text-stone-600", amber: "text-amber-600", yellow: "text-yellow-600", rose: "text-rose-600",
    lime: "text-lime-600", emerald: "text-emerald-600", teal: "text-teal-600", cyan: "text-cyan-600",
    sky: "text-sky-600", violet: "text-violet-600", purple: "text-purple-600", fuchsia: "text-fuchsia-600", pink: "text-pink-600"
};

const hoverColorMap = {
    brand: "hover:text-brand-500",
    white: "hover:text-gray-300", black: "hover:text-neutral-400", transparent: "hover:text-gray-100/50",
    gray: "hover:text-gray-900", orange: "hover:text-orange-500", red: "hover:text-red-500", blue: "hover:text-blue-500",
    green: "hover:text-green-500", indigo: "hover:text-indigo-500", slate: "hover:text-slate-900", zinc: "hover:text-zinc-900",
    neutral: "hover:text-neutral-900", stone: "hover:text-stone-900", amber: "hover:text-amber-500", yellow: "hover:text-yellow-500",
    rose: "hover:text-rose-500", lime: "hover:text-lime-500", emerald: "hover:text-emerald-500", teal: "hover:text-teal-500",
    cyan: "hover:text-cyan-500", sky: "hover:text-sky-500", violet: "hover:text-violet-500", purple: "hover:text-purple-500",
    fuchsia: "hover:text-fuchsia-500", pink: "hover:text-pink-500"
};

const underlineColorMap = {
    brand: "after:bg-brand-600",
    white: "after:bg-white", black: "after:bg-black", gray: "after:bg-gray-600",
    orange: "after:bg-orange-600", red: "after:bg-red-600", blue: "after:bg-blue-600", 
    green: "after:bg-green-600", indigo: "after:bg-indigo-600", slate: "after:bg-slate-600", 
    zinc: "after:bg-zinc-600", neutral: "after:bg-neutral-600", stone: "after:bg-stone-600", 
    amber: "after:bg-amber-600", yellow: "after:bg-yellow-600", rose: "after:bg-rose-600", 
    lime: "after:bg-lime-600", emerald: "after:bg-emerald-600", teal: "after:bg-teal-600", 
    cyan: "after:bg-cyan-600", sky: "after:bg-sky-600", violet: "after:bg-violet-600", 
    purple: "after:bg-purple-600", fuchsia: "after:bg-fuchsia-600", pink: "after:bg-pink-600"
};

const navPositionMap = {
    start: "mr-auto ml-6",
    center: "mx-auto",
    end: "ml-auto mr-6",
};

const colorToBgMap = {
    brand: "bg-brand-600", "bg-brand-600": "bg-brand-600",
    white: "bg-white", black: "bg-black", transparent: "bg-transparent", gray: "bg-gray-600",
    orange: "bg-orange-600", red: "bg-red-600", blue: "bg-blue-600", green: "bg-green-600",
    indigo: "bg-indigo-600", slate: "bg-slate-600", zinc: "bg-zinc-600", neutral: "bg-neutral-600",
    stone: "bg-stone-600", amber: "bg-amber-600", yellow: "bg-yellow-600", rose: "bg-rose-600",
    lime: "bg-lime-600", emerald: "bg-emerald-600", teal: "bg-teal-600", cyan: "bg-cyan-600",
    sky: "bg-sky-600", violet: "bg-violet-600", purple: "bg-purple-600", fuchsia: "bg-fuchsia-600", pink: "bg-pink-600",
    "bg-orange-600": "bg-orange-600", "bg-black": "bg-black", "bg-indigo-600": "bg-indigo-600", 
    "bg-blue-600": "bg-blue-600", "bg-emerald-600": "bg-emerald-600", "bg-rose-600": "bg-rose-600", 
    "bg-purple-600": "bg-purple-600", "bg-slate-800": "bg-slate-800"
};

const colorToHoverBgMap = {
    brand: "hover:bg-brand-700",
    white: "hover:bg-gray-100", black: "hover:bg-neutral-800", transparent: "hover:bg-gray-100/50", gray: "hover:bg-gray-700",
    orange: "hover:bg-orange-700", red: "hover:bg-red-700", blue: "hover:bg-blue-700", green: "hover:bg-green-700",
    indigo: "hover:bg-indigo-700", slate: "hover:bg-slate-700", zinc: "hover:bg-zinc-700", neutral: "hover:bg-neutral-700",
    stone: "hover:bg-stone-700", amber: "hover:bg-amber-700", yellow: "hover:bg-yellow-700", rose: "hover:bg-rose-700",
    lime: "hover:bg-lime-700", emerald: "hover:bg-emerald-700", teal: "hover:bg-teal-700", cyan: "hover:bg-cyan-700",
    sky: "hover:bg-sky-700", violet: "hover:bg-violet-700", purple: "hover:bg-purple-700", fuchsia: "hover:bg-fuchsia-700", pink: "hover:bg-pink-700"
};

const LOGO_SIZES = {
    sm: { img: "h-6 w-6 sm:h-7 sm:w-7", text: "text-sm sm:text-lg" },
    md: { img: "h-7 w-7 sm:h-9 sm:w-9", text: "text-base sm:text-xl" },
    lg: { img: "h-9 w-9 sm:h-12 sm:w-12", text: "text-lg sm:text-2xl" },
};

const iconCls = "w-4 h-4 transition-transform group-hover:-translate-y-0.5";
function getNavLinkIcon(name = "") {
    const n = name.toLowerCase();
    if (n.includes("home")) return <HiHome className={iconCls} />;
    if (n.includes("product") || n.includes("price") || n.includes("store") || n.includes("shop")) return <HiTag className={iconCls} />;
    if (n.includes("about") || n.includes("team") || n.includes("story")) return <HiInformationCircle className={iconCls} />;
    if (n.includes("contact") || n.includes("mail")) return <HiMail className={iconCls} />;
    if (n.includes("phone") || n.includes("call") || n.includes("support")) return <HiPhone className={iconCls} />;
    if (n.includes("feature") || n.includes("service")) return <HiSparkles className={iconCls} />;
    return <HiCube className={iconCls} />;
}

const initialsOf = (name = "") =>
    name.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "U";

function Navbar({
    logoImg, logoName, logoColor, logoSize = "md", logoLink = "#top",
    navLinks = [],
    borderColor, backgroundColor, textColor, hoverColor, navPosition,
    navbarPadding = "py-3.5 px-6 sm:px-8", navbarMargin = "mt-4", borderStyle,
    showNavLinks = true,
    signUpColor, signUpBackgroundColor, signUpHoverBackgroundColor, signupRadius = "rounded-full",
    loginColor, loginBackgroundColor, loginHoverBackgroundColor, loginRadius = "rounded-full",
    showLoginButton = true, loginText = "Login", loginLink = "#",
    showSignUpButton = true, signUpText = "Sign Up", signUpLink = "#",
    enableUnderlineAnimation, showIcons,
    isFloatingCapsule, isCapsuleFluid = false, capsuleRadius = "rounded-full", capsuleBgColor = "white",
    isGlassmorphic,
    isLoggedIn, userName = "Store Owner", userEmail = "", profileMenu = [], logoutText = "Log out", onLogout,
    darkMode, onToggleDarkMode, showThemeToggle,
    enableSearch, searchPlaceholder = "Search...", enableCartBadge, cartCount = 2,
    announcementText, announcementBgColor, announcementTextColor, announcementLink, announcementLinkText = "Learn more",
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [openDropdown, setOpenDropdown] = useState(null);
    const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState({});

    const logoColorClass = logoColorMap[logoColor] || "bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent";
    const borderColorClass = borderColorMap[borderColor] || "border-gray-200";
    const borderStyleClass = borderStyleMap[borderStyle] || "border";
    const baseBackground = backgroundColorMap[backgroundColor] || "bg-white";
    const finalBackground = isGlassmorphic ? `${baseBackground}/85 backdrop-blur-md` : baseBackground;
    const capsuleAreaBgClass = darkMode ? "bg-neutral-900" : capsuleAreaBgMap[capsuleBgColor] || "bg-white";
    const textColorClass = darkMode ? "text-gray-100" : textColorMap[textColor] || "text-gray-600";
    const hoverColorClass = hoverColorMap[hoverColor] || "hover:text-brand-500";
    const underlineClass = enableUnderlineAnimation
        ? `relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:transition-all after:duration-300 hover:after:w-full ${underlineColorMap[hoverColor] || "after:bg-brand-600"}`
        : "";
    const navPositionClass = navPositionMap[navPosition] || "mx-auto";

    const signUpColorClass = textColorMap[signUpColor] || "text-white";
    const signUpBackgroundColorClass = colorToBgMap[signUpBackgroundColor] || "bg-brand-600";
    const signUpHoverBackgroundColorClass = colorToHoverBgMap[signUpHoverBackgroundColor] || "hover:bg-brand-700";
    const loginColorClass = textColorMap[loginColor] || "text-gray-700";
    const loginBackgroundColorClass = colorToBgMap[loginBackgroundColor] || "bg-transparent";
    const loginHoverBackgroundColorClass = colorToHoverBgMap[loginHoverBackgroundColor] || "hover:bg-gray-100";
    const announcementBgClass = colorToBgMap[announcementBgColor] || "bg-brand-600";
    const announcementTextClass = textColorMap[announcementTextColor] || "text-white";

    // Stickiness is handled by the page frame around the navbar, so the nav itself only positions its content.
    const navWrapperClasses = isFloatingCapsule
        ? isCapsuleFluid
            ? `relative z-10 ${navbarMargin} w-[96%] mx-auto ${capsuleRadius} ${borderStyleClass} ${borderColorClass} ${finalBackground} shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-visible`
            : `relative z-10 ${navbarMargin} mx-auto max-w-7xl ${capsuleRadius} ${borderStyleClass} ${borderColorClass} ${finalBackground} shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-visible`
        : `relative z-10 w-full border-b ${borderColorClass} ${finalBackground} shadow-xs transition-all duration-300 overflow-visible`;

    const logoSizes = LOGO_SIZES[logoSize] || LOGO_SIZES.md;
    const closeMenu = () => setIsMenuOpen(false);
    const logout = () => { setProfileDropdownOpen(false); closeMenu(); onLogout?.(); };

    const loginButton = showLoginButton && loginText && (
        <SmartLink href={loginLink} className={`${loginRadius} px-3.5 py-2 text-xs sm:text-sm font-semibold ${loginBackgroundColorClass} ${loginColorClass} transition ${loginHoverBackgroundColorClass}`}>
            {loginText}
        </SmartLink>
    );
    const signUpButton = showSignUpButton && signUpText && (
        <SmartLink href={signUpLink} className={`${signupRadius} ${signUpBackgroundColorClass} px-4.5 py-2 text-xs sm:text-sm font-semibold ${signUpColorClass} shadow-md transition ${signUpHoverBackgroundColorClass}`}>
            {signUpText}
        </SmartLink>
    );

    return (
        <div className={`@container w-full overflow-visible ${isFloatingCapsule ? "pb-2" : "pb-0"} ${capsuleAreaBgClass} ${darkMode ? "bg-neutral-900 text-white" : ""}`}>
            {announcementText && (
                <div className={`${announcementBgClass} ${announcementTextClass} px-4 py-2 text-center text-xs font-semibold flex items-center justify-center gap-2 shadow-inner`}>
                    <HiSparkles className="w-4 h-4 shrink-0" />
                    <span>{announcementText}</span>
                    {announcementLink && announcementLinkText && (
                        <SmartLink href={announcementLink} className="underline inline-flex items-center gap-1 hover:opacity-80">
                            {announcementLinkText} <HiExternalLink className="w-3 h-3" />
                        </SmartLink>
                    )}
                </div>
            )}

            <nav className={navWrapperClasses}>
                <div className={`mx-auto flex w-full max-w-7xl items-center justify-between flex-nowrap gap-3 ${navbarPadding} overflow-visible`}>
                    {/* Logo */}
                    <SmartLink href={logoLink} className="flex shrink-0 items-center gap-2.5 group">
                        {logoImg && <img src={logoImg} alt="Logo" className={`${logoSizes.img} object-contain transition-transform group-hover:scale-105`} />}
                        {logoName && (
                            <span className={`${logoSizes.text} font-bold tracking-tight truncate max-w-[110px] sm:max-w-none ${logoColorClass}`}>{logoName}</span>
                        )}
                    </SmartLink>

                    {/* Desktop / tablet links */}
                    {showNavLinks && (
                        <div className={`hidden items-center gap-4 lg:gap-6 @xl:flex shrink ${navPositionClass} overflow-visible z-50`}>
                            {navLinks.map((link, index) => {
                                const hasChildren = link.children && link.children.length > 0;
                                const isDropdownOpen = openDropdown === index;

                                return (
                                    <div
                                        key={index}
                                        className="relative overflow-visible py-2"
                                        onMouseEnter={() => hasChildren && setOpenDropdown(index)}
                                        onMouseLeave={() => hasChildren && setOpenDropdown(null)}
                                    >
                                        <SmartLink
                                            href={hasChildren ? "#" : link.href}
                                            onClick={(e) => { if (hasChildren) e.preventDefault(); }}
                                            className={`group flex items-center gap-1.5 text-xs sm:text-sm font-medium whitespace-nowrap ${textColorClass} transition-colors ${hoverColorClass} ${underlineClass}`}
                                        >
                                            {showIcons && getNavLinkIcon(link.name)}
                                            <span>{link.name}</span>
                                            {link.badge && (
                                                <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[9px] font-bold text-brand-600 animate-pulse">{link.badge}</span>
                                            )}
                                            {hasChildren && <HiChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />}
                                        </SmartLink>

                                        {hasChildren && isDropdownOpen && (
                                            <div className="absolute left-0 top-full pt-1.5 w-48 z-[9999]">
                                                <div className="rounded-xl border border-gray-100 bg-white py-2 shadow-xl animate-fadeIn">
                                                    {link.children.map((child, ci) => (
                                                        <SmartLink key={ci} href={child.href} className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition">
                                                            {child.name}
                                                        </SmartLink>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Right controls */}
                    <div className="hidden items-center gap-2 sm:gap-3 @xl:flex shrink-0">
                        {enableSearch && (
                            <div className="relative flex items-center">
                                {searchOpen ? (
                                    <input
                                        type="text"
                                        placeholder={searchPlaceholder}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onBlur={() => !searchQuery && setSearchOpen(false)}
                                        autoFocus
                                        className="w-28 sm:w-40 rounded-full border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:border-brand-500 bg-gray-50 text-gray-900 shadow-inner"
                                    />
                                ) : (
                                    <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition cursor-pointer">
                                        <HiSearch className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                )}
                            </div>
                        )}

                        {enableCartBadge && (
                            <button type="button" aria-label="Cart" className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 transition cursor-pointer">
                                <HiShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                                {Number(cartCount) > 0 && (
                                    <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-brand-600 text-[8px] sm:text-[9px] font-bold text-white">{cartCount}</span>
                                )}
                            </button>
                        )}

                        {showThemeToggle && (
                            <button type="button" onClick={onToggleDarkMode} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition cursor-pointer" title="Toggle theme" aria-label="Toggle theme">
                                {darkMode ? <HiSun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" /> : <HiMoon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />}
                            </button>
                        )}

                        {isLoggedIn ? (
                            <div className="relative flex items-center gap-2">
                                <button type="button" aria-label="Notifications" className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 transition cursor-pointer">
                                    <HiBell className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-600"></span>
                                </button>

                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                        className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 p-1.5 pr-3 hover:bg-gray-100 transition cursor-pointer shadow-xs"
                                    >
                                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-brand-600 flex items-center text-white justify-center font-bold text-[10px] sm:text-xs">{initialsOf(userName)}</div>
                                        <span className="text-xs font-semibold text-gray-700 max-w-[90px] truncate">{userName}</span>
                                        <HiChevronDown className="w-3 h-3 text-gray-400" />
                                    </button>

                                    {profileDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-gray-100 bg-white py-2 shadow-2xl z-50">
                                            {profileMenu.map((item, i) => (
                                                <SmartLink key={i} href={item.href} className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600">{item.name}</SmartLink>
                                            ))}
                                            {profileMenu.length > 0 && <div className="border-t border-gray-100 my-1"></div>}
                                            <button type="button" onClick={logout} className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer">{logoutText}</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            (loginButton || signUpButton) && <div className="flex items-center gap-2">{loginButton}{signUpButton}</div>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        type="button"
                        aria-label="Menu"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100 @xl:hidden cursor-pointer shrink-0"
                    >
                        {isMenuOpen ? (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        )}
                    </button>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className={`border-t ${borderColorClass} ${finalBackground} px-4 py-4 @xl:hidden shadow-lg rounded-b-2xl`}>
                        {showNavLinks && (
                            <div className="flex flex-col gap-1.5">
                                {navLinks.map((link, index) => {
                                    const hasChildren = link.children && link.children.length > 0;
                                    const isSubOpen = mobileSubMenuOpen[index];

                                    return (
                                        <div key={index} className="flex flex-col">
                                            <div className="flex items-center justify-between">
                                                <SmartLink
                                                    href={hasChildren ? "#" : link.href}
                                                    onClick={(e) => {
                                                        if (hasChildren) {
                                                            e.preventDefault();
                                                            setMobileSubMenuOpen((prev) => ({ ...prev, [index]: !prev[index] }));
                                                        } else closeMenu();
                                                    }}
                                                    className={`flex-1 flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${textColorClass} transition ${hoverColorClass} hover:bg-black/5`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {showIcons && getNavLinkIcon(link.name)}
                                                        <span>{link.name}</span>
                                                    </div>
                                                    {link.badge && <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-600">{link.badge}</span>}
                                                </SmartLink>
                                                {hasChildren && (
                                                    <button type="button" aria-label="Toggle sub-menu" onClick={() => setMobileSubMenuOpen((prev) => ({ ...prev, [index]: !prev[index] }))} className="p-2 text-gray-500 cursor-pointer">
                                                        <HiChevronDown className={`w-4 h-4 transition-transform ${isSubOpen ? "rotate-180" : ""}`} />
                                                    </button>
                                                )}
                                            </div>

                                            {hasChildren && isSubOpen && (
                                                <div className="pl-6 flex flex-col gap-1 my-1 border-l-2 border-brand-200">
                                                    {link.children.map((child, ci) => (
                                                        <SmartLink key={ci} href={child.href} onClick={closeMenu} className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-brand-600">
                                                            ↳ {child.name}
                                                        </SmartLink>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className={`mt-4 flex flex-col gap-3 border-t ${borderColorClass} pt-4`}>
                            {isLoggedIn ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center text-white justify-center font-bold text-xs">{initialsOf(userName)}</div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-gray-900 truncate">{userName}</p>
                                            {userEmail && <p className="text-[11px] text-gray-500 truncate">{userEmail}</p>}
                                        </div>
                                    </div>
                                    {profileMenu.map((item, i) => (
                                        <SmartLink key={i} href={item.href} onClick={closeMenu} className="block rounded-lg px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">{item.name}</SmartLink>
                                    ))}
                                    <button type="button" onClick={logout} className="w-full text-center rounded-lg bg-red-50 py-2.5 text-xs font-semibold text-red-600 cursor-pointer">{logoutText}</button>
                                </div>
                            ) : (
                                <>
                                    {showLoginButton && loginText && (
                                        <SmartLink href={loginLink} onClick={closeMenu} className={`rounded-full px-4 py-2.5 text-center text-sm font-semibold ${loginBackgroundColorClass} ${loginColorClass} transition ${loginHoverBackgroundColorClass}`}>
                                            {loginText}
                                        </SmartLink>
                                    )}
                                    {showSignUpButton && signUpText && (
                                        <SmartLink href={signUpLink} onClick={closeMenu} className={`rounded-full ${signUpBackgroundColorClass} px-4 py-2.5 text-center text-sm font-semibold ${signUpColorClass} transition ${signUpHoverBackgroundColorClass}`}>
                                            {signUpText}
                                        </SmartLink>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
}

export default Navbar;
