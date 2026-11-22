import { useState, useMemo } from "react";
import {
    Heading1,
    AlignLeft,
    MousePointer2,
    Image,
    Video,
    Minus,
    MoveVertical,
    Layout,
    Square,
    Grid2X2,
    Rows3,
    Navigation,
    Megaphone,
    PanelsTopLeft,
    Clapperboard,
    ShoppingBag,
    Tag,
    BookOpen,
    Sparkles,
    Images,
    MessageSquareQuote,
    CircleHelp,
    PanelBottom,
    Search,
    X,
    GripVertical,
    Plus,
    Blocks,
} from "lucide-react";

const COMPONENT_LIBRARY = [
    // Basic Elements
    {
        name: "Heading",
        category: "Basic Elements",
        icon: Heading1,
        desc: "Add a title or heading",
    },
    {
        name: "Paragraph",
        category: "Basic Elements",
        icon: AlignLeft,
        desc: "Add text content",
    },
    {
        name: "Button",
        category: "Basic Elements",
        icon: MousePointer2,
        desc: "Add an interactive button",
    },
    {
        name: "Image",
        category: "Basic Elements",
        icon: Image,
        desc: "Display an image",
    },
    {
        name: "Video",
        category: "Basic Elements",
        icon: Video,
        desc: "Embed a video",
    },
    {
        name: "Divider",
        category: "Basic Elements",
        icon: Minus,
        desc: "Separate content blocks",
    },
    {
        name: "Spacer",
        category: "Basic Elements",
        icon: MoveVertical,
        desc: "Control vertical spacing",
    },

    // Layout Blocks
    {
        name: "Section",
        category: "Layout Blocks",
        icon: Layout,
        desc: "Full-width content section",
    },
    {
        name: "Container",
        category: "Layout Blocks",
        icon: Square,
        desc: "Centered content wrapper",
    },
    {
        name: "Grid Container",
        category: "Layout Blocks",
        icon: Grid2X2,
        desc: "Create a grid layout",
    },
    {
        name: "Flex Row",
        category: "Layout Blocks",
        icon: Rows3,
        desc: "Arrange items horizontally",
    },

    // Heroes & Navbars
    {
        name: "Navbar",
        category: "Heroes & Navbars",
        icon: Navigation,
        desc: "Website navigation header",
    },
    {
        name: "Banner Hero",
        category: "Heroes & Navbars",
        icon: Megaphone,
        desc: "Headline with call-to-action",
    },
    {
        name: "Split Hero",
        category: "Heroes & Navbars",
        icon: PanelsTopLeft,
        desc: "Text with image layout",
    },
    {
        name: "Video Hero",
        category: "Heroes & Navbars",
        icon: Clapperboard,
        desc: "Hero with background video",
    },

    // Commerce & Content
    {
        name: "Product Grid",
        category: "Commerce & Content",
        icon: ShoppingBag,
        desc: "Display multiple products",
    },
    {
        name: "Product Card",
        category: "Commerce & Content",
        icon: Tag,
        desc: "Showcase a single product",
    },
    {
        name: "About Block",
        category: "Commerce & Content",
        icon: BookOpen,
        desc: "Share your business story",
    },
    {
        name: "Feature Grid",
        category: "Commerce & Content",
        icon: Sparkles,
        desc: "Highlight business features",
    },
    {
        name: "Gallery",
        category: "Commerce & Content",
        icon: Images,
        desc: "Showcase photos and visuals",
    },

    // Social Proof
    {
        name: "Testimonials Grid",
        category: "Social Proof",
        icon: MessageSquareQuote,
        desc: "Display customer reviews",
    },
    {
        name: "FAQ Accordion",
        category: "Social Proof",
        icon: CircleHelp,
        desc: "Frequently asked questions",
    },
    {
        name: "Footer",
        category: "Social Proof",
        icon: PanelBottom,
        desc: "Website footer and links",
    },
];

const CATEGORIES = [
    "All",
    "Basic Elements",
    "Layout Blocks",
    "Heroes & Navbars",
    "Commerce & Content",
    "Social Proof",
];

export default function AddComponentTab({ onSelectComponent }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredItems = useMemo(() => {
        return COMPONENT_LIBRARY.filter((item) => {
            const matchesCategory =
                selectedCategory === "All" ||
                item.category === selectedCategory;

            const matchesSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.desc.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, selectedCategory]);

    const handleDragStart = (event, item) => {
        event.dataTransfer.setData(
            "application/tandav-component",
            JSON.stringify({
                name: item.name,
                category: item.category,
            })
        );

        event.dataTransfer.effectAllowed = "copy";
    };

    return (
        <div className="space-y-5 animate-fadeIn">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-gray-900">
                        Add Elements
                    </h3>
                    <p className="mt-1 text-[11px] text-gray-400">
                        Build your website with components
                    </p>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <Blocks size={17} />
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                    type="text"
                    placeholder="Search elements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-9 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
                />

                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                        aria-label="Clear search"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Category Filter */}
            <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Categories
                </p>

                <div className="flex gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none]">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setSelectedCategory(category)}
                            className={`shrink-0 rounded-lg px-3 py-2 text-[10px] font-semibold transition-all cursor-pointer ${
                                selectedCategory === category
                                    ? "bg-orange-600 text-white shadow-sm shadow-orange-600/20"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h4 className="text-[11px] font-bold text-gray-700">
                    {selectedCategory === "All"
                        ? "All Elements"
                        : selectedCategory}
                </h4>

                <span className="rounded-md bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-500">
                    {filteredItems.length} items
                </span>
            </div>

            {/* Components Grid */}
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                    {filteredItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.name}
                                type="button"
                                draggable
                                onDragStart={(event) =>
                                    handleDragStart(event, item)
                                }
                                onClick={() =>
                                    onSelectComponent?.(item)
                                }
                                title={`Add ${item.name}`}
                                className="group relative flex min-h-[105px] flex-col rounded-xl border border-gray-200 bg-white p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50/30 hover:shadow-md active:scale-[0.98] cursor-grab active:cursor-grabbing"
                            >
                                {/* Card Icon */}
                                <div className="flex w-full items-start justify-between">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors group-hover:bg-orange-100 group-hover:text-orange-600">
                                        <Icon size={18} strokeWidth={1.8} />
                                    </div>

                                    <GripVertical
                                        size={15}
                                        className="text-gray-300 transition-colors group-hover:text-orange-400"
                                    />
                                </div>

                                {/* Card Details */}
                                <div className="mt-3">
                                    <h5 className="text-[11px] font-bold text-gray-800 transition-colors group-hover:text-orange-600">
                                        {item.name}
                                    </h5>

                                    <p className="mt-1 line-clamp-2 text-[9px] leading-relaxed text-gray-400">
                                        {item.desc}
                                    </p>
                                </div>

                                {/* Add Indicator */}
                                <div className="absolute bottom-3 right-3 flex h-5 w-5 items-center justify-center rounded-md bg-orange-50 text-orange-500 opacity-0 transition-all group-hover:opacity-100">
                                    <Plus size={12} />
                                </div>
                            </button>
                        );
                    })}
                </div>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 px-4 py-10 text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                        <Search size={19} />
                    </div>

                    <h4 className="mt-3 text-xs font-semibold text-gray-700">
                        No elements found
                    </h4>

                    <p className="mt-1 text-[10px] text-gray-400">
                        Try another search or category.
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            setSearchQuery("");
                            setSelectedCategory("All");
                        }}
                        className="mt-3 text-[10px] font-semibold text-orange-600 hover:text-orange-700"
                    >
                        Clear filters
                    </button>
                </div>
            )}

            {/* Footer Tip */}
            <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-3">
                <div className="flex items-start gap-2">
                    <MousePointer2
                        size={15}
                        className="mt-0.5 shrink-0 text-orange-600"
                    />

                    <div>
                        <p className="text-[10px] font-semibold text-orange-800">
                            Quick tip
                        </p>

                        <p className="mt-1 text-[10px] leading-relaxed text-orange-700/80">
                            Drag an element onto your website preview or click it to add it.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}