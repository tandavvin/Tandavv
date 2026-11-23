import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import SEO from "../components/SEO";

const features = [
  {
    icon: "🎨",
    color: "bg-purple-100 text-purple-600",
    title: "Beautiful Templates",
    desc: "Choose from professionally designed templates for every industry.",
  },
  {
    icon: "✏️",
    color: "bg-green-100 text-green-600",
    title: "Easy Customization",
    desc: "Edit text, images, colors and layouts with our visual editor. No coding needed.",
  },
  {
    icon: "📦",
    color: "bg-blue-100 text-blue-600",
    title: "Manage Your Products",
    desc: "Add, edit and organize your products, categories, prices and stock.",
  },
  {
    icon: "🚀",
    color: "bg-orange-100 text-orange-600",
    title: "Publish Anywhere",
    desc: "Go live with your own subdomain or connect a custom domain.",
  },
  {
    icon: "🛡️",
    color: "bg-pink-100 text-pink-600",
    title: "Secure & Reliable",
    desc: "Your data and website are protected with enterprise-grade security.",
  },
];

const templates = [
  {
    name: "Fashion Store",
    storeName: "Vogue",
    category: "Clothing, footwear and accessories",
    title: "New Season\nNew Style",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
    products: [
      { img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80", name: "Classic Jacket", price: "$49.00" },
      { img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=150&q=80", name: "Summer Dress", price: "$35.00" },
      { img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=150&q=80", name: "Casual Tee", price: "$22.00" },
      { img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=150&q=80", name: "Denim Jeans", price: "$59.00" },
    ],
  },
  {
    name: "Grocery Store",
    storeName: "Mart",
    category: "Groceries and everyday essentials",
    title: "Fresh & Healthy\nOrganic Products",
    banner: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    products: [
      { img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=150&q=80", name: "Fresh Oranges", price: "$4.50" },
      { img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=150&q=80", name: "Ripe Avocados", price: "$6.00" },
      { img: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=150&q=80", name: "Organic Juice", price: "$3.80" },
      { img: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=150&q=80", name: "Artisan Bread", price: "$2.99" },
    ],
  },
  {
    name: "Electronics Store",
    storeName: "Gadget",
    category: "Gadgets and electronic products",
    title: "Latest Tech\nBetter Life",
    banner: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    products: [
      { img: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=150&q=80", name: "Smart Device", price: "$129.00" },
      { img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=150&q=80", name: "Smart Watch", price: "$89.00" },
      { img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80", name: "Pro Headphones", price: "$199.00" },
      { img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&q=80", name: "Gaming Controller", price: "$59.00" },
    ],
  },
  {
    name: "Beauty & Skincare",
    storeName: "Beauty",
    category: "Cosmetics and skincare",
    title: "Natural Beauty\nFor You",
    banner: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
    products: [
      { img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=150&q=80", name: "Face Serum", price: "$28.00" },
      { img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=150&q=80", name: "Night Cream", price: "$32.00" },
      { img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=150&q=80", name: "Herb Essence", price: "$24.00" },
      { img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=150&q=80", name: "Natural Oil", price: "$19.50" },
    ],
  },
];

const faqs = [
  {
    q: "Do I need any coding or technical skills to use Tandav?",
    a: "Not at all! Tandav is built with a powerful visual drag-and-drop editor. You can design pages, add products, and customize themes with zero code.",
  },
  {
    q: "Can I use my own custom domain name?",
    a: "Yes. Every store starts with a free subdomain (e.g., yourstore.tandav.com), but you can easily connect your own custom domain name anytime.",
  },
  {
    q: "How do I add and manage my store products?",
    a: "Our intuitive dashboard lets you upload product images, set prices, manage inventory levels, and organize items into categories effortlessly.",
  },
  {
    q: "Is there a free trial or free tier available?",
    a: "Yes! You can sign up and start building your dream storefront completely free with our starter tools.",
  },
];

function EditorPreview() {
  const [selectedSection, setSelectedSection] = useState("Hero");
  const [activeTab, setActiveTab] = useState("Content");

  const sections = [
    { name: "Navbar", sub: "Section 1" },
    { name: "Hero", sub: "Section 2" },
    { name: "Products", sub: "Section 3" },
    { name: "About", sub: "Section 4" },
    { name: "Reviews", sub: "Section 5" },
  ];

  return (
    <div className="w-full max-w-3xl rounded-2xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden text-left select-none">
      {/* Top Studio Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 bg-white px-3.5 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 text-xs text-slate-500 shrink-0">
            ←
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <img src="/favicon-16x16.png" alt="Tandav" className="h-4 w-4 object-contain" />
            <div className="leading-none">
              <div className="text-[11px] font-bold text-slate-900">Tandav</div>
              <div className="text-[8px] font-semibold tracking-widest text-slate-400 uppercase">
                Studio
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-slate-200 truncate">
            <span className="text-[10px] text-slate-400">Editing</span>
            <span className="truncate rounded-md bg-orange-50 border border-orange-200/70 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
              Tandavv&apos;s Store
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center rounded-lg bg-slate-100 p-0.5 text-[10px] font-medium text-slate-500">
          <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 font-semibold text-orange-600 shadow-2xs">
            <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5">
            <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="4" width="16" height="12" rx="1.5" />
              <path d="M2 18h20" />
            </svg>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5">
            <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <path d="M12 18h.01" />
            </svg>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5">
            <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="7" y="2" width="10" height="20" rx="2" />
              <path d="M12 18h.01" />
            </svg>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700">
            + New Store
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white shadow-2xs">
            🌐 Live Site
          </span>
        </div>
      </div>

      {/* Main 3-Column Studio */}
      <div className="grid grid-cols-12 bg-slate-100/75">
        {/* Left Rail + Sections Drawer */}
        <div className="hidden sm:flex sm:col-span-4 border-r border-slate-200/80 bg-white">
          <div className="w-8 border-r border-slate-100 bg-slate-50/60 py-2.5 flex flex-col items-center justify-between shrink-0 text-[11px] text-slate-400">
            <div className="flex flex-col items-center gap-2">
              <span>+</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-600 text-[10px] text-white shadow-2xs">
                ⊞
              </span>
              <span>📄</span>
              <span>⧉</span>
            </div>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-[9px] font-bold text-orange-700">
              T
            </span>
          </div>

          <div className="flex-1 p-2.5 min-w-0">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <div>
                <div className="text-[11px] font-bold text-slate-800 leading-tight">Sections &amp; Theme</div>
                <div className="text-[9px] text-slate-400">Website Editor</div>
              </div>
              <span className="text-[10px] text-slate-400">✕</span>
            </div>

            <div className="flex items-center justify-between gap-1.5 mb-2">
              <div className="min-w-0">
                <div className="text-[10.5px] font-bold text-slate-800 truncate">
                  Page Sections <span className="text-slate-400 font-normal">6</span>
                </div>
              </div>
              <span className="rounded-md bg-orange-600 px-2 py-1 text-[9.5px] font-semibold text-white shrink-0">
                + Add Section
              </span>
            </div>

            <div className="space-y-1.5">
              {sections.map((sec) => {
                const active = selectedSection === sec.name;
                return (
                  <button
                    key={sec.name}
                    type="button"
                    onClick={() => setSelectedSection(sec.name)}
                    className={`w-full flex items-center justify-between rounded-lg border px-2 py-1.5 text-left transition cursor-pointer ${
                      active
                        ? "border-orange-300 bg-orange-50/70 text-orange-950"
                        : "border-slate-100 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[10px] text-slate-300">⋮⋮</span>
                      <div className="truncate leading-tight">
                        <div className="text-[10.5px] font-semibold truncate">{sec.name}</div>
                        <div className="text-[8.5px] text-slate-400">{sec.sub}</div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-300">›</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Storefront Canvas */}
        <div className="col-span-12 sm:col-span-5 p-3 sm:p-4 flex items-center">
          <div className="w-full rounded-xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-3.5 py-2.5">
              <div className="flex items-center gap-1.5">
                <img src="/favicon-16x16.png" alt="Tandavv" className="h-4 w-4 object-contain" />
                <span className="text-xs font-extrabold text-amber-600">Tandavv</span>
              </div>
              <span className="text-xs font-bold text-slate-700">☰</span>
            </div>

            <div className="bg-gradient-to-br from-orange-50/80 via-amber-50/85 to-orange-100/70 p-4 space-y-2.5">
              <span className="inline-block rounded-full bg-white/90 border border-orange-200/80 px-2.5 py-0.5 text-[9.5px] font-semibold text-orange-700">
                ✨ New · Multi-tenant storefronts
              </span>

              <h4 className="text-sm font-extrabold leading-snug text-slate-900">
                Empowering Small Businesses with Custom Digital Storefronts
              </h4>

              <p className="text-[10.5px] leading-relaxed text-slate-600">
                Build, customize, and launch your multi-tenant storefront in minutes with automated inventory and secure payments.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="rounded-full bg-orange-600 px-3 py-1.5 text-[10px] font-semibold text-white shadow-2xs">
                  Get Started Free →
                </span>
                <span className="rounded-full bg-white border border-slate-200 px-3 py-1.5 text-[10px] font-semibold text-slate-700">
                  Learn more
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Properties Inspector */}
        <div className="hidden sm:flex sm:col-span-3 flex-col justify-between border-l border-slate-200/80 bg-white p-2.5">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <div>
                <div className="text-[11px] font-bold text-slate-800 leading-tight">Properties</div>
                <div className="text-[8.5px] text-slate-400">Editing {selectedSection.toLowerCase()}</div>
              </div>
              <span className="text-[10px] text-slate-400">✕</span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-100 px-2 py-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-white border border-slate-200 font-serif text-[10px] font-bold text-slate-600 shrink-0">
                  T
                </span>
                <div className="truncate leading-tight">
                  <div className="text-[10px] font-bold text-slate-800 truncate">section</div>
                  <div className="text-[8px] text-slate-400">section</div>
                </div>
              </div>
              <span className="rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[8.5px] font-semibold text-emerald-700 shrink-0">
                Selected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1 border-b border-slate-100 pb-1 text-[9.5px] font-semibold">
              {["Content", "Style", "Layout", "Advanced"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded py-0.5 text-center transition cursor-pointer ${
                    activeTab === tab
                      ? "bg-orange-50 text-orange-600"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-800">Element Information</div>
              <div className="rounded-md border border-slate-200 bg-slate-50/70 px-2 py-1 text-[9.5px] text-slate-500 truncate">
                {selectedSection}
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[9.5px] font-medium text-slate-700">
                section
              </div>
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[8.5px] text-slate-400">
            <span className="font-semibold text-slate-600">↺ Reset styles</span>
            <span>Auto-save enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ template }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group">
      <div className="border-b border-slate-100 bg-slate-50 p-4">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 bg-white px-3 py-2 text-[9px] text-slate-700">
            <span className="flex items-center gap-1 font-bold text-slate-900">
              <span>✿</span> {template.storeName}
            </span>
            <div className="hidden sm:flex items-center gap-2 font-medium text-slate-500">
              <span className="font-bold text-orange-600">Home</span>
              <span>Shop</span>
              <span>About</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-700">Login</span>
              <span className="rounded bg-orange-600 px-1.5 py-0.5 font-medium text-white">Sign Up</span>
            </div>
          </div>

          <div className="relative flex h-40 flex-col justify-end bg-cover bg-center p-3 sm:h-44" style={{ backgroundImage: `url(${template.banner})` }}>
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10">
              <h5 className="text-xs font-bold leading-tight text-white whitespace-pre-line">{template.title}</h5>
              <span className="mt-1.5 inline-block rounded bg-white px-2.5 py-0.5 text-[9px] font-semibold text-slate-900">Shop Now</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1.5 bg-white p-3">
            {template.products.map((prod, idx) => (
              <div key={idx} className="flex flex-col space-y-0.5 rounded-lg border border-slate-100 bg-slate-50 p-1">
                <div className="h-12 overflow-hidden rounded bg-slate-100">
                  <img src={prod.img} alt={prod.name} className="h-full w-full object-cover" />
                </div>
                <span className="truncate text-[7.5px] font-semibold text-slate-800">{prod.name}</span>
                <span className="text-[7px] font-bold text-orange-600">{prod.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between p-6">
        <div>
          <h4 className="text-base font-bold text-slate-900">{template.name}</h4>
          <p className="text-xs text-slate-500">{template.category}</p>
        </div>
        <span className="text-slate-400 transition group-hover:translate-x-1">→</span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <SEO
        title="Website Builder for Your Business"
        description="Build, customize, and launch your business website with TANDAVV. Choose professional templates and create your online presence with ease."
        path="/"
      />
      <Navbar activeLink="home" />

      {/* HEADER & HERO */}
      <section id="home" className="bg-gradient-to-b from-orange-50/50 to-white pb-20 pt-0">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 pb-8 pt-6 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:pt-8">
          <div className="space-y-6 lg:col-span-6">
            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Your Business.
              <br />
              Your Website.
              <span className="block text-orange-600">Your Way.</span>
            </h1>
            <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Build, customize, and manage a professional business website with Tandav. Choose a design, personalize your storefront, and launch without writing code.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <Link
                to="/templates"
                className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
              >
                Explore Templates <span className="ml-2">→</span>
              </Link>

              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100"
              >
                Get Started Free
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-medium text-slate-500">
              <div>✓ No Coding Required</div>
              <div>✓ Fully Customizable</div>
              <div>✓ Secure & Reliable</div>
            </div>
          </div>
          <div className="flex justify-center lg:col-span-6 w-full">
            <EditorPreview />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="mx-auto mb-16 max-w-2xl space-y-3 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Why Choose Tandav?</h2>
          <p className="text-sm leading-7 text-slate-600 sm:text-base">Everything you need to build, customize and grow your online business — all in one place.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {features.map((item, index) => (
            <div key={index} className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-6 transition hover:bg-orange-50/40">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${item.color}`}>
                {item.icon}
              </div>
              <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="text-xs leading-relaxed text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEMPLATES */}
      <section id="templates" className="border-y border-slate-100 bg-slate-50 px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl space-y-3 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Ready-to-Use Templates</h2>
            <p className="text-sm leading-7 text-slate-600 sm:text-base">Start with a beautiful template and make it yours. You can customize everything from the layout to the colors, text and products.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {templates.map((tpl) => (
              <TemplateCard key={tpl.name} template={tpl} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="about" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="mx-auto mb-16 max-w-2xl space-y-3 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">How It Works</h2>
          <p className="text-sm leading-7 text-slate-600 sm:text-base">Launch your online storefront in 4 simple and intuitive steps.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: "01", title: "Create Your Account", desc: "Sign up on Tandav in seconds and set up your brand profile.", icon: "👤" },
            { step: "02", title: "Pick a Pro Template", desc: "Choose from curated industry-specific storefront designs tailored to convert.", icon: "🎯" },
            { step: "03", title: "Customize & Add Products", desc: "Personalize text, images, and upload products using our easy visual builder.", icon: "✨" },
            { step: "04", title: "Launch & Grow", desc: "Publish your store instantly to a custom subdomain or your own domain name.", icon: "🚀" },
          ].map((s) => (
            <div key={s.step} className="group relative space-y-4 rounded-3xl border border-slate-100 bg-slate-50 p-8 transition hover:border-orange-200">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{s.icon}</span>
                <span className="rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 font-mono text-xs font-bold text-orange-600">Step {s.step}</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900">{s.title}</h4>
              <p className="text-xs leading-relaxed text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VALUE PROP SECTION */}
      <section className="border-y border-slate-100 bg-slate-50 px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
              Built for growing businesses
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to launch online
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              From your first storefront to managing products and publishing your website, Tandav keeps the process simple.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["01", "Choose a design", "Start with a professionally structured website template."],
              ["02", "Make it yours", "Customize your content, sections, images, and products."],
              ["03", "Publish your website", "Launch your storefront and manage it from one dashboard."],
            ].map(([number, title, description]) => (
              <div key={number} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="text-sm font-bold text-orange-600">{number}</span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5 lg:sticky lg:top-28">
            <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl leading-tight">
              Frequently Asked <span className="text-orange-600">Questions</span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Everything you need to know about setting up your digital storefront, custom subdomains, and managing products with Tandav.
            </p>
            <div className="pt-4">
              <div className="space-y-2 rounded-2xl border border-orange-100 bg-orange-50 p-5">
                <h5 className="text-xs font-bold text-slate-900">Still have questions?</h5>
                <p className="text-xs text-slate-600">Explore our templates or create an account to get started.</p>
                <Link to="/templates" className="inline-block pt-1 text-xs font-bold text-orange-600 hover:text-orange-700">
                  Explore Templates →
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-3 lg:col-span-7">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen
                    ? "border-orange-300 bg-white shadow-md ring-2 ring-orange-50"
                    : "border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    className="flex w-full items-center justify-between px-5 py-5 text-left text-sm font-bold text-slate-900 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-orange-200 sm:px-6 cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs transition-colors ${isOpen ? "bg-orange-600 text-white" : "bg-slate-200 text-slate-600"
                        }`}>
                        {index + 1}
                      </span>
                      {faq.q}
                    </span>
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-300 ${isOpen ? "bg-orange-100 text-orange-600 rotate-180" : "bg-slate-200 text-slate-500"
                      }`}>
                      ↓
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-answer-${index}`}
                      className="border-t border-slate-100 px-5 pb-5 pt-4 pl-14 text-sm leading-7 text-slate-600 sm:px-6 sm:pl-16"
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}