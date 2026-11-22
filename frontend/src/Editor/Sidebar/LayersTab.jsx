import { useMemo, useState } from "react";
import {
    ChevronDown,
    ChevronRight,
    Layers,
    LayoutTemplate,
    PanelTop,
    ShoppingBag,
    Type,
    Grid3X3,
    Search,
    Image,
    FileText,
    MousePointerClick,
    MessageSquare,
    HelpCircle,
    Zap,
    Columns2,
} from "lucide-react";

export default function LayersTab({
    config,
    selectedSectionId,
    onSelectSection,
}) {
    const [expandedSections, setExpandedSections] = useState([
        "navbar",
        "hero",
        "products",
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const sections = config?.sections || [];
    const storeName = config?.storeName || "My Store";

    // Section-specific child elements with dynamic counts
    const getChildren = (section) => {
        switch (section.id) {
            case "navbar":
                return [
                    { id: "logo", label: "Logo / Brand", icon: Image },
                    { id: "navigation", label: `Navigation Links (${config?.navbar?.navLinks?.length || 0})`, icon: FileText },
                ];

            case "hero":
                return [
                    { id: "headline", label: "Headline / Title", icon: Type },
                    { id: "subtitle", label: "Subtitle", icon: FileText },
                    { id: "cta", label: "CTA Buttons", icon: MousePointerClick },
                ];

            case "products":
                return [
                    {
                        id: "product-grid",
                        label: `Product Grid (${config?.products?.columns || 3} cols)`,
                        icon: Grid3X3,
                    },
                    {
                        id: "product-cards",
                        label: `Product Cards (${config?.products?.items?.length || 0})`,
                        icon: ShoppingBag,
                    },
                ];

            case "about":
                return [
                    { id: "about-story", label: "Story & Description", icon: FileText },
                    { id: "about-features", label: `Check-list (${config?.about?.features?.length || 0})`, icon: Zap },
                    { id: "about-stats", label: `Numbers/Stats (${config?.about?.stats?.length || 0})`, icon: Grid3X3 },
                ];

            case "testimonials":
                return [
                    {
                        id: "reviews-list",
                        label: `Customer Reviews (${config?.testimonials?.items?.length || 0})`,
                        icon: MessageSquare,
                    },
                ];

            case "footer":
                return [
                    { id: "footer-content", label: "Brand Description", icon: FileText },
                    { id: "footer-links", label: `Quick Links (${config?.footer?.links?.length || 0})`, icon: FileText },
                    { id: "footer-socials", label: `Social Profiles (${config?.footer?.socials?.length || 0})`, icon: Columns2 },
                ];

            default: {
                const customCfg = config?.custom?.[section.id];
                const type = customCfg?.type || "text";

                if (type === "faq") {
                    return [
                        { id: "faq-items", label: `FAQ Questions (${customCfg?.items?.length || 0})`, icon: HelpCircle }
                    ];
                }
                if (type === "features") {
                    return [
                        { id: "feature-items", label: `Feature Cards (${customCfg?.items?.length || 0})`, icon: Zap }
                    ];
                }
                if (type === "gallery") {
                    return [
                        { id: "gallery-items", label: `Gallery Photos (${customCfg?.items?.length || 0})`, icon: Image }
                    ];
                }
                if (type === "pricing") {
                    return [
                        { id: "pricing-plans", label: `Pricing Plans (${customCfg?.plans?.length || 0})`, icon: ShoppingBag }
                    ];
                }
                if (type === "cta") {
                    return [
                        { id: "cta-content", label: "Banner Content & Buttons", icon: MousePointerClick }
                    ];
                }

                return [
                    { id: "text-content", label: "Text Block Content", icon: FileText }
                ];
            }
        }
    };

    const toggleExpand = (id, e) => {
        e?.stopPropagation();
        setExpandedSections((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const filteredSections = useMemo(() => {
        if (!searchTerm.trim()) return sections;
        const search = searchTerm.toLowerCase();
        return sections.filter((section) => {
            const children = getChildren(section);
            return (
                section.label?.toLowerCase().includes(search) ||
                section.id?.toLowerCase().includes(search) ||
                children.some((child) => child.label.toLowerCase().includes(search))
            );
        });
    }, [sections, searchTerm, config]);

    const getSectionIcon = (id) => {
        switch (id) {
            case "navbar": return PanelTop;
            case "hero": return LayoutTemplate;
            case "products": return ShoppingBag;
            case "testimonials": return MessageSquare;
            case "footer": return Layers;
            default: return FileText;
        }
    };

    const isExpanded = (id) => expandedSections.includes(id);

    return (
        <div className="space-y-4 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xs font-bold text-gray-800">Layers</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">Manage your page structure</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-600">
                    <Layers size={12} />
                    {sections.length} Sections
                </span>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search layers..."
                    className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-xs outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
            </div>

            {/* Document Tree */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xs">
                {/* Root Node */}
                <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-3 py-3">
                    <LayoutTemplate size={15} className="text-orange-600" />
                    <span className="text-xs font-bold text-gray-800 truncate">{storeName}</span>
                    <span className="ml-auto rounded-md bg-white border border-gray-200 px-1.5 py-0.5 text-[9px] text-gray-500">PAGE</span>
                </div>

                {/* Sections */}
                <div className="p-2">
                    {filteredSections.length > 0 ? (
                        <div className="space-y-1">
                            {filteredSections.map((section) => {
                                const Icon = getSectionIcon(section.id);
                                const children = getChildren(section);
                                const expanded = isExpanded(section.id) || !!searchTerm;
                                const selected = selectedSectionId === section.id;

                                return (
                                    <div key={section.id}>
                                        {/* Section Row (Clicking anywhere here expands/collapses) */}
                                        <div
                                            onClick={(e) => toggleExpand(section.id, e)}
                                            className={`group flex items-center gap-1.5 rounded-lg px-2 py-2 transition cursor-pointer ${
                                                selected
                                                    ? "bg-orange-50 text-orange-700 font-medium"
                                                    : "hover:bg-gray-50 text-gray-700"
                                            }`}
                                        >
                                            {/* Chevron Icon Indicator */}
                                            <span className="rounded p-0.5 text-gray-400">
                                                {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                                            </span>

                                            {/* Section Label (Clicking this also selects/highlights the section for editing) */}
                                            <div 
                                                className="flex min-w-0 flex-1 items-center gap-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectSection?.(section.id);
                                                }}
                                            >
                                                <Icon size={14} className={selected ? "text-orange-600" : "text-gray-500"} />
                                                <span className="truncate text-[11px] font-semibold">{section.label || section.id}</span>
                                            </div>
                                        </div>

                                        {/* Nested Children */}
                                        {expanded && children.length > 0 && (
                                            <div className="ml-[22px] border-l border-gray-200 py-1 pl-3 space-y-1">
                                                {children.map((child) => {
                                                    const ChildIcon = child.icon;
                                                    return (
                                                        <div
                                                            key={child.id}
                                                            className="flex items-center gap-2 rounded-md px-2 py-1 text-gray-500 hover:bg-gray-50 transition"
                                                        >
                                                            <ChildIcon size={12} className="shrink-0 text-gray-400" />
                                                            <span className="truncate text-[10px]">{child.label}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Layers size={25} className="mb-2 text-gray-300" />
                            <p className="text-xs font-semibold text-gray-600">{searchTerm ? "No layers found" : "No sections available"}</p>
                            <p className="mt-1 text-[10px] text-gray-400">{searchTerm ? "Try another search term." : "Add sections to your page to see them here."}</p>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-3 py-2">
                    <span className="text-[9px] text-gray-400">Document Structure</span>
                    <span className="text-[9px] font-medium text-gray-500">{sections.length} Total Layers</span>
                </div>
            </div>
        </div>
    );
}