
import { Helmet } from "react-helmet-async";

const SEO = ({
    title,
    description,
    path = "/",
    noIndex = false,
}) => {
    const siteName = "TANDAVV";
    const baseUrl = "https://tandavv.in";

    const fullTitle = title
        ? `${title} | ${siteName}`
        : "TANDAVV – Website Builder for Your Business";

    const canonicalUrl = `${baseUrl}${path}`;

    return (
        <Helmet>
            <title>{fullTitle}</title>

            <meta name="description" content={description} />

            <meta
                name="robots"
                content={noIndex ? "noindex, nofollow" : "index, follow"}
            />

            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonicalUrl} />
            <meta
                property="og:image"
                content={`${baseUrl}/og-image.png`}
            />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta
                name="twitter:image"
                content={`${baseUrl}/og-image.png`}
            />
        </Helmet>
    );
};

export default SEO;
