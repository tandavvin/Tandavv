import { useNavigate } from "react-router-dom";
import FormPage from "../../../components/BusinessDashboard/FormPage";
import { apiFetch } from "../../../utils/api";

const fields = [
  { name: "domain", label: "Domain name", type: "text", required: true, placeholder: "Enter domain name (e.g. mystore.com)" },
  { name: "provider", label: "Domain provider", type: "text", required: false, placeholder: "Enter domain provider (e.g. GoDaddy, Cloudflare)" }
];

export default function DomainSettings() {
  const navigate = useNavigate();

  const handleSaveDomain = async (values) => {
    const storeRes = await apiFetch("/config");
    const storeId = storeRes.data?._id;

    if (!storeId) {
      throw new Error("No active store found.");
    }

    await apiFetch(`/config?storeId=${storeId}`, {
      method: "PUT",
      body: {
        domain: values.domain,
        domainProvider: values.provider,
        customDomain: true
      }
    });

    navigate("/dashboard/website/domain");
  };

  return (
    <FormPage
      title="Connect Domain"
      description="Connect a custom domain to your Tandav website."
      fields={fields}
      submitLabel="Save domain"
      backTo="/dashboard/website/domain"
      onSubmit={handleSaveDomain}
    />
  );
}