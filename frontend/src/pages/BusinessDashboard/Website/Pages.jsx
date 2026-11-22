import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResourcePage from "../../../components/BusinessDashboard/ResourcePage";
import { apiFetch, API_ORIGIN, getToken } from "../../../utils/api";

const columns = [
  { key: "name", label: "Page name" },
  { key: "url", label: "URL" },
  { key: "status", label: "Status" },
  { key: "updated", label: "Updated" }
];

export default function Pages() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [storeId, setStoreId] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPages = () => {
    apiFetch("/config")
      .then((res) => {
        const store = res.data;
        if (store) {
          setStoreId(store._id);
          setStoreData(store);
          const navLinks = store?.navbar?.navLinks || [];
          const formattedPages = navLinks.map((link, index) => ({
            id: index,
            name: link.name || "Untitled",
            url: link.href || "/",
            status: "Published",
            updated: store.updatedAt ? new Date(store.updatedAt).toLocaleDateString() : "Today"
          }));
          setItems(formattedPages);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load pages:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // Handle deleting / toggling page visibility across navLinks, footer links, and section objects in MongoDB
  const handleDeletePage = async (item) => {
    if (!storeData) return;
    const currentNavLinks = storeData.navbar?.navLinks || [];
    const targetLink = currentNavLinks[item.id];

    if (!targetLink) return;

    const pageName = targetLink.name;
    const href = targetLink.href;
    const sectionKey = href.replace(/^#/, "").replace(/^\//, "").toLowerCase();

    // 1. Remove from navbar.navLinks
    const updatedNavLinks = currentNavLinks.filter((_, index) => index !== item.id);

    // 2. Remove from footer.links
    const currentFooterLinks = storeData.footer?.links || [];
    const updatedFooterLinks = currentFooterLinks.filter(
      link => link.name !== pageName && link.href !== href
    );

    let updatePayload = {
      navbar: {
        ...storeData.navbar,
        navLinks: updatedNavLinks
      },
      footer: {
        ...storeData.footer,
        links: updatedFooterLinks
      }
    };

    // 3. Toggle visibility (if visible is true make it false, else true) for core or custom sections
    if (sectionKey === "products" && storeData.products) {
      const currentVis = storeData.products.visible ?? true;
      updatePayload.products = { ...storeData.products, visible: !currentVis };
    } else if (sectionKey === "about" && storeData.about) {
      const currentVis = storeData.about.visible ?? true;
      updatePayload.about = { ...storeData.about, visible: !currentVis };
    } else if (sectionKey === "testimonials" && storeData.testimonials) {
      const currentVis = storeData.testimonials.visible ?? true;
      updatePayload.testimonials = { ...storeData.testimonials, visible: !currentVis };
    } else {
      const currentCustomSections = storeData.customSections || {};
      if (currentCustomSections[sectionKey]) {
        const currentVis = currentCustomSections[sectionKey].visible ?? true;
        updatePayload.customSections = {
          ...currentCustomSections,
          [sectionKey]: { ...currentCustomSections[sectionKey], visible: !currentVis }
        };
      }

      const currentSectionsOrder = storeData.sectionsOrder || [];
      updatePayload.sectionsOrder = currentSectionsOrder.filter(s => s.id !== sectionKey);
    }

    // Send the synchronized update to MongoDB
    await apiFetch(`/config?storeId=${storeId}`, {
      method: "PUT",
      body: updatePayload
    });

    fetchPages();
  };

  const handleExport = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_ORIGIN}/api/config/export?storeId=${storeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tandav-pages-export-${storeId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download JSON data.");
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-gray-400">Loading pages...</div>;

  return (
    <ResourcePage
      title="Website Pages"
      description="Create and organize the pages visitors see on your website."
      singular="Page"
      initialItems={items}
      columns={columns}
      addLabel="Create page"
      onAdd={() => navigate("/dashboard/website/manage-pages")}
      onEdit={(item) => {
        if (!storeId) return;
        const sectionKey = item.url.replace(/^#/, "").replace(/^\//, "").toLowerCase();

        if (!["navbar", "hero", "products", "about", "testimonials", "footer"].includes(sectionKey)) {
          navigate(`/dashboard/website/edit-section/${sectionKey}`);
        } else {
          navigate(`/editor/${storeId}#${sectionKey}`);
        }
      }}
      onDelete={handleDeletePage}
      onExport={handleExport}
    />
  );
}