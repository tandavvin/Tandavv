
import { useEffect, useState } from "react";
import {
    X,
    FileText,
    Palette,
    Layout,
    Code2,
    Type,
    AlignLeft,
    AlignCenter,
    AlignRight,
    ChevronDown,
    RotateCcw,
    Layers,
    Settings2,
} from "lucide-react";

const tabs = [
    { id: "content", label: "Content", icon: FileText },
    { id: "style", label: "Style", icon: Palette },
    { id: "layout", label: "Layout", icon: Layout },
    { id: "advanced", label: "Advanced", icon: Code2 },
];

const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

const labelClass =
    "mb-1.5 block text-[11px] font-medium text-gray-600";

export default function PropertiesInspector({
    rightWidth,
    selectedElement,
    config,
    setConfig,
    onClose,
}) {
    const [activeTab, setActiveTab] = useState("content");

    const sections = config?.sections || [];

    const selectedId =
        selectedElement?.id ||
        selectedElement?.sectionId ||
        selectedElement?._id;

    const selectedSection = sections.find(
        (section) =>
            section.id === selectedId ||
            section._id === selectedId
    );

    const element = selectedSection || selectedElement;

    const [localCss, setLocalCss] = useState(
        element?.customCss || ""
    );

    useEffect(() => {
        setLocalCss(element?.customCss || "");
    }, [selectedId, element?.customCss]);

    const updateElement = (group, property, value) => {
        if (!selectedId) return;

        setConfig((prev) => ({
            ...prev,
            sections: (prev.sections || []).map((section) => {
                const matches =
                    section.id === selectedId ||
                    section._id === selectedId;

                if (!matches) return section;

                if (group === "root") {
                    return {
                        ...section,
                        [property]: value,
                    };
                }

                return {
                    ...section,
                    [group]: {
                        ...(section[group] || {}),
                        [property]: value,
                    },
                };
            }),
        }));
    };

    const updateCss = (value) => {
        setLocalCss(value);
        updateElement("root", "customCss", value);
    };

    const resetStyle = () => {
        if (!selectedId) return;

        setConfig((prev) => ({
            ...prev,
            sections: (prev.sections || []).map((section) =>
                section.id === selectedId ||
                section._id === selectedId
                    ? {
                          ...section,
                          styles: {},
                          layout: {},
                          customCss: "",
                      }
                    : section
            ),
        }));

        setLocalCss("");
    };

    const styles = selectedSection?.styles || {};
    const layout = selectedSection?.layout || {};
    const content = selectedSection?.content || {};

    const title =
        selectedElement?.name ||
        selectedElement?.label ||
        selectedElement?.type ||
        "Element";

    const isSectionSelected = Boolean(selectedSection);

    return (
        <aside
            style={{ width: `${rightWidth}px` }}
            className="z-20 flex h-full min-w-0 shrink-0 flex-col border-l border-gray-200 bg-white"
        >
            {/* HEADER */}
            <div className="flex h-[65px] shrink-0 items-center justify-between border-b border-gray-200 px-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                        <Settings2 size={18} />
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-sm font-bold text-gray-900">
                            Properties
                        </h3>

                        <p className="truncate text-[11px] text-gray-400">
                            {selectedElement
                                ? `Editing ${title}`
                                : "Customize your storefront"}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    title="Close inspector"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                    <X size={17} />
                </button>
            </div>

            {!selectedElement ? (
                /* EMPTY STATE */
                <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                        <Layers size={25} />
                    </div>

                    <h3 className="text-sm font-semibold text-gray-800">
                        Nothing selected
                    </h3>

                    <p className="mt-2 max-w-[220px] text-xs leading-5 text-gray-400">
                        Select a section or element in your storefront
                        preview to customize its properties.
                    </p>
                </div>
            ) : (
                <>
                    {/* SELECTED ELEMENT */}
                    <div className="shrink-0 border-b border-gray-100 px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                                <Type size={17} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-gray-900">
                                    {title}
                                </p>

                                <p className="mt-0.5 text-[10px] text-gray-400">
                                    {selectedElement.type || "Element"}
                                </p>
                            </div>

                            <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">
                                Selected
                            </span>
                        </div>
                    </div>

                    {/* TABS */}
                    <div className="grid shrink-0 grid-cols-4 gap-1 border-b border-gray-200 px-2 pt-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const active = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex flex-col items-center gap-1 rounded-t-lg border-b-2 px-1 py-2.5 text-[10px] font-semibold transition ${
                                        active
                                            ? "border-orange-600 bg-orange-50/50 text-orange-600"
                                            : "border-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                                    }`}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* TAB CONTENT */}
                    <div className="flex-1 space-y-6 overflow-y-auto p-4 text-xs [scrollbar-width:thin]">

                        {/* CONTENT TAB */}
                        {activeTab === "content" && (
                            <>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="mb-1 text-xs font-bold text-gray-900">
                                            Element Information
                                        </h4>

                                        <p className="text-[11px] text-gray-400">
                                            Basic details of the selected element.
                                        </p>
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Element Name
                                        </label>

                                        <input
                                            value={selectedElement.name || ""}
                                            onChange={(e) =>
                                                updateElement(
                                                    "root",
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Element name"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Element Type
                                        </label>

                                        <input
                                            value={selectedElement.type || ""}
                                            disabled
                                            className={`${inputClass} bg-gray-50 text-gray-400`}
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <h4 className="mb-3 text-xs font-bold text-gray-900">
                                        Content Properties
                                    </h4>

                                    <div className="space-y-3">
                                        <div>
                                            <label className={labelClass}>
                                                Heading / Title
                                            </label>

                                            <input
                                                value={content.heading || ""}
                                                onChange={(e) =>
                                                    updateElement(
                                                        "content",
                                                        "heading",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter heading"
                                                className={inputClass}
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                Description
                                            </label>

                                            <textarea
                                                rows={4}
                                                value={content.description || ""}
                                                onChange={(e) =>
                                                    updateElement(
                                                        "content",
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter description"
                                                className={`${inputClass} resize-y`}
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                Button Text
                                            </label>

                                            <input
                                                value={content.buttonText || ""}
                                                onChange={(e) =>
                                                    updateElement(
                                                        "content",
                                                        "buttonText",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Shop Now"
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* STYLE TAB */}
                        {activeTab === "style" && (
                            <>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-900">
                                            Typography
                                        </h4>

                                        <p className="mt-1 text-[11px] text-gray-400">
                                            Customize text appearance.
                                        </p>
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Font Family
                                        </label>

                                        <select
                                            value={styles.fontFamily || "Inter"}
                                            onChange={(e) =>
                                                updateElement(
                                                    "styles",
                                                    "fontFamily",
                                                    e.target.value
                                                )
                                            }
                                            className={inputClass}
                                        >
                                            <option value="Inter">Inter</option>
                                            <option value="Arial">Arial</option>
                                            <option value="Roboto">Roboto</option>
                                            <option value="Poppins">Poppins</option>
                                            <option value="Georgia">Georgia</option>
                                            <option value="Playfair Display">
                                                Playfair Display
                                            </option>
                                            <option value="monospace">
                                                Monospace
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Font Size
                                        </label>

                                        <input
                                            type="text"
                                            value={styles.fontSize || ""}
                                            onChange={(e) =>
                                                updateElement(
                                                    "styles",
                                                    "fontSize",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="16px"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Font Weight
                                        </label>

                                        <select
                                            value={styles.fontWeight || "400"}
                                            onChange={(e) =>
                                                updateElement(
                                                    "styles",
                                                    "fontWeight",
                                                    e.target.value
                                                )
                                            }
                                            className={inputClass}
                                        >
                                            <option value="300">Light</option>
                                            <option value="400">Regular</option>
                                            <option value="500">Medium</option>
                                            <option value="600">Semibold</option>
                                            <option value="700">Bold</option>
                                            <option value="800">Extra Bold</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4 border-t border-gray-100 pt-4">
                                    <h4 className="text-xs font-bold text-gray-900">
                                        Colors
                                    </h4>

                                    <div>
                                        <label className={labelClass}>
                                            Text Color
                                        </label>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={styles.color || "#1f2937"}
                                                onChange={(e) =>
                                                    updateElement(
                                                        "styles",
                                                        "color",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-9 w-10 cursor-pointer rounded-lg border border-gray-200 bg-white p-1"
                                            />

                                            <input
                                                value={styles.color || "#1f2937"}
                                                onChange={(e) =>
                                                    updateElement(
                                                        "styles",
                                                        "color",
                                                        e.target.value
                                                    )
                                                }
                                                className={`${inputClass} font-mono uppercase`}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Background Color
                                        </label>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={styles.backgroundColor || "#ffffff"}
                                                onChange={(e) =>
                                                    updateElement(
                                                        "styles",
                                                        "backgroundColor",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-9 w-10 cursor-pointer rounded-lg border border-gray-200 bg-white p-1"
                                            />

                                            <input
                                                value={styles.backgroundColor || "#ffffff"}
                                                onChange={(e) =>
                                                    updateElement(
                                                        "styles",
                                                        "backgroundColor",
                                                        e.target.value
                                                    )
                                                }
                                                className={`${inputClass} font-mono uppercase`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 border-t border-gray-100 pt-4">
                                    <h4 className="text-xs font-bold text-gray-900">
                                        Borders
                                    </h4>

                                    <div>
                                        <label className={labelClass}>
                                            Border Radius
                                        </label>

                                        <input
                                            value={styles.borderRadius || ""}
                                            onChange={(e) =>
                                                updateElement(
                                                    "styles",
                                                    "borderRadius",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="12px"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Border
                                        </label>

                                        <input
                                            value={styles.border || ""}
                                            onChange={(e) =>
                                                updateElement(
                                                    "styles",
                                                    "border",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="1px solid #e5e7eb"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* LAYOUT TAB */}
                        {activeTab === "layout" && (
                            <>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-900">
                                        Spacing
                                    </h4>

                                    <p className="mt-1 text-[11px] text-gray-400">
                                        Control element spacing and dimensions.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-[11px] font-semibold text-gray-700">
                                        Padding
                                    </h4>

                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            ["paddingTop", "Top"],
                                            ["paddingBottom", "Bottom"],
                                            ["paddingLeft", "Left"],
                                            ["paddingRight", "Right"],
                                        ].map(([key, label]) => (
                                            <div key={key}>
                                                <label className={labelClass}>
                                                    {label}
                                                </label>

                                                <input
                                                    value={layout[key] || ""}
                                                    onChange={(e) =>
                                                        updateElement(
                                                            "layout",
                                                            key,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="16px"
                                                    className={inputClass}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3 border-t border-gray-100 pt-4">
                                    <h4 className="text-[11px] font-semibold text-gray-700">
                                        Margin
                                    </h4>

                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            ["marginTop", "Top"],
                                            ["marginBottom", "Bottom"],
                                            ["marginLeft", "Left"],
                                            ["marginRight", "Right"],
                                        ].map(([key, label]) => (
                                            <div key={key}>
                                                <label className={labelClass}>
                                                    {label}
                                                </label>

                                                <input
                                                    value={layout[key] || ""}
                                                    onChange={(e) =>
                                                        updateElement(
                                                            "layout",
                                                            key,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="0px"
                                                    className={inputClass}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3 border-t border-gray-100 pt-4">
                                    <h4 className="text-[11px] font-semibold text-gray-700">
                                        Dimensions
                                    </h4>

                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            ["width", "Width"],
                                            ["height", "Height"],
                                            ["maxWidth", "Max Width"],
                                            ["minHeight", "Min Height"],
                                        ].map(([key, label]) => (
                                            <div key={key}>
                                                <label className={labelClass}>
                                                    {label}
                                                </label>

                                                <input
                                                    value={layout[key] || ""}
                                                    onChange={(e) =>
                                                        updateElement(
                                                            "layout",
                                                            key,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="auto"
                                                    className={inputClass}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3 border-t border-gray-100 pt-4">
                                    <h4 className="text-[11px] font-semibold text-gray-700">
                                        Text Alignment
                                    </h4>

                                    <div className="flex rounded-lg border border-gray-200 p-1">
                                        {[
                                            ["left", AlignLeft],
                                            ["center", AlignCenter],
                                            ["right", AlignRight],
                                        ].map(([value, Icon]) => (
                                            <button
                                                key={value}
                                                onClick={() =>
                                                    updateElement(
                                                        "layout",
                                                        "textAlign",
                                                        value
                                                    )
                                                }
                                                className={`flex flex-1 items-center justify-center rounded-md py-2 transition ${
                                                    (layout.textAlign || "left") === value
                                                        ? "bg-orange-50 text-orange-600"
                                                        : "text-gray-500 hover:bg-gray-50"
                                                }`}
                                            >
                                                <Icon size={16} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ADVANCED TAB */}
                        {activeTab === "advanced" && (
                            <>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-900">
                                        Advanced Settings
                                    </h4>

                                    <p className="mt-1 text-[11px] text-gray-400">
                                        Configure custom CSS for this section.
                                    </p>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Custom CSS
                                    </label>

                                    <textarea
                                        rows={12}
                                        value={localCss}
                                        onChange={(e) =>
                                            updateCss(e.target.value)
                                        }
                                        placeholder={`border-radius: 12px;
box-shadow: 0 4px 12px rgba(0,0,0,0.08);
transition: all 0.3s ease;`}
                                        spellCheck={false}
                                        className="w-full resize-y rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-[11px] leading-6 text-gray-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                    />
                                </div>

                                <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                                    <p className="font-semibold text-amber-800">
                                        Custom CSS
                                    </p>

                                    <p className="mt-1 leading-5 text-amber-700">
                                        Only add CSS you trust. Invalid CSS
                                        may affect the appearance of your
                                        storefront.
                                    </p>
                                </div>

                                <div className="space-y-2 border-t border-gray-100 pt-4">
                                    <h4 className="text-xs font-bold text-gray-900">
                                        Element Details
                                    </h4>

                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-400">
                                            Element type
                                        </span>

                                        <span className="font-medium text-gray-700">
                                            {selectedElement.type || "Unknown"}
                                        </span>
                                    </div>

                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-400">
                                            Element ID
                                        </span>

                                        <span className="max-w-[130px] truncate font-mono text-gray-600">
                                            {selectedId || "Not available"}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="flex shrink-0 items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
                        <button
                            onClick={resetStyle}
                            disabled={!isSectionSelected}
                            className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <RotateCcw size={13} />
                            Reset styles
                        </button>

                        <span className="text-[10px] text-gray-400">
                            Auto-save enabled
                        </span>
                    </div>
                </>
            )}
        </aside>
    );
}
