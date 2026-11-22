
import { useState } from "react";
import {
    Palette,
    Search,
    Globe,
    ChevronRight,
    ArrowLeft,
    Settings2,
    Info,
    Monitor,
} from "lucide-react";

import ThemePanel from "../ThemePanel";
import SettingsPanel from "../SettingsPanel";

const SETTINGS_ITEMS = [
    {
        id: "theme",
        label: "Theme & Appearance",
        description: "Colors, typography and styling",
        icon: Palette,
        detail: "Customize your website's visual identity.",
    },
    {
        id: "seo",
        label: "SEO & Meta",
        description: "Search engine optimization",
        icon: Search,
        detail: "Manage how your website appears in search engines.",
    },
    {
        id: "general",
        label: "General Settings",
        description: "Website information",
        icon: Globe,
        detail: "Manage your website's basic information.",
    },
];

export default function SettingsTab({ config, setConfig }) {
    const [activeSetting, setActiveSetting] = useState(null);

    const activeItem = SETTINGS_ITEMS.find(
        (item) => item.id === activeSetting
    );

    // Render selected settings panel
    const renderSetting = () => {
        switch (activeSetting) {
            case "theme":
                return (
                    <ThemePanel
                        theme={config.theme}
                        setTheme={(fn) =>
                            setConfig((prev) => ({
                                ...prev,
                                theme:
                                    typeof fn === "function"
                                        ? fn(prev.theme)
                                        : fn,
                            }))
                        }
                    />
                );

            case "seo":
                return (
                    <SettingsPanel
                        storeName={config.storeName}
                        setStoreName={(name) =>
                            setConfig((prev) => ({
                                ...prev,
                                storeName: name,
                            }))
                        }
                        seo={config.seo}
                        setSeo={(fn) =>
                            setConfig((prev) => ({
                                ...prev,
                                seo:
                                    typeof fn === "function"
                                        ? fn(prev.seo)
                                        : fn,
                            }))
                        }
                    />
                );

            case "general":
                return (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/70 p-5">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                            <Monitor size={20} />
                        </div>

                        <h3 className="text-sm font-semibold text-gray-800">
                            General Website Settings
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                            General website configuration will be available here.
                            You can add options for website information,
                            language, regional preferences and other settings.
                        </p>

                        <div className="mt-4 flex items-start gap-2 rounded-lg bg-white p-3">
                            <Info
                                size={15}
                                className="mt-0.5 shrink-0 text-orange-500"
                            />
                            <p className="text-[11px] leading-4 text-gray-500">
                                More configuration options can be added as
                                Tandav's website management features grow.
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Individual settings view
    if (activeItem) {
        const ActiveIcon = activeItem.icon;

        return (
            <div className="animate-fadeIn space-y-5">

                {/* Settings Header */}
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">

                    <button
                        type="button"
                        onClick={() => setActiveSetting(null)}
                        title="Back to settings"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 cursor-pointer"
                    >
                        <ArrowLeft size={17} />
                    </button>

                    <div className="flex min-w-0 flex-1 items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                            <ActiveIcon size={19} />
                        </div>

                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-gray-900">
                                {activeItem.label}
                            </h3>

                            <p className="text-[11px] text-gray-400">
                                {activeItem.detail}
                            </p>
                        </div>

                    </div>

                </div>

                {/* Settings Content */}
                <div className="space-y-4">

                    <div className="flex items-center gap-2">
                        <Settings2 size={14} className="text-gray-400" />

                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                            Configuration
                        </h4>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-3">
                        {renderSetting()}
                    </div>

                </div>
            </div>
        );
    }

    // Default settings overview
    return (
        <div className="animate-fadeIn space-y-5">

            {/* Overview Header */}
            <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <Settings2 size={20} />
                </div>

                <div>
                    <h3 className="text-sm font-bold text-gray-900">
                        Website Settings
                    </h3>

                    <p className="mt-1 text-[11px] text-gray-400">
                        Manage your website preferences
                    </p>
                </div>

            </div>

            {/* Settings List */}
            <div className="space-y-2">

                {SETTINGS_ITEMS.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveSetting(item.id)}
                            className="group flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-left transition-all duration-200 hover:border-orange-200 hover:bg-orange-50/30 hover:shadow-sm cursor-pointer"
                        >

                            {/* Icon */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition group-hover:bg-orange-100 group-hover:text-orange-600">
                                <Icon size={18} />
                            </div>

                            {/* Details */}
                            <div className="min-w-0 flex-1">

                                <p className="text-xs font-semibold text-gray-800 transition group-hover:text-orange-700">
                                    {item.label}
                                </p>

                                <p className="mt-1 text-[10px] text-gray-400">
                                    {item.description}
                                </p>

                            </div>

                            {/* Arrow */}
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition group-hover:bg-orange-100 group-hover:text-orange-600">
                                <ChevronRight size={16} />
                            </div>

                        </button>
                    );
                })}

            </div>

            {/* Helper Card */}
            <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50/60 p-3">

                <Info
                    size={16}
                    className="mt-0.5 shrink-0 text-orange-600"
                />

                <div>
                    <p className="text-[11px] font-semibold text-gray-800">
                        Customize your website
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-gray-500">
                        Update your theme, SEO information and website
                        preferences from these settings.
                    </p>
                </div>

            </div>

        </div>
    );
}
