// src/Templates/shared/socialIcons.jsx

import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";

const MAP = {
    twitter: FaTwitter,
    facebook: FaFacebookF,
    instagram: FaInstagram,
    linkedin: FaLinkedinIn,
    youtube: FaYoutube,
};

// renders nothing for an unknown platform
export function SocialIcon({ platform, className = "h-4 w-4" }) {
    const Cmp = MAP[platform];
    return Cmp ? <Cmp className={className} /> : null;
}
