
import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Shield,
  Target,
  Users,
  Globe,
  ArrowRight,
  CheckCircle2,
  LayoutTemplate,
  MousePointerClick,
  Rocket,
  Store,
  Palette,
  ShoppingBag,
} from "lucide-react";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

const features = [
  {
    icon: LayoutTemplate,
    title: "Ready-to-use Templates",
    description:
      "Choose from professionally designed website templates that give your business a polished online presence.",
    color: "orange",
  },
  {
    icon: MousePointerClick,
    title: "Visual Website Editor",
    description:
      "Customize your website using an intuitive editing experience without needing to write code.",
    color: "blue",
  },
  {
    icon: Globe,
    title: "Custom Domains",
    description:
      "Launch your storefront using a Tandav subdomain or connect your own custom business domain.",
    color: "purple",
  },
  {
    icon: ShoppingBag,
    title: "Product Management",
    description:
      "Manage your products, categories and storefront content from one convenient dashboard.",
    color: "green",
  },
  {
    icon: Shield,
    title: "Built for Your Business",
    description:
      "Organize your storefront settings and business information through a centralized platform.",
    color: "orange",
  },
  {
    icon: Users,
    title: "Business Growth",
    description:
      "Access subscription plans and tools designed to support your business as it grows.",
    color: "blue",
  },
];

const steps = [
  {
    number: "01",
    icon: LayoutTemplate,
    title: "Choose Your Template",
    description:
      "Explore our collection of website templates and select a design that matches your business.",
  },
  {
    number: "02",
    icon: Palette,
    title: "Customize Your Store",
    description:
      "Personalize your website, update your content and add your products using the editor.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Launch Your Website",
    description:
      "Publish your storefront and start building your online presence with Tandav.",
  },
];

const colorStyles = {
  orange: "bg-orange-50 text-orange-600",
  blue: "bg-blue-50 text-blue-600",
  purple: "bg-purple-50 text-purple-600",
  green: "bg-green-50 text-green-600",
};

function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-orange-600">
      <Sparkles size={14} />
      {children}
    </span>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <Navbar activeLink="about" />

      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-orange-50 via-orange-50/30 to-white px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Bringing Your Business
            <span className="block text-orange-600">
              Online, Made Simple.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            We believe every business deserves a professional online presence.
            Tandav makes it easier to create, customize and manage your own
            digital storefront without complicated development work.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/templates"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition hover:-translate-y-0.5 hover:bg-orange-700 sm:w-auto"
            >
              Explore Templates
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/pricing"
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:text-orange-600 sm:w-auto"
            >
              View Pricing
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs font-medium text-slate-500 sm:text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-orange-600" />
              No coding required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-orange-600" />
              Customizable templates
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-orange-600" />
              Business-focused tools
            </span>
          </div>
        </div>
      </section>

      {/* INTRODUCTION / OUR STORY */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionLabel>Our Story</SectionLabel>

            <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              Making Website Creation
              <span className="text-orange-600"> Accessible to Everyone.</span>
            </h2>

            <p className="mt-6 text-sm leading-8 text-slate-600 sm:text-base">
              Starting an online business often involves multiple challenges,
              from website development and design to product management and
              customization.
            </p>

            <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
              Tandav brings these essential website-building capabilities
              together in one platform. Instead of dealing with complex
              development processes, business owners can choose a template,
              customize their storefront and manage their online presence
              through a single dashboard.
            </p>

            <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
              Our goal is to make building a business website a simpler,
              more accessible experience for entrepreneurs and growing
              businesses.
            </p>

            <Link
              to="/templates"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-orange-600 transition hover:gap-3"
            >
              Discover our templates
              <ArrowRight size={17} />
            </Link>
          </div>

          {/* VISUAL PANEL */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-orange-100/60 blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-xl shadow-slate-900/5 sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white">
                    <Store size={19} />
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    Your Business
                  </span>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                  Your Storefront
                </span>
              </div>

              <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Website Builder
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      Build Your Store
                    </h3>
                  </div>

                  <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                    <Palette size={22} />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <LayoutTemplate
                      size={22}
                      className="text-orange-600"
                    />
                    <p className="mt-3 text-sm font-bold text-slate-800">
                      Templates
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Choose a design
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <MousePointerClick
                      size={22}
                      className="text-slate-700"
                    />
                    <p className="mt-3 text-sm font-bold text-slate-800">
                      Editor
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Customize pages
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <ShoppingBag
                      size={22}
                      className="text-slate-700"
                    />
                    <p className="mt-3 text-sm font-bold text-slate-800">
                      Products
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Manage inventory
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <Globe size={22} className="text-slate-700" />
                    <p className="mt-3 text-sm font-bold text-slate-800">
                      Publish
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Go online
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-950 px-4 py-4">
                  <div>
                    <p className="text-xs text-slate-400">
                      Your next step
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Create your storefront
                    </p>
                  </div>
                  <ArrowRight size={20} className="text-orange-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION AND VISION */}
      <section className="border-y border-slate-100 bg-slate-50 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>What Drives Us</SectionLabel>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Our Mission & Vision
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              We want to simplify how businesses establish and manage their
              online presence.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Target size={23} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-950">
                Our Mission
              </h3>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                To empower entrepreneurs and businesses with accessible
                website-building tools that make it easier to create,
                customize and manage professional digital storefronts.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Sparkles size={23} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-950">
                Our Vision
              </h3>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                To make online business creation more accessible by bringing
                website design, customization and storefront management
                together in one easy-to-use platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Why Tandav</SectionLabel>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Everything You Need to
              <span className="text-orange-600"> Build Online.</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              From selecting a design to managing your products, Tandav
              provides the essential tools to help you create your online
              storefront.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-900/5"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorStyles[feature.color]} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-6 text-base font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-slate-100 bg-slate-50 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Getting Started</SectionLabel>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Three Steps to Get Started
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Creating your online storefront with Tandav is designed to be
              simple and straightforward.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="relative">
                  <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                        <Icon size={23} />
                      </div>

                      <span className="text-3xl font-extrabold text-orange-100">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="mt-7 text-lg font-bold text-slate-900">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-orange-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-24 h-80 w-80 rounded-full bg-orange-600/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-lg shadow-orange-600/20">
              <Rocket size={26} />
            </div>

            <h2 className="mt-7 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              Your Business Deserves
              <span className="block text-orange-500">
                a Great Online Presence.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              Start exploring website templates and discover how simple it
              can be to build your own digital storefront with Tandav.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/templates"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-orange-700"
              >
                Explore Templates
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
