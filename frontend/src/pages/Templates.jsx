//src/pages/Templates.jsx

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
  Eye,
  LayoutTemplate,
  Sparkles,
  X,
  Heart,
  SlidersHorizontal,
  Monitor,
  Smartphone,
  Check,
  ChevronDown,
  Star,
  RotateCcw,
} from "lucide-react";

import { getToken } from "../utils/api";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

const TEMPLATES = [
  {
    id: "modern-store",
    name: "Modern Store",
    storeName: "Vogue",
    category: "E-commerce",
    type: "Dynamic",
    layout: "MPA",
    pricing: "Free",
    price: "Free",
    description: "Perfect for eCommerce businesses with product catalogs.",
    title: "Grow Your Business\nWith Tandav",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
    popular: true,
    products: [
      { img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80", name: "Classic Jacket", price: "$49.00" },
      { img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=150&q=80", name: "Summer Dress", price: "$35.00" },
      { img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=150&q=80", name: "Casual Tee", price: "$22.00" },
      { img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=150&q=80", name: "Denim Jeans", price: "$59.00" },
    ],
  },
  {
    id: "creative-agency",
    name: "Creative Agency",
    storeName: "Studio",
    category: "Agency",
    type: "Static",
    layout: "SPA",
    pricing: "Free",
    price: "Free",
    description: "Ideal for creative professionals and digital studios.",
    title: "Build Something\nAmazing",
    banner: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    popular: true,
    products: [
      { img: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=150&q=80", name: "Smart Device", price: "$129.00" },
      { img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=150&q=80", name: "Smart Watch", price: "$89.00" },
      { img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80", name: "Headphones", price: "$199.00" },
      { img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&q=80", name: "Controller", price: "$59.00" },
    ],
  },
  {
    id: "health-care",
    name: "Health Care",
    storeName: "CareMed",
    category: "Health & Wellness",
    type: "Dynamic",
    layout: "MPA",
    pricing: "Free",
    price: "Free",
    description: "For clinics, doctors, and wellness centers with bookings.",
    title: "Your Health\nOur Priority",
    banner: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
    popular: false,
    products: [
      { img: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=150&q=80", name: "First Aid Kit", price: "$24.00" },
      { img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=150&q=80", name: "Vitamins", price: "$18.00" },
      { img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=150&q=80", name: "Digital Check", price: "$45.00" },
      { img: "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=150&q=80", name: "Mask Pack", price: "$12.00" },
    ],
  },
  {
    id: "restaurant",
    name: "Restaurant",
    storeName: "Bistro",
    category: "Food & Beverage",
    type: "Static",
    layout: "SPA",
    pricing: "Free",
    price: "Free",
    description: "For food & dining businesses to showcase menus.",
    title: "Delicious Food\nGreat Mood",
    banner: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    popular: false,
    products: [
      { img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80", name: "Burger Meal", price: "$14.00" },
      { img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=150&q=80", name: "Artisan Pizza", price: "$18.00" },
      { img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=150&q=80", name: "Fresh Salad", price: "$10.00" },
      { img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=150&q=80", name: "Dessert Special", price: "$8.00" },
    ],
  },
  {
    id: "education",
    name: "Education",
    storeName: "Academy",
    category: "Education",
    type: "Dynamic",
    layout: "MPA",
    pricing: "Free",
    price: "Free",
    description: "For schools & online courses with student portals.",
    title: "Learn. Grow.\nSucceed.",
    banner: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
    popular: false,
    products: [
      { img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80", name: "React Course", price: "$99.00" },
      { img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=150&q=80", name: "UI/UX Master", price: "$89.00" },
      { img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=150&q=80", name: "Python Basics", price: "$49.00" },
      { img: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=150&q=80", name: "Marketing 101", price: "$59.00" },
    ],
  },
  {
    id: "business-pro",
    name: "Business Pro",
    storeName: "Enterprise",
    category: "Business",
    type: "Static",
    layout: "MPA",
    pricing: "Free",
    price: "Free",
    description: "For corporate and business websites, portfolios.",
    title: "Innovate. Scale.\nGrow.",
    banner: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    popular: true,
    products: [
      { img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&q=80", name: "Consulting", price: "$150/hr" },
      { img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=150&q=80", name: "Strategy Audit", price: "$499.00" },
      { img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=150&q=80", name: "Team Training", price: "$299.00" },
      { img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=150&q=80", name: "Growth Pack", price: "$799.00" },
    ],
  },
  {
    id: "real-estate-hub",
    name: "Estate Listing Hub",
    storeName: "Realty",
    category: "Real Estate",
    type: "Dynamic",
    layout: "MPA",
    pricing: "Premium",
    price: "₹999",
    description: "Advanced property listings, filters, and agent dashboards.",
    title: "Find Your Dream\nProperty Today",
    banner: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    popular: false,
    products: [
      { img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=150&q=80", name: "Modern Villa", price: "$450k" },
      { img: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=150&q=80", name: "City Apartment", price: "$220k" },
      { img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=150&q=80", name: "Suburban Home", price: "$310k" },
      { img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=150&q=80", name: "Luxury Condo", price: "$550k" },
    ],
  },
  {
    id: "portfolio-minimal",
    name: "Minimalist Portfolio",
    storeName: "Portfolio",
    category: "Portfolio",
    type: "Static",
    layout: "SPA",
    pricing: "Premium",
    price: "₹499",
    description: "Showcase creative work, case studies, and personal brand.",
    title: "Design. Code.\nCreate.",
    banner: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
    popular: false,
    products: [
      { img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=150&q=80", name: "UI Case Study", price: "Free" },
      { img: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=150&q=80", name: "Brand Identity", price: "$150" },
      { img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=150&q=80", name: "Web App UI", price: "$200" },
      { img: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=150&q=80", name: "Mobile Design", price: "$120" },
    ],
  },
];


const CATEGORIES = [
  "All Templates",
  "E-commerce",
  "Agency",
  "Health & Wellness",
  "Food & Beverage",
  "Education",
  "Business",
  "Real Estate",
  "Portfolio",
];

const SORT_OPTIONS = [
  { label: "Popular", value: "popular" },
  { label: "Name: A to Z", value: "name-asc" },
  { label: "Name: Z to A", value: "name-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

const getTemplatePrice = (template) => {
  if (template.pricing === "Free") return 0;

  return Number(
    String(template.price).replace(/[^\d.]/g, "")
  ) || 0;
};

/* --------------------------------------------------
   TEMPLATE CARD
-------------------------------------------------- */

export function TemplatePreviewCard({
  template,
  onPreview,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-900/5">

      {/* Website Preview */}
      <div className="relative overflow-hidden bg-gray-100 p-3">
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white">

          {/* Browser Header */}
          <div className="flex h-9 items-center justify-between border-b border-gray-100 bg-white px-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="h-2 w-2 rounded-full bg-green-400" />
            </div>

            <div className="mx-4 flex-1 rounded-md bg-gray-100 px-3 py-1 text-center text-[8px] text-gray-400">
              {template.storeName.toLowerCase()}.tandav.com
            </div>
          </div>

          {/* Banner */}
          <div className="relative h-48 overflow-hidden sm:h-52">
            <img
              src={template.banner}
              alt={`${template.name} website preview`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute inset-x-4 bottom-4">
              <p className="whitespace-pre-line text-lg font-bold leading-tight text-white">
                {template.title}
              </p>

              <span className="mt-3 inline-flex rounded-md bg-white px-3 py-1.5 text-[9px] font-bold text-gray-900">
                Explore Store
              </span>
            </div>
          </div>

          {/* Product Preview */}
          <div className="grid grid-cols-4 gap-2 bg-white p-3">
            {template.products.slice(0, 4).map((product, index) => (
              <div key={index} className="min-w-0">
                <div className="h-14 overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={product.img}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>

                <p className="mt-1 truncate text-[8px] font-semibold text-gray-700">
                  {product.name}
                </p>

                <p className="text-[8px] font-bold text-orange-600">
                  {product.price}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="absolute left-6 top-6 flex flex-col gap-2">
          {template.popular && (
            <span className="flex items-center gap-1 rounded-md bg-orange-600 px-2 py-1 text-[9px] font-bold text-white shadow-sm">
              <Star size={10} fill="currentColor" />
              POPULAR
            </span>
          )}

          <span
            className={`w-fit rounded-md px-2 py-1 text-[9px] font-bold shadow-sm ${
              template.pricing === "Free"
                ? "bg-emerald-500 text-white"
                : "bg-amber-400 text-gray-950"
            }`}
          >
            {template.pricing}
          </span>
        </div>

        {/* Favorite */}
        <button
          type="button"
          aria-label={
            isFavorite ? "Remove from favorites" : "Add to favorites"
          }
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(template.id)}
          className={`absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition ${
            isFavorite
              ? "bg-orange-600 text-white"
              : "bg-white text-gray-500 hover:text-orange-600"
          }`}
        >
          <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Template Information */}
      <div className="flex flex-1 flex-col p-5">

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {template.name}
              </h3>

              <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                {template.description}
              </p>
            </div>

            <span className="shrink-0 text-sm font-bold text-gray-900">
              {template.price}
            </span>
          </div>

          {/* Metadata */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-md bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-600">
              {template.category}
            </span>

            <span
              className={`rounded-md px-2.5 py-1 text-[10px] font-semibold ${
                template.type === "Dynamic"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {template.type}
            </span>

            <span className="rounded-md bg-purple-50 px-2.5 py-1 text-[10px] font-semibold text-purple-700">
              {template.layout}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => onPreview(template)}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-3 text-xs font-bold text-gray-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
          >
            <Eye size={15} />
            Preview
          </button>

          <button
            type="button"
            onClick={() => onSelect(template)}
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-3 py-3 text-xs font-bold text-white transition hover:bg-orange-700"
          >
            Select
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* --------------------------------------------------
   MAIN TEMPLATES PAGE
-------------------------------------------------- */

export default function Templates() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Templates");
  const [selectedContentType, setSelectedContentType] = useState("All");
  const [selectedArchitecture, setSelectedArchitecture] = useState("All");
  const [selectedSort, setSelectedSort] = useState("popular");

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const [previewModalTemplate, setPreviewModalTemplate] = useState(null);
  const [previewDevice, setPreviewDevice] = useState("desktop");

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tandav_favorites")) || [];
    } catch {
      return [];
    }
  });

  /* Save Favorites */
  useEffect(() => {
    localStorage.setItem("tandav_favorites", JSON.stringify(favorites));
  }, [favorites]);

  /* Modal Keyboard Handling */
  useEffect(() => {
    if (!previewModalTemplate) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setPreviewModalTemplate(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewModalTemplate]);

  /* Toggle Favorite */
  const toggleFavorite = (id) => {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  /* Clear Filters */
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Templates");
    setSelectedContentType("All");
    setSelectedArchitecture("All");
    setSelectedSort("popular");
    setShowFavoritesOnly(false);
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All Templates" ||
    selectedContentType !== "All" ||
    selectedArchitecture !== "All" ||
    showFavoritesOnly;

  /* Filter and Sort Templates */
  const filteredTemplates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let result = TEMPLATES.filter((template) => {
      const matchesCategory =
        selectedCategory === "All Templates" ||
        template.category === selectedCategory;

      const searchableText = [
        template.name,
        template.storeName,
        template.description,
        template.category,
        template.type,
        template.layout,
        template.pricing,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(query);

      const matchesType =
        selectedContentType === "All" ||
        template.type === selectedContentType;

      const matchesArchitecture =
        selectedArchitecture === "All" ||
        template.layout === selectedArchitecture;

      const matchesFavorite =
        !showFavoritesOnly || favorites.includes(template.id);

      return (
        matchesCategory &&
        matchesSearch &&
        matchesType &&
        matchesArchitecture &&
        matchesFavorite
      );
    });

    result = [...result].sort((a, b) => {
      switch (selectedSort) {
        case "name-asc":
          return a.name.localeCompare(b.name);

        case "name-desc":
          return b.name.localeCompare(a.name);

        case "price-asc":
          return getTemplatePrice(a) - getTemplatePrice(b);

        case "price-desc":
          return getTemplatePrice(b) - getTemplatePrice(a);

        case "popular":
        default:
          return Number(b.popular) - Number(a.popular);
      }
    });

    return result;
  }, [
    searchQuery,
    selectedCategory,
    selectedContentType,
    selectedArchitecture,
    selectedSort,
    showFavoritesOnly,
    favorites,
  ]);

  /* Open Full Preview */
  const handlePreview = (template) => {
    const previewUrl = `/templates/preview/${template.id}`;

    window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

  /* Select Template */
  const handleSelectTemplate = (template) => {
    sessionStorage.setItem("selected_template_id", template.id);
    sessionStorage.setItem("selected_template_version", "1.0.0");

    const subscriptionUrl =
      `/subscription?template=${encodeURIComponent(template.id)}`;

    if (getToken()) {
      navigate(subscriptionUrl);
    } else {
      navigate("/login", {
        state: {
          from: subscriptionUrl,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <Navbar activeLink="templates" />

      {/* MARKETPLACE */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-8">

        {/* Heading */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
              Explore Designs
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-gray-950 sm:text-3xl">
              Website Templates
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Find a design that matches your business.
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>
              Showing{" "}
              <strong className="text-gray-900">
                {filteredTemplates.length}
              </strong>{" "}
              of {TEMPLATES.length} templates
            </span>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="font-bold text-orange-600 hover:text-orange-700"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Search and Sort */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              placeholder="Search by template name, category or business type..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowFavoritesOnly((value) => !value)}
              aria-pressed={showFavoritesOnly}
              className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${
                showFavoritesOnly
                  ? "border-orange-200 bg-orange-50 text-orange-600"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Heart
                size={16}
                fill={showFavoritesOnly ? "currentColor" : "none"}
              />
              Favorites
              <span>({favorites.length})</span>
            </button>

            <div className="relative">
              <select
                value={selectedSort}
                onChange={(event) => setSelectedSort(event.target.value)}
                aria-label="Sort templates"
                className="h-12 appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-4 pr-10 text-sm font-semibold text-gray-700 outline-none focus:border-orange-500"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            className="flex w-full items-center justify-between"
          >
            <span className="flex items-center gap-2 text-sm font-bold text-gray-800">
              <SlidersHorizontal size={17} />
              Filters
            </span>

            <ChevronDown
              size={18}
              className={`text-gray-500 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          {showFilters && (
            <div className="mt-5 space-y-5">

              {/* Category */}
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Business Category
                </p>

                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={selectedCategory === category}
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                        selectedCategory === category
                          ? "bg-orange-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Type and Architecture */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Content Type
                  </p>

                  <div className="flex gap-2">
                    {["All", "Static", "Dynamic"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        aria-pressed={selectedContentType === type}
                        onClick={() => setSelectedContentType(type)}
                        className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                          selectedContentType === type
                            ? "bg-orange-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Architecture
                  </p>

                  <div className="flex gap-2">
                    {["All", "SPA", "MPA"].map((architecture) => (
                      <button
                        key={architecture}
                        type="button"
                        aria-pressed={selectedArchitecture === architecture}
                        onClick={() => setSelectedArchitecture(architecture)}
                        className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                          selectedArchitecture === architecture
                            ? "bg-orange-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {architecture}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TEMPLATE GRID */}
        {filteredTemplates.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <TemplatePreviewCard
                key={template.id}
                template={template}
                isFavorite={favorites.includes(template.id)}
                onToggleFavorite={toggleFavorite}
                onPreview={(item) => {
                  setPreviewModalTemplate(item);
                  setPreviewDevice("desktop");
                }}
                onSelect={handleSelectTemplate}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 px-5 py-20 text-center">
            <LayoutTemplate
              size={42}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-5 text-lg font-bold text-gray-900">
              No templates found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-xs font-bold text-white hover:bg-orange-700"
            >
              <RotateCcw size={14} />
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* PREMIUM BANNER */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gray-950 px-7 py-10 sm:px-10">
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-orange-600/20 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
                Unlock More Possibilities
              </span>

              <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                Take Your Store to the Next Level.
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-7 text-gray-400">
                Explore Tandav subscription plans and discover additional
                features for your growing business.
              </p>
            </div>

            <Link
              to="/pricing"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-orange-700"
            >
              View Pricing
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK PREVIEW MODAL */}
      {previewModalTemplate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="template-preview-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPreviewModalTemplate(null);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-6"
        >
          <div className="my-auto w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-orange-600">
                  Template Preview
                </p>

                <h3
                  id="template-preview-title"
                  className="mt-1 text-lg font-bold text-gray-900"
                >
                  {previewModalTemplate.name}
                </h3>
              </div>

              <button
                type="button"
                aria-label="Close preview"
                onClick={() => setPreviewModalTemplate(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
              >
                <X size={19} />
              </button>
            </div>

            <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-5">

              {/* Preview Area */}
              <div className="lg:col-span-3">

                {/* Device Controls */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">
                    Preview appearance
                  </span>

                  <div className="flex rounded-lg bg-gray-100 p-1">
                    <button
                      type="button"
                      aria-label="Desktop preview"
                      aria-pressed={previewDevice === "desktop"}
                      onClick={() => setPreviewDevice("desktop")}
                      className={`rounded-md p-2 ${
                        previewDevice === "desktop"
                          ? "bg-white text-orange-600 shadow-sm"
                          : "text-gray-500"
                      }`}
                    >
                      <Monitor size={17} />
                    </button>

                    <button
                      type="button"
                      aria-label="Mobile preview"
                      aria-pressed={previewDevice === "mobile"}
                      onClick={() => setPreviewDevice("mobile")}
                      className={`rounded-md p-2 ${
                        previewDevice === "mobile"
                          ? "bg-white text-orange-600 shadow-sm"
                          : "text-gray-500"
                      }`}
                    >
                      <Smartphone size={17} />
                    </button>
                  </div>
                </div>

                {/* Device Frame */}
                <div className="flex min-h-[330px] items-center justify-center overflow-hidden rounded-2xl bg-gray-100 p-4">
                  <div
                    className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 ${
                      previewDevice === "mobile"
                        ? "w-[190px]"
                        : "w-full"
                    }`}
                  >
                    <div className="relative h-56 overflow-hidden sm:h-64">
                      <img
                        src={previewModalTemplate.banner}
                        alt={previewModalTemplate.name}
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                      <div className="absolute bottom-5 left-4 right-4">
                        <h4 className="whitespace-pre-line text-lg font-bold text-white">
                          {previewModalTemplate.title}
                        </h4>

                        <span className="mt-3 inline-block rounded-md bg-white px-3 py-1.5 text-[10px] font-bold text-gray-900">
                          Get Started
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-3">
                      {previewModalTemplate.products.slice(0, 4).map(
                        (product, index) => (
                          <div key={index} className="min-w-0">
                            <img
                              src={product.img}
                              alt={product.name}
                              className="h-20 w-full rounded-md object-cover"
                            />

                            <p className="mt-1 truncate text-[9px] font-semibold text-gray-700">
                              {product.name}
                            </p>

                            <p className="text-[9px] font-bold text-orange-600">
                              {product.price}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-center text-[10px] text-gray-400">
                  Illustrative template preview. Open the full preview to
                  explore the actual template.
                </p>
              </div>

              {/* Details */}
              <div className="flex flex-col lg:col-span-2">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md bg-orange-50 px-3 py-1.5 text-[10px] font-bold text-orange-700">
                      {previewModalTemplate.category}
                    </span>

                    <span className="rounded-md bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-blue-700">
                      {previewModalTemplate.type}
                    </span>

                    <span className="rounded-md bg-purple-50 px-3 py-1.5 text-[10px] font-bold text-purple-700">
                      {previewModalTemplate.layout}
                    </span>
                  </div>

                  <h4 className="mt-5 text-xl font-bold text-gray-900">
                    {previewModalTemplate.name}
                  </h4>

                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    {previewModalTemplate.description}
                  </p>

                  <div className="mt-6 rounded-xl border border-gray-200 p-4">
                    <p className="text-xs font-semibold text-gray-500">
                      Template Price
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {previewModalTemplate.price}
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-md px-2 py-1 text-[10px] font-bold ${
                        previewModalTemplate.pricing === "Free"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {previewModalTemplate.pricing}
                    </span>
                  </div>
                </div>

                <div className="mt-auto space-y-3 pt-6">
                  <button
                    type="button"
                    onClick={() => handlePreview(previewModalTemplate)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3.5 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
                  >
                    <Eye size={16} />
                    Open Full Preview
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const template = previewModalTemplate;
                      setPreviewModalTemplate(null);
                      handleSelectTemplate(template);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3.5 text-xs font-bold text-white transition hover:bg-orange-700"
                  >
                    Select This Template
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
