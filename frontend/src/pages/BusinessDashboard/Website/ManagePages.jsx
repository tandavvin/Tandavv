import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormPage from "../../../components/BusinessDashboard/FormPage";
import { apiFetch } from "../../../utils/api";

const fields = [
  { name: "name", label: "Page Name", type: "text", required: true, placeholder: "e.g. Services, Portfolio, Pricing" },
  { name: "href", label: "Page URL Path", type: "text", required: true, placeholder: "e.g. /services" }
];

export default function ManagePages() {
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/config")
      .then((res) => {
        if (res.data) setStore(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load store config:", err);
        setLoading(false);
      });
  }, []);

  const handleSavePage = async (values) => {
    if (!store) throw new Error("No active store found.");

    const pageName = values.name.trim();
    const href = values.href.trim();
    const sectionKey = href.replace(/^#/, "").replace(/^\//, "").toLowerCase();

    // 1. Update navbar.navLinks
    const currentNavLinks = store.navbar?.navLinks || [];
    const updatedNavLinks = [...currentNavLinks, { name: pageName, href }];

    // 2. Update footer.links
    const currentFooterLinks = store.footer?.links || [];
    const updatedFooterLinks = [...currentFooterLinks, { name: pageName, href }];

    let updatePayload = {
      navbar: {
        ...store.navbar,
        navLinks: updatedNavLinks
      },
      footer: {
        ...store.footer,
        links: updatedFooterLinks
      }
    };

    // 3. Explicitly set visible: true when re-adding core or custom sections
    if (sectionKey === "products" && store.products) {
      updatePayload.products = { ...store.products, visible: true };
    } else if (sectionKey === "about" && store.about) {
      updatePayload.about = { ...store.about, visible: true };
    } else if (sectionKey === "testimonials" && store.testimonials) {
      updatePayload.testimonials = { ...store.testimonials, visible: true };
    } else {
      // For custom sections, ensure it's marked visible and added back to sectionsOrder if missing
      const currentCustomSections = store.customSections || {};
      updatePayload.customSections = {
        ...currentCustomSections,
        [sectionKey]: {
          ...(currentCustomSections[sectionKey] || {
            title: pageName,
            subtitle: `Welcome to ${pageName}`,
            content: "Add your content here.",
            layout: "standard"
          }),
          visible: true
        }
      };

      const currentSectionsOrder = store.sectionsOrder || [];
      const exists = currentSectionsOrder.some(s => s.id === sectionKey);
      if (!exists) {
        const updatedOrder = [...currentSectionsOrder];
        const footerIdx = updatedOrder.findIndex(s => s.id === "footer");
        const newEntry = { id: sectionKey, label: pageName };
        if (footerIdx !== -1) {
          updatedOrder.splice(footerIdx, 0, newEntry);
        } else {
          updatedOrder.push(newEntry);
        }
        updatePayload.sectionsOrder = updatedOrder;
      }
    }

    // Send updated configuration to MongoDB
    await apiFetch(`/config?storeId=${store._id}`, {
      method: "PUT",
      body: updatePayload
    });

    navigate("/dashboard/website/pages");
  };

  if (loading) return <div className="p-8 text-center text-xs text-gray-400">Loading page creator...</div>;

  return (
    <FormPage
      title="Create New Page"
      description="Add a new page to your website navigation and structure."
      fields={fields}
      submitLabel="Create page"
      backTo="/dashboard/website/pages"
      onSubmit={handleSavePage}
    />
  );
}