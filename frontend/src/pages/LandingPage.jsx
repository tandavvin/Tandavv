import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

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
  return (
    <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col text-left">
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded font-medium shadow-2xs hover:bg-slate-100">← Back</button>
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="text-slate-400">Tandav Builder</span>
            <span className="text-slate-300">/</span>
            <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-100 font-semibold">Acme Boutique</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Saved
          </div>
          <button className="bg-orange-600 text-white font-medium px-3 py-1.5 rounded-lg shadow-sm hover:bg-orange-700 transition">
            Preview Website
          </button>
        </div>
      </div>

      <div className="bg-white border-b border-slate-100 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg font-medium text-slate-600">
            <button className="bg-white text-slate-900 px-3 py-1 rounded-md shadow-2xs">Sections</button>
            <button className="px-3 py-1 text-slate-500 hover:text-slate-800">Pages 3</button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
          <span className="font-medium text-slate-700">ACTIVE PAGE:</span>
          <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-mono font-semibold border border-orange-100">/home</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-slate-500 text-[11px]">
          <span className="text-slate-400 font-medium">Responsive</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">Laptop (1024px)</span>
        </div>
      </div>

      <div className="grid min-h-[320px] grid-cols-1 bg-slate-50/50 sm:grid-cols-12">
        <div className="hidden max-h-[380px] space-y-2 overflow-y-auto border-b border-slate-200 bg-white p-3 sm:col-span-4 sm:block sm:border-b-0 sm:border-r">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 px-1 mb-1">Sections for: /home</div>
          {[
            { name: "Navbar", active: false },
            { name: "Hero", active: false },
            { name: "Products", active: true },
            { name: "About", active: false },
            { name: "Reviews", active: false },
            { name: "Footer", active: false },
          ].map((sec, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-2 rounded-xl border text-xs font-medium transition ${
                sec.active 
                  ? "bg-orange-50/60 border-orange-200 text-orange-900 shadow-2xs" 
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-300 cursor-grab">⋮⋮</span>
                <span>📂 {sec.name}</span>
              </div>
              <span className="text-slate-400 text-[10px]">⌄</span>
            </div>
          ))}
          <div className="pt-2">
            <button className="w-full py-1.5 border border-dashed border-slate-300 rounded-lg text-slate-500 text-xs font-medium hover:border-orange-500 hover:text-orange-600 transition">
              + Add New Section
            </button>
          </div>
        </div>

        <div className="min-w-0 overflow-hidden bg-slate-100/70 p-3 sm:col-span-8 sm:p-6 flex flex-col justify-start">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3 w-full">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                <span className="text-orange-600"><img src="/favicon-16x16.png" alt="logo" /></span> Tandav
              </div>
              <div className="flex gap-3 text-[10px] text-slate-600 font-medium">
                <span className="text-orange-600 font-bold">Home</span>
                <span>Products</span>
                <span>About</span>
              </div>
              <div className="flex gap-1.5">
                <span className="bg-slate-100 text-slate-800 text-[9px] px-2 py-0.5 rounded font-medium">Login</span>
                <span className="bg-orange-600 text-white text-[9px] px-2 py-0.5 rounded font-medium">Sign Up</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50/30 p-4 rounded-xl border border-orange-100 space-y-2">
              <span className="inline-block bg-orange-100 text-orange-700 text-[9px] font-semibold px-2 py-0.5 rounded-full">
                ⚡ New Storefront
              </span>
              <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                Empowering Small Businesses with Custom Digital Storefronts
              </h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Build, customize, and launch your storefront in minutes.
              </p>
              <div className="flex gap-2 pt-1">
                <span className="bg-orange-600 text-white text-[9px] font-medium px-2.5 py-1 rounded shadow-2xs">Get Started Free →</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-800 px-0.5">
                <span>Featured Products</span>
                <span className="text-orange-600 font-medium text-[9px]">View All →</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80", name: "Classic Jacket", price: "$49.00" },
                  { img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=150&q=80", name: "Summer Dress", price: "$35.00" },
                  { img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=150&q=80", name: "Casual Tee", price: "$22.00" },
                  { img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=150&q=80", name: "Denim Jeans", price: "$59.00" },
                ].map((product, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-1.5 border border-slate-100 flex flex-col space-y-1">
                    <div className="h-12 bg-slate-200 rounded-md overflow-hidden">
                      <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[9px] font-semibold text-slate-800 truncate">{product.name}</span>
                    <span className="text-[8px] font-bold text-orange-600">{product.price}</span>
                  </div>
                ))}
              </div>
            </div>
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
      <Navbar activeLink="home" />

      {/* HEADER & HERO */}
      <section id="home" className="bg-gradient-to-b from-orange-50/50 to-white pb-20 pt-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 pb-8 pt-14 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:pt-20">
          <div className="space-y-6 lg:col-span-6">
            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Your Business.
              <br />
              Your Website.
              <span className="block text-orange-600">Your Way.</span>
            </h1>
            <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Build, customize, and manage a professional business website with Tandav. Choose a design, personalize your storefront, and launch without writing code[cite: 4].
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
              From your first storefront to managing products and publishing your website, Tandav keeps the process simple[cite: 4].
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
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen 
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
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs transition-colors ${
                        isOpen ? "bg-orange-600 text-white" : "bg-slate-200 text-slate-600"
                      }`}>
                        {index + 1}
                      </span>
                      {faq.q}
                    </span>
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-300 ${
                      isOpen ? "bg-orange-100 text-orange-600 rotate-180" : "bg-slate-200 text-slate-500"
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