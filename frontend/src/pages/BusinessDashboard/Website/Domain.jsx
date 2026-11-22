import { useState, useEffect } from "react";
import ResourcePage from "../../../components/BusinessDashboard/ResourcePage";
import { apiFetch } from "../../../utils/api";

const columns = [
  { key: "domain", label: "Domain" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
  { key: "renewal", label: "Renewal" }
];

export default function Domain() {
  const [items, setItems] = useState([]);
  const [storeId, setStoreId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/config")
      .then((res) => {
        const store = res.data;
        if (store) {
          setStoreId(store._id);
          setItems([
            {
              domain: store?.domain || `${store?.storeName?.toLowerCase().replace(/\s+/g, "") || "mybusiness"}.tandav.com`,
              type: store?.customDomain ? "Custom domain" : "Tandav subdomain",
              status: "Connected",
              renewal: "Included"
            }
          ]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load domain info:", err);
        setLoading(false);
      });
  }, []);

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/config/export?storeId=${storeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tandav-domain-export-${storeId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download JSON data.");
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-gray-400">Loading domain settings...</div>;

  return (
    <ResourcePage
      title="Domains"
      description="Manage your custom domain and connection status."
      singular="Domain"
      initialItems={items}
      columns={columns}
      addLabel="Connect domain"
      onAdd={() => window.location.href = "/dashboard/website/domain/settings"}
      onExport={handleExport}
    />
  );
}