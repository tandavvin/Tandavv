// src/Templates/shared/icons.jsx

import { HiStar } from "react-icons/hi";
import { ICONS } from "./iconMap";

export function Icon({ name, className = "h-5 w-5" }) {
    const Cmp = ICONS[name] || HiStar;
    return <Cmp className={className} />;
}
