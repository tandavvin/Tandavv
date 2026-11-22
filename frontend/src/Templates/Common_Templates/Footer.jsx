//Common_Templates/Footer.jsx
//
// backgroundColor: white | gray | black | slate | orange | indigo | emerald | rose
// Text colors are picked automatically so they stay readable on any background.

import { HiLocationMarker, HiMail, HiPhone } from "react-icons/hi";
import SmartLink from "../shared/SmartLink";
import { SocialIcon } from "../shared/socialIcons";

const light = (bg) => ({
    bg: `${bg} border-t border-gray-200`,
    text: "text-gray-600",
    heading: "text-gray-900",
    divider: "border-gray-200",
    icon: "bg-black/5 text-gray-600 hover:bg-brand-600 hover:text-white",
    link: "hover:text-brand-600",
});

const dark = (bg) => ({
    bg,
    text: "text-white/70",
    heading: "text-white",
    divider: "border-white/15",
    icon: "bg-white/10 text-white hover:bg-white hover:text-gray-900",
    link: "hover:text-white",
});

const THEMES = {
    white: light("bg-white"),
    gray: light("bg-gray-100"),
    black: dark("bg-neutral-900"),
    slate: dark("bg-slate-800"),
    orange: dark("bg-brand-600"),
    indigo: dark("bg-indigo-700"),
    emerald: dark("bg-emerald-700"),
    rose: dark("bg-rose-700"),
};

const GRID = {
    1: "",
    2: "@2xl:grid-cols-[1.6fr_1fr]",
    3: "@2xl:grid-cols-[1.6fr_1fr_1fr]",
    4: "@2xl:grid-cols-[1.6fr_1fr_1fr_1fr]",
};

function Footer({
    logoName, logoImg, description, linksHeading, links = [], contactHeading, email, phone, address,
    socialHeading, socials = [], backgroundColor = "black", copyright,
}) {
    const t = THEMES[backgroundColor] || THEMES.black;

    const showLinks = !!linksHeading && links.length > 0;
    const showContact = !!(email || phone || address);
    const showSocials = socials.length > 0;
    const columns = 1 + [showLinks, showContact, showSocials].filter(Boolean).length;

    return (
        <footer className={`@container ${t.bg}`}>
            <div className="mx-auto max-w-6xl px-6 py-12 @xl:py-16">
                <div className={`grid gap-10 ${GRID[columns]}`}>
                    <div>
                        {(logoImg || logoName) && (
                            <div className="flex items-center gap-2.5">
                                {logoImg && <img src={logoImg} alt="" className="h-8 w-8 object-contain" />}
                                {logoName && <span className={`text-lg font-bold tracking-tight ${t.heading}`}>{logoName}</span>}
                            </div>
                        )}
                        {description && <p className={`mt-4 max-w-sm text-sm leading-relaxed ${t.text}`}>{description}</p>}
                    </div>

                    {showLinks && (
                        <div>
                            <h4 className={`text-xs font-bold uppercase tracking-widest ${t.heading}`}>{linksHeading}</h4>
                            <ul className="mt-4 space-y-2.5">
                                {links.map((link, i) => (
                                    <li key={i}>
                                        <SmartLink href={link.href} className={`text-sm transition ${t.text} ${t.link}`}>{link.name}</SmartLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {showContact && (
                        <div>
                            {contactHeading && <h4 className={`text-xs font-bold uppercase tracking-widest ${t.heading}`}>{contactHeading}</h4>}
                            <ul className={`space-y-2.5 text-sm ${t.text} ${contactHeading ? "mt-4" : ""}`}>
                                {email && (
                                    <li className="flex items-start gap-2">
                                        <HiMail className="mt-0.5 h-4 w-4 shrink-0" />
                                        <SmartLink href={`mailto:${email}`} className={`break-all transition ${t.link}`}>{email}</SmartLink>
                                    </li>
                                )}
                                {phone && (
                                    <li className="flex items-start gap-2">
                                        <HiPhone className="mt-0.5 h-4 w-4 shrink-0" />
                                        <SmartLink href={`tel:${phone.replace(/[^\d+]/g, "")}`} className={`transition ${t.link}`}>{phone}</SmartLink>
                                    </li>
                                )}
                                {address && (
                                    <li className="flex items-start gap-2">
                                        <HiLocationMarker className="mt-0.5 h-4 w-4 shrink-0" />
                                        <span className="whitespace-pre-line">{address}</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    {showSocials && (
                        <div>
                            {socialHeading && <h4 className={`text-xs font-bold uppercase tracking-widest ${t.heading}`}>{socialHeading}</h4>}
                            <div className={`flex flex-wrap gap-2.5 ${socialHeading ? "mt-4" : ""}`}>
                                {socials.map((social, i) => (
                                    <SmartLink key={i} href={social.url} aria-label={social.platform} className={`flex h-9 w-9 items-center justify-center rounded-full transition ${t.icon}`}>
                                        <SocialIcon platform={social.platform} />
                                    </SmartLink>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {copyright && <div className={`mt-10 border-t pt-6 text-center text-xs ${t.divider} ${t.text}`}>{copyright}</div>}
            </div>
        </footer>
    );
}

export default Footer;
