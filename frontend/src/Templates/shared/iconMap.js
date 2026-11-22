// src/Templates/shared/iconMap.js
//
// Named icons that users can pick for feature cards.

import {
    HiBadgeCheck, HiCash, HiChatAlt2, HiCheckCircle, HiClock, HiCube, HiFire, HiGift, HiGlobe,
    HiHeart, HiLightningBolt, HiLockClosed, HiPuzzle, HiShieldCheck, HiSparkles, HiStar, HiSupport,
    HiThumbUp, HiTruck,
} from "react-icons/hi";

export const ICONS = {
    star: HiStar,
    bolt: HiLightningBolt,
    shield: HiShieldCheck,
    heart: HiHeart,
    truck: HiTruck,
    support: HiSupport,
    gift: HiGift,
    clock: HiClock,
    globe: HiGlobe,
    check: HiCheckCircle,
    sparkles: HiSparkles,
    cube: HiCube,
    chat: HiChatAlt2,
    cash: HiCash,
    badge: HiBadgeCheck,
    fire: HiFire,
    thumbsup: HiThumbUp,
    puzzle: HiPuzzle,
    lock: HiLockClosed,
};

export const ICON_OPTIONS = Object.keys(ICONS).map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) }));
