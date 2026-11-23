
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  Zap,
  Store,
  Headphones,
  Globe,
  CreditCard,
} from "lucide-react";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import SEO from "../components/SEO";

const plans = [
  {
    name: "Starter",
    description: "Everything you need to get your online store started.",
    monthlyPrice: 0,
    annualPrice: 0,
    icon: Store,
    popular: false,
    features: [
      "1 storefront",
      "Free website templates",
      "tandavv subdomain",
      "Basic drag-and-drop editor",
      "Up to 10 products",
      "Community support",
    ],
    buttonText: "Get Started Free",
    buttonStyle:
      "border border-gray-300 bg-white text-gray-900 hover:border-orange-500 hover:text-orange-600",
  },
  {
    name: "Pro Storefront",
    description: "Everything you need to build and grow your business.",
    monthlyPrice: 499,
    annualPrice: 399,
    icon: Zap,
    popular: true,
    features: [
      "Premium website templates",
      "Custom domain support",
      "Zero platform transaction fees",
      "Unlimited products and categories",
      "Advanced SEO and analytics",
      "Priority 24/7 support",
    ],
    buttonText: "Choose Pro",
    buttonStyle:
      "bg-white text-orange-600 hover:bg-orange-50",
  },
  {
    name: "Business Growth",
    description: "Advanced tools for businesses ready to scale.",
    monthlyPrice: 1499,
    annualPrice: 1199,
    icon: Sparkles,
    popular: false,
    features: [
      "Everything in Pro",
      "Up to 3 storefronts",
      "Team roles and permissions",
      "Webhooks and API access",
      "WhatsApp and email alerts",
      "Dedicated account manager",
    ],
    buttonText: "Choose Business",
    buttonStyle:
      "bg-gray-900 text-white hover:bg-gray-800",
  },
];

const faqs = [
  {
    question: "Can I change or cancel my plan anytime?",
    answer:
      "You can change your subscription plan as your business requirements evolve. You can also cancel your subscription according to the applicable subscription terms.",
  },
  {
    question: "Can I use my own custom domain?",
    answer:
      "Yes. Custom domain support is included in the Pro Storefront and Business Growth plans. The Starter plan uses a tandavv subdomain.",
  },
  {
    question: "Does tandavv charge transaction fees?",
    answer:
      "The Pro Storefront and Business Growth plans include zero platform transaction fees. Payment gateway charges, if applicable, are separate and depend on your payment provider.",
  },
  {
    question: "Which payment methods are supported?",
    answer:
      "tandavv uses Razorpay for payment processing. Available payment methods depend on the options enabled by Razorpay for your account.",
  },
  {
    question: "Can I upgrade from Starter to Pro later?",
    answer:
      "Yes. You can start with the free Starter plan and move to a paid plan when you need additional features for your storefront.",
  },
];

function PricingCard({ plan, yearly }) {
  const price = yearly ? plan.annualPrice : plan.monthlyPrice;
  const Icon = plan.icon;

  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 sm:p-7 ${plan.popular
          ? "border-orange-500 bg-orange-600 text-white shadow-xl shadow-orange-600/15 md:-translate-y-2"
          : "border-gray-200 bg-white text-gray-900 shadow-sm hover:-translate-y-1 hover:shadow-lg"
        }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-gray-950 px-4 py-1.5 text-xs font-semibold tracking-wide text-white">
            MOST POPULAR
          </span>
        </div>
      )}

      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${plan.popular
            ? "bg-white/15 text-white"
            : "bg-orange-50 text-orange-600"
          }`}
      >
        <Icon size={23} />
      </div>

      <h3 className="text-xl font-bold">{plan.name}</h3>

      <p
        className={`mt-2 min-h-[48px] text-sm leading-6 ${plan.popular ? "text-orange-100" : "text-gray-500"
          }`}
      >
        {plan.description}
      </p>

      <div className="mt-7">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight">
            ₹{price.toLocaleString("en-IN")}
          </span>

          <span
            className={`text-sm ${plan.popular ? "text-orange-100" : "text-gray-500"
              }`}
          >
            {price === 0 ? "/ forever" : "/ month"}
          </span>
        </div>

        {plan.monthlyPrice > 0 && (
          <p
            className={`mt-2 text-xs ${plan.popular ? "text-orange-100" : "text-gray-500"
              }`}
          >
            {yearly
              ? `₹${(price * 12).toLocaleString("en-IN")} billed annually`
              : "Billed monthly"}
          </p>
        )}

        {plan.monthlyPrice === 0 && (
          <p
            className={`mt-2 text-xs ${plan.popular ? "text-orange-100" : "text-gray-500"
              }`}
          >
            No credit card required
          </p>
        )}
      </div>

      <div
        className={`my-7 h-px ${plan.popular ? "bg-white/20" : "bg-gray-100"
          }`}
      />

      <p
        className={`mb-5 text-sm font-semibold ${plan.popular ? "text-white" : "text-gray-900"
          }`}
      >
        What's included
      </p>

      <ul className="flex-1 space-y-4">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${plan.popular
                  ? "bg-white/20 text-white"
                  : "bg-orange-50 text-orange-600"
                }`}
            >
              <Check size={13} strokeWidth={3} />
            </span>

            <span
              className={`text-sm leading-5 ${plan.popular ? "text-orange-50" : "text-gray-600"
                }`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Link
        to="/signup"
        className={`mt-9 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-200 ${plan.buttonStyle}`}
      >
        {plan.buttonText}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        type="button"
        onClick={onClick}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-base font-semibold text-gray-900">
          {question}
        </span>

        <ChevronDown
          size={20}
          className={`shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ${isOpen
            ? "grid-rows-[1fr] pb-5 opacity-100"
            : "grid-rows-[0fr] opacity-0"
          }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-3xl text-sm leading-7 text-gray-500">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [yearly, setYearly] = useState(true);
  const [openFAQ, setOpenFAQ] = useState(0);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-gray-900">
      <SEO
        title="Pricing Plans for Your Business"
        description="Explore TANDAVV pricing plans. Start building your online store for free or choose a paid plan with premium templates, custom domains, advanced SEO, and business growth features."
        path="/pricing"
      />
      <Navbar activeLink="pricing" />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-14 pt-20 sm:pb-20 sm:pt-28">
        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-orange-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-orange-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-950 sm:text-5xl md:text-6xl">
            The right plan for
            <span className="block text-orange-600">
              your business growth.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-500 sm:text-lg">
            Build your online presence with tandavv. Choose the tools you need
            today and upgrade as your business grows.
          </p>

          {/* Billing Toggle */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => setYearly(false)}
                aria-pressed={!yearly}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${!yearly
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                  }`}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() => setYearly(true)}
                aria-pressed={yearly}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${yearly
                    ? "bg-orange-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                  }`}
              >
                Yearly
              </button>
            </div>

            <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
              Save 20%
            </span>
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Choose yearly billing to get discounted monthly pricing.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-20">
        <div className="mx-auto grid max-w-6xl items-stretch gap-7 md:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              yearly={yearly}
            />
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-6 text-gray-400">
          Prices are shown in INR. Paid plans are billed according to the
          selected billing cycle. Payment gateway charges may apply separately.
        </p>
      </section>

      {/* Benefits */}
      <section className="border-y border-gray-200 bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Everything you need to build online
            </h2>
            <p className="mt-3 text-sm text-gray-500">
              A simple platform to create and manage your digital storefront.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Globe,
                title: "Your online storefront",
                description:
                  "Create your business website with ready-to-use templates.",
              },
              {
                icon: Zap,
                title: "Easy customization",
                description:
                  "Customize your storefront using the tandavv editor.",
              },
              {
                icon: CreditCard,
                title: "Payment integration",
                description:
                  "Accept online payments through supported payment options.",
              },
              {
                icon: Headphones,
                title: "Support when needed",
                description:
                  "Get assistance according to your selected subscription plan.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
              FAQs
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
              Frequently asked questions
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Have questions about tandavv pricing? Find your answers below.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-5 shadow-sm sm:px-8">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onClick={() =>
                  setOpenFAQ(openFAQ === index ? -1 : index)
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 pb-20">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gray-950 px-6 py-14 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-orange-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-orange-600/10 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-white">
              <ShieldCheck size={24} />
            </div>

            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to build your online store?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
              Explore our website templates and find the right starting point
              for your business.
            </p>

            <Link
              to="/templates"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-orange-700"
            >
              Explore Templates
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
