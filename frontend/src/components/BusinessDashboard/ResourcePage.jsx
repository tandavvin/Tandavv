import { useMemo, useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Download,
  Eye,
  ExternalLink,
  Copy,
  Globe,
  Settings,
  Archive
} from "lucide-react";

import ConfirmModal from "./ConfirmModal";

export default function ResourcePage({
  title,
  description,
  singular = "Item",
  initialItems = [],
  columns = [],
  onAdd,
  addLabel,
  emptyMessage,
  onEdit,
  onDelete,
  onExport,
  onPreview,
  onVisitLive,
  onDuplicate,
  onManageDomain,
  onSettings,
  onArchive,
}) {
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [removeIndex, setRemoveIndex] = useState(null);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const menuRef = useRef(null);

  // Sync state if initialItems update asynchronously from a database fetch
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter records based on search query
  const filtered = useMemo(
    () =>
      items.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [items, query]
  );

  // Delete selected record
  const remove = async () => {
    const itemToDelete = filtered[removeIndex];

    if (onDelete && itemToDelete) {
      try {
        await onDelete(itemToDelete);
      } catch (err) {
        console.error("Delete action failed:", err);
        setRemoveIndex(null);
        return;
      }
    }

    setItems((current) =>
      current.filter((_, index) => index !== removeIndex)
    );

    setRemoveIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onExport || (() => alert("Export handler not connected."))}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            <Download size={16} />
            Export
          </button>

          <button
            onClick={onAdd || (() => alert(`Connect the ${singular.toLowerCase()} form here.`))}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF7200] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#E66500] cursor-pointer"
          >
            <Plus size={17} />
            {addLabel || `Add ${singular}`}
          </button>
        </div>
      </div>

      {/* Resource Table */}
      <div className="rounded-2xl border border-gray-200 bg-white">
        {/* Table Header */}
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-gray-900">{title} list</p>
            <p className="mt-1 text-xs text-gray-500">{filtered.length} records found</p>
          </div>

          {/* Search Input */}
          <label className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="w-full bg-transparent text-sm outline-none sm:w-56"
            />
          </label>
        </div>

        {/* Table Content */}
        <div className="overflow-visible pb-24">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-5 py-4 font-semibold">
                    {col.label}
                  </th>
                ))}
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item, index) => (
                <tr key={item.id || index} className="border-t border-gray-100 text-sm hover:bg-gray-50/70">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4 text-gray-600">
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}

                  {/* Row Actions */}
                  <td className="px-5 py-4 relative">
                    <div className="flex items-center gap-2">
                      {/* 1. Edit Button */}
                      <button
                        title="Edit Website"
                        onClick={() => onEdit ? onEdit(item) : alert("Connect edit action.")}
                        className="rounded-lg p-2 text-gray-400 hover:bg-orange-50 hover:text-[#FF7200] cursor-pointer"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* 2. Delete Button */}
                      <button
                        title="Delete Website"
                        onClick={() => setRemoveIndex(index)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>

                      {/* 3. Three-Dot Menu (⋮) */}
                      <div className="relative" ref={activeMenuIndex === index ? menuRef : null}>
                        <button
                          title="More Actions"
                          onClick={() => setActiveMenuIndex(activeMenuIndex === index ? null : index)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 cursor-pointer"
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {activeMenuIndex === index && (
                          <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-100 bg-white shadow-2xl py-1 z-50 text-xs font-medium text-gray-700">
                            <button
                              onClick={() => { setActiveMenuIndex(null); onPreview?.(item); }}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-orange-50 hover:text-[#FF7200] text-left"
                            >
                              <Eye size={14} /> Preview Website
                            </button>
                            <button
                              onClick={() => { setActiveMenuIndex(null); onVisitLive?.(item); }}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-orange-50 hover:text-[#FF7200] text-left"
                            >
                              <ExternalLink size={14} /> Visit Live Website
                            </button>
                            <button
                              onClick={() => { setActiveMenuIndex(null); onDuplicate?.(item); }}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-orange-50 hover:text-[#FF7200] text-left"
                            >
                              <Copy size={14} /> Duplicate Website
                            </button>
                            <button
                              onClick={() => { setActiveMenuIndex(null); onManageDomain?.(item); }}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-orange-50 hover:text-[#FF7200] text-left"
                            >
                              <Globe size={14} /> Manage Domain
                            </button>
                            <button
                              onClick={() => { setActiveMenuIndex(null); onSettings?.(item); }}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-orange-50 hover:text-[#FF7200] text-left"
                            >
                              <Settings size={14} /> Website Settings
                            </button>
                            <button
                              onClick={() => { setActiveMenuIndex(null); onArchive?.(item); }}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 hover:text-red-600 text-left border-t border-gray-50"
                            >
                              <Archive size={14} /> Archive Website
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <p className="p-10 text-center text-sm text-gray-400">
            {emptyMessage || "No matching records found."}
          </p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={removeIndex !== null}
        title={`Delete ${singular.toLowerCase()}?`}
        message="Are you sure you want to permanently delete this website? This action cannot be undone."
        confirmText="Delete"
        danger
        onCancel={() => setRemoveIndex(null)}
        onConfirm={remove}
      />
    </div>
  );
}