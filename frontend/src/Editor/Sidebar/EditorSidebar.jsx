import { useState } from "react";
import {
    Plus,
    LayoutGrid,
    FileText,
    Layers3,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";

import AddComponentTab from "./AddComponentTab";
import SectionsTab from "./SectionsTab";
import PagesTab from "./PagesTab";
import LayersTab from "./LayersTab";
import { getStoredUser } from "../../utils/api";

const ASIDE_NAV_ITEMS = [
    {
        id: "add",
        label: "Add Elements",
        icon: Plus,
    },
    {
        id: "sections",
        label: "Sections & Theme",
        icon: LayoutGrid,
    },
    {
        id: "pages",
        label: "Pages",
        icon: FileText,
    },
    {
        id: "layers",
        label: "Layers Tree",
        icon: Layers3,
    },
];

export default function EditorSidebar({
    leftWidth,
    config,
    setConfig,
    activeSection,
    setActiveSection,
    setSelectedElement,
    openAddModal,
}) {
    const [activePanel, setActivePanel] = useState("sections");
    const [isCollapsed, setIsCollapsed] = useState(false);

    const user = getStoredUser();

    const userInitial = user?.name
        ? user.name.trim().charAt(0).toUpperCase()
        : "U";

    const activeItem = ASIDE_NAV_ITEMS.find(
        (item) => item.id === activePanel
    );

    const ActiveIcon = activeItem?.icon;

    const handlePanelClick = (id) => {
        if (activePanel === id && !isCollapsed) {
            setIsCollapsed(true);
        } else {
            setActivePanel(id);
            setIsCollapsed(false);
        }
    };

    return (
        <aside className="z-20 flex h-full shrink-0 border-r border-gray-200 bg-white shadow-sm">

            {/* 1. Icon Navigation Bar */}
            <div className="flex w-14 shrink-0 flex-col items-center justify-between border-r border-gray-100 bg-gray-50/80 py-4">

                {/* Navigation Items */}
                <div className="flex w-full flex-col items-center gap-2 px-2">
                    {ASIDE_NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            activePanel === item.id && !isCollapsed;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => handlePanelClick(item.id)}
                                title={item.label}
                                aria-label={item.label}
                                aria-pressed={isActive}
                                className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                                        : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                                }`}
                            >
                                <Icon
                                    size={19}
                                    strokeWidth={isActive ? 2.3 : 1.9}
                                />

                                {/* Active Indicator */}
                                {isActive && (
                                    <span className="absolute -left-[8px] h-5 w-[3px] rounded-r-full bg-orange-600" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Bottom Profile and Collapse */}
                <div className="flex flex-col items-center gap-3">

                    {/* User Avatar */}
                    <button
                        type="button"
                        title={user?.name || "User Profile"}
                        aria-label="User profile"
                        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-orange-200 bg-orange-100 text-xs font-bold text-orange-700 shadow-sm transition-all hover:ring-2 hover:ring-orange-400 hover:ring-offset-2 cursor-pointer"
                    >
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user?.name || "Profile"}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            userInitial
                        )}
                    </button>

                    {/* Collapse Button */}
                    <button
                        type="button"
                        onClick={() =>
                            setIsCollapsed((prev) => !prev)
                        }
                        title={
                            isCollapsed
                                ? "Expand sidebar"
                                : "Collapse sidebar"
                        }
                        aria-label={
                            isCollapsed
                                ? "Expand sidebar"
                                : "Collapse sidebar"
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-gray-200 hover:text-gray-700 cursor-pointer"
                    >
                        {isCollapsed ? (
                            <ChevronRight size={18} />
                        ) : (
                            <ChevronLeft size={18} />
                        )}
                    </button>
                </div>
            </div>

            {/* 2. Expandable Flyout Panel */}
            {!isCollapsed && (
                <div
                    style={{
                        width: `${Math.max(0, leftWidth - 56)}px`,
                    }}
                    className="flex h-full min-w-0 flex-col bg-white animate-fadeIn"
                >
                    {/* Panel Header */}
                    <div className="flex h-[57px] shrink-0 items-center justify-between border-b border-gray-100 px-4">

                        <div className="flex min-w-0 items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                                {ActiveIcon && (
                                    <ActiveIcon size={17} />
                                )}
                            </div>

                            <div className="min-w-0">
                                <h3 className="truncate text-[13px] font-semibold text-gray-900">
                                    {activeItem?.label}
                                </h3>

                                <p className="text-[10px] font-medium text-gray-400">
                                    Website Editor
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsCollapsed(true)}
                            title="Close panel"
                            aria-label="Close panel"
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Panel Content */}
                    <div className="min-h-0 flex-1 overflow-y-auto bg-white p-4 space-y-4 [scrollbar-width:thin] [scrollbar-color:#d1d5db_transparent]">

                        {activePanel === "add" && (
                            <AddComponentTab />
                        )}

                        {activePanel === "sections" && (
                            <SectionsTab
                                config={config}
                                setConfig={setConfig}
                                activeSection={activeSection}
                                setActiveSection={setActiveSection}
                                setSelectedElement={setSelectedElement}
                                openAddModal={openAddModal}
                            />
                        )}

                        {activePanel === "pages" && (
                            <PagesTab />
                        )}

                        {activePanel === "layers" && (
                            <LayersTab
                                config={config}
                                selectedSectionId={activeSection}
                                onSelectSection={setActiveSection}
                            />
                        )}
                    </div>
                </div>
            )}
        </aside>
    );
}