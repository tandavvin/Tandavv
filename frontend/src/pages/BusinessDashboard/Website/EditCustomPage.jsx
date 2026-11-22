import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomSectionPanel from "../../../Editor/CustomSectionPanel";
import { apiFetch } from "../../../utils/api";

export default function EditCustomPage() {
  const navigate = useNavigate();
  const { sectionId } = useParams(); // e.g., features-1 or cta-1 from route
  const [store, setStore] = useState(null);
  const [sectionConfig, setSectionConfig] = useState(null);
  const [sectionLabel, setSectionLabel] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/config")
      .then((res) => {
        const storeData = res.data;
        if (storeData) {
          setStore(storeData);
          
          // Find the section label from sectionsOrder
          const sectionEntry = (storeData.sectionsOrder || []).find(s => s.id === sectionId);
          if (sectionEntry) {
            setSectionLabel(sectionEntry.label);
          }

          // Fetch the configuration map from customSections
          const customMap = storeData.customSections || {};
          if (customMap[sectionId]) {
            setSectionConfig(customMap[sectionId]);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load custom section configuration:", err);
        setLoading(false);
      });
  }, [sectionId]);

  const handleSaveCustomSection = async () => {
    if (!store || !sectionConfig) return;

    const updatedCustomSections = {
      ...(store.customSections || {}),
      [sectionId]: sectionConfig
    };

    // Also update label in sectionsOrder if it changed
    const updatedSectionsOrder = (store.sectionsOrder || []).map(s => 
      s.id === sectionId ? { ...s, label: sectionLabel } : s
    );

    await apiFetch(`/config?storeId=${store._id}`, {
      method: "PUT",
      body: {
        customSections: updatedCustomSections,
        sectionsOrder: updatedSectionsOrder
      }
    });

    navigate("/dashboard/website/pages");
  };

  if (loading) return <div className="p-8 text-center text-xs text-gray-400">Loading section settings...</div>;
  if (!sectionConfig) return <div className="p-8 text-center text-xs text-red-500">Custom section not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Configure Custom Section</h1>
          <p className="text-xs text-gray-500 mt-1">Manage content, items, and styles for section ID: <span className="font-mono text-orange-600">{sectionId}</span></p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/dashboard/website/pages")}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveCustomSection}
            className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-700 cursor-pointer"
          >
            Save changes
          </button>
        </div>
      </div>

      {/* Render your exact editor CustomSectionPanel layout in the dashboard */}
      <CustomSectionPanel
        cfg={sectionConfig}
        setCfg={setSectionConfig}
        label={sectionLabel}
        onRename={setSectionLabel}
      />
    </div>
  );
}