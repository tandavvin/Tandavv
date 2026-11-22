import {
    Layers3,
    Plus,
    ArrowLeft,
    ChevronRight,
    GripVertical,
    LayoutTemplate,
    PanelTop,
    Megaphone,
    Image,
    ShoppingBag,
    UserRound,
    Star,
    PanelBottom,
    Settings2,
    Info,
    FileText,
} from "lucide-react";

import NavbarPanel from "../NavbarPanel";
import HeroPanel from "../HeroPanel";
import ProductsPanel from "../ProductsPanel";
import AboutPanel from "../AboutPanel";
import TestimonialsPanel from "../TestimonialsPanel";
import FooterPanel from "../FooterPanel";
import CustomSectionPanel from "../CustomSectionPanel";
import { CORE_IDS } from "../storeConfig";


const SECTION_ICONS = {
    navbar: PanelTop,
    announcement: Megaphone,
    hero: Image,
    products: ShoppingBag,
    about: UserRound,
    testimonials: Star,
    footer: PanelBottom,
};


export default function SectionsTab({
    config,
    setConfig,
    activeSection,
    setActiveSection,
    setSelectedElement,
    openAddModal,
}) {
    const sections = config?.sections || [];

    // Update section configuration
    const updateSectionCfg = (id, patch) => {
        setConfig((prev) => {
            if (CORE_IDS.has(id)) {
                return {
                    ...prev,
                    [id]: {
                        ...prev[id],
                        ...patch,
                    },
                };
            }

            return {
                ...prev,
                custom: {
                    ...prev.custom,
                    [id]: {
                        ...prev.custom?.[id],
                        ...patch,
                    },
                },
            };
        });
    };


    // Rename custom section
    const handleRenameSection = (id, newLabel) => {
        setConfig((prev) => ({
            ...prev,
            sections: prev.sections.map((section) =>
                section.id === id
                    ? { ...section, label: newLabel }
                    : section
            ),
        }));
    };


    // Get selected section
    const activeSectionObj = sections.find(
        (section) => section.id === activeSection
    );


    // Render properties panel
    const renderActivePanel = () => {
        if (!activeSectionObj) {
            return (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                        <Settings2 size={22} />
                    </div>

                    <h3 className="text-sm font-semibold text-gray-800">
                        No section selected
                    </h3>

                    <p className="mt-1 max-w-[220px] text-xs leading-5 text-gray-400">
                        Select a section to customize its content and appearance.
                    </p>
                </div>
            );
        }

        switch (activeSectionObj.id) {
            case "navbar":
                return (
                    <NavbarPanel
                        navbar={config.navbar}
                        setNavbar={(fn) =>
                            setConfig((prev) => ({
                                ...prev,
                                navbar:
                                    typeof fn === "function"
                                        ? fn(prev.navbar)
                                        : fn,
                            }))
                        }
                        isLoggedIn={false}
                        setIsLoggedIn={() => {}}
                    />
                );

            case "hero":
                return (
                    <HeroPanel
                        hero={config.hero}
                        setHero={(fn) =>
                            setConfig((prev) => ({
                                ...prev,
                                hero:
                                    typeof fn === "function"
                                        ? fn(prev.hero)
                                        : fn,
                            }))
                        }
                    />
                );

            case "products":
                return (
                    <ProductsPanel
                        cfg={config.products}
                        setCfg={(fn) =>
                            setConfig((prev) => ({
                                ...prev,
                                products:
                                    typeof fn === "function"
                                        ? fn(prev.products)
                                        : fn,
                            }))
                        }
                    />
                );

            case "about":
                return (
                    <AboutPanel
                        cfg={config.about}
                        setCfg={(fn) =>
                            setConfig((prev) => ({
                                ...prev,
                                about:
                                    typeof fn === "function"
                                        ? fn(prev.about)
                                        : fn,
                            }))
                        }
                    />
                );

            case "testimonials":
                return (
                    <TestimonialsPanel
                        cfg={config.testimonials}
                        setCfg={(fn) =>
                            setConfig((prev) => ({
                                ...prev,
                                testimonials:
                                    typeof fn === "function"
                                        ? fn(prev.testimonials)
                                        : fn,
                            }))
                        }
                    />
                );

            case "footer":
                return (
                    <FooterPanel
                        cfg={config.footer}
                        setCfg={(fn) =>
                            setConfig((prev) => ({
                                ...prev,
                                footer:
                                    typeof fn === "function"
                                        ? fn(prev.footer)
                                        : fn,
                            }))
                        }
                    />
                );

            default:
                return config.custom?.[activeSectionObj.id] ? (
                    <CustomSectionPanel
                        cfg={config.custom[activeSectionObj.id]}
                        setCfg={(fn) =>
                            updateSectionCfg(
                                activeSectionObj.id,
                                typeof fn === "function"
                                    ? fn(config.custom[activeSectionObj.id])
                                    : fn
                            )
                        }
                        label={activeSectionObj.label}
                        onRename={(label) =>
                            handleRenameSection(activeSectionObj.id, label)
                        }
                    />
                ) : (
                    <div className="py-10 text-center text-xs text-gray-400">
                        No settings available for this section.
                    </div>
                );
        }
    };


    // Selected section properties view
    if (activeSection && activeSectionObj) {
        const ActiveIcon =
            SECTION_ICONS[activeSectionObj.id] || FileText;

        return (
            <div className="animate-fadeIn space-y-5">

                {/* Properties Header */}
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">

                    <button
                        onClick={() => setActiveSection(null)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 cursor-pointer"
                        title="Back to sections"
                    >
                        <ArrowLeft size={17} />
                    </button>

                    <div className="flex min-w-0 flex-1 items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                            <ActiveIcon size={19} />
                        </div>

                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-gray-900">
                                {activeSectionObj.label}
                            </h3>

                            <p className="text-[11px] text-gray-400">
                                Section properties
                            </p>
                        </div>

                    </div>

                    <span className="rounded-lg bg-orange-50 px-2 py-1 text-[10px] font-semibold text-orange-600">
                        Editing
                    </span>
                </div>


                {/* Properties Content */}
                <div className="space-y-4">

                    <div className="flex items-center gap-2">
                        <Settings2 size={14} className="text-gray-400" />

                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                            Customize Section
                        </h4>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-3">
                        {renderActivePanel()}
                    </div>

                </div>

            </div>
        );
    }


    // Default sections list view
    return (
        <div className="animate-fadeIn space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">

                <div>
                    <div className="flex items-center gap-2">
                        <Layers3 size={16} className="text-orange-600" />

                        <h3 className="text-sm font-bold text-gray-900">
                            Page Sections
                        </h3>

                        <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500">
                            {sections.length}
                        </span>
                    </div>

                    <p className="mt-1 text-[11px] text-gray-400">
                        Manage your page layout
                    </p>
                </div>


                <button
                    onClick={openAddModal}
                    className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-orange-700 active:scale-95 cursor-pointer"
                >
                    <Plus size={14} />
                    Add Section
                </button>

            </div>


            {/* Section List */}
            {sections.length > 0 ? (
                <div className="space-y-2">

                    {sections.map((section, index) => {
                        const active = activeSection === section.id;

                        const SectionIcon =
                            SECTION_ICONS[section.id] || FileText;

                        return (
                            <button
                                key={section.id}
                                type="button"
                                onClick={() => {
                                    setActiveSection(section.id);

                                    setSelectedElement({
                                        type: "section",
                                        id: section.id,
                                    });
                                }}
                                className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer ${
                                    active
                                        ? "border-orange-300 bg-orange-50/70 shadow-sm ring-1 ring-orange-100"
                                        : "border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/30"
                                }`}
                            >

                                {/* Drag Handle - visual only */}
                                <span className="shrink-0 text-gray-300 transition group-hover:text-gray-500">
                                    <GripVertical size={16} />
                                </span>


                                {/* Section Icon */}
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                                        active
                                            ? "bg-orange-100 text-orange-600"
                                            : "bg-gray-100 text-gray-500 group-hover:bg-orange-50 group-hover:text-orange-600"
                                    }`}
                                >
                                    <SectionIcon size={17} />
                                </div>


                                {/* Section Name */}
                                <div className="min-w-0 flex-1">
                                    <p
                                        className={`truncate text-xs font-semibold ${
                                            active
                                                ? "text-orange-700"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {section.label}
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-gray-400">
                                        Section {index + 1}
                                    </p>
                                </div>


                                {/* Active Indicator */}
                                {active ? (
                                    <span className="rounded-md bg-orange-100 px-2 py-1 text-[9px] font-bold text-orange-600">
                                        Active
                                    </span>
                                ) : (
                                    <ChevronRight
                                        size={15}
                                        className="shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-orange-500"
                                    />
                                )}

                            </button>
                        );
                    })}

                </div>
            ) : (

                /* Empty State */
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 px-5 py-10 text-center">

                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                        <LayoutTemplate size={23} />
                    </div>

                    <h3 className="text-sm font-semibold text-gray-800">
                        No sections yet
                    </h3>

                    <p className="mx-auto mt-1 max-w-[210px] text-xs leading-5 text-gray-400">
                        Start building your page by adding your first section.
                    </p>

                    <button
                        onClick={openAddModal}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-orange-700 cursor-pointer"
                    >
                        <Plus size={15} />
                        Add Your First Section
                    </button>

                </div>
            )}


            {/* Helper Card */}
            {sections.length > 0 && (
                <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50/60 p-3">

                    <div className="mt-0.5 text-orange-600">
                        <Info size={16} />
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold text-gray-800">
                            Customize your page
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-gray-500">
                            Select any section to edit its content, design, and settings.
                        </p>
                    </div>

                </div>
            )}

        </div>
    );
}