
import { Helmet } from "react-helmet-async";

const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TANDAVV",
    "alternateName": "TANDAVV Technologies",
    "url": "https://tandavv.in/",
    "description":
      "TANDAVV is a SaaS website builder that helps businesses create, customize, and manage professional online storefronts.",
    "logo": "https://tandavv.in/og-image.png"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default OrganizationSchema;
