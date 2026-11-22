import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResourcePage from "../../../components/BusinessDashboard/ResourcePage";
import { apiFetch } from "../../../utils/api";

const columns = [
  { key: "name", label: "Website" },
  { key: "domain", label: "Domain" },
  { key: "status", label: "Status" },
  { key: "updated", label: "Last updated" }
];

export default function WebsiteOverview() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [storeId, setStoreId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStoreData = () => {
    apiFetch("/config")
      .then((res) => {
        const store = res.data;
        if (store) {
          setStoreId(store._id);
          setItems([
            {
              id: store._id,
              slug: store.slug,
              name: store.storeName || "My Business Website",
              domain: store.domain || `${store.storeName?.toLowerCase().replace(/\s+/g, "") || "mybusiness"}.tandav.com`,
              status: store.published ? "Published" : "Draft",
              updated: store.updatedAt ? new Date(store.updatedAt).toLocaleDateString() : "Today"
            }
          ]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load website overview:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  // 1. Delete Handler (Sends DELETE request to backend with ownership checks via token)
  const handleDeleteStore = async (item) => {
    await apiFetch(`/config/${item.id}`, { method: "DELETE" });
    setItems([]);
    setStoreId(null);
  };

  // 3. Three-Dot Menu Actions Handlers
  const handlePreview = (item) => {
    navigate(`/preview/${item.id}`); // Or open preview mode
  };

  const handleVisitLive = (item) => {
    window.open(`/store/${item.slug || item.id}`, "_blank");
  };

  const handleDuplicate = async (item) => {
    try {
      await apiFetch(`/config/${item.id}/duplicate`, { method: "POST" });
      alert("Website duplicated successfully!");
      fetchStoreData();
    } catch (err) {
      alert(err.message || "Failed to duplicate website.");
    }
  };

  const handleManageDomain = () => {
    navigate("/dashboard/website/domain");
  };

  const handleSettings = () => {
    navigate("/dashboard/settings");
  };

  const handleArchive = async (item) => {
    try {
      await apiFetch(`/config/${item.id}/publish`, {
        method: "PATCH",
        body: { published: false }
      });
      alert("Website archived (unpublished) successfully!");
      fetchStoreData();
    } catch (err) {
      alert("Failed to archive website.");
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-gray-400">Loading website overview...</div>;

  return (
    <ResourcePage
      title="My Website"
      description="Manage your published storefront and website settings."
      singular="Website"
      initialItems={items}
      columns={columns}
      addLabel="Edit website"
      onAdd={() => storeId && navigate(`/editor/${storeId}`)}
      onEdit={() => storeId && navigate(`/editor/${storeId}`)}
      onDelete={handleDeleteStore}
      onPreview={handlePreview}
      onVisitLive={handleVisitLive}
      onDuplicate={handleDuplicate}
      onManageDomain={handleManageDomain}
      onSettings={handleSettings}
      onArchive={handleArchive}
    />
  );
}