//Common_Templates/Hero/HeroSection.jsx

import Banner from "./Banner";
import Centered from "./Centered";
import Split from "./Split";
import Gradient from "./Gradient";
import Video from "./Video";
import ProductShowCase from "./ProductShowCase";
import Portfolio from "./Portfolio";
import Ecommerce from "./Ecommerce";
import Slider from "./Slider";

// keys must match the layout ids in src/Editor/heroConfig.js
const HERO_VARIANTS = {
    banner: Banner,
    centered: Centered,
    split: Split,
    gradient: Gradient,
    video: Video,
    product: ProductShowCase,
    portfolio: Portfolio,
    ecommerce: Ecommerce,
    slider: Slider,
};

function HeroSection({ variant = "banner", ...props }) {
    const SelectedHero = HERO_VARIANTS[variant] || Banner;
    return <SelectedHero {...props} />;
}

export default HeroSection;
