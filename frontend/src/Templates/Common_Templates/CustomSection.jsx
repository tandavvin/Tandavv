//Common_Templates/CustomSection.jsx
//
// Renders one user-added section by its type (see src/Editor/customSectionsConfig.js).

import Cta from "./Custom/Cta";
import Faq from "./Custom/Faq";
import Features from "./Custom/Features";
import Gallery from "./Custom/Gallery";
import Pricing from "./Custom/Pricing";
import TextBlock from "./Custom/TextBlock";

const BY_TYPE = { cta: Cta, faq: Faq, features: Features, gallery: Gallery, pricing: Pricing, text: TextBlock };

function CustomSection({ type, ...props }) {
    const Cmp = BY_TYPE[type] || TextBlock;
    return <Cmp {...props} />;
}

export default CustomSection;
