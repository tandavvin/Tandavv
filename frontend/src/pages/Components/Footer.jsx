import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-6 pt-16 pb-10 text-slate-700 sm:pt-20 sm:pb-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 border-b border-slate-200 pb-12 sm:gap-12 sm:pb-16 md:grid-cols-12">
        <div className="space-y-5 md:col-span-5">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <img
              src="/logo.png"
              alt="tandavv Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-[#E6B13D]">
              tandavv
            </span>
          </Link>

          <p className="max-w-md text-sm leading-6 text-slate-500">
            tandavv is the ultimate multi-tenant SaaS platform empowering
            entrepreneurs and small businesses to launch professional online
            stores effortlessly.
          </p>
        </div>

        <div className="space-y-4 md:col-span-2">
          <h5 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Product
          </h5>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>
              <Link to="/templates" className="transition hover:text-orange-600">
                Templates
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="transition hover:text-orange-600">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition hover:text-orange-600">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4 md:col-span-2">
          <h5 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Legal
          </h5>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>
              <Link to="/privacy" className="transition hover:text-orange-600">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="transition hover:text-orange-600">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4 md:col-span-3">
          <h5 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Get started with tandavv
          </h5>
          <p className="text-sm leading-6 text-slate-500">
            Explore website designs and find a starting point for your business.
          </p>
          <Link
            to="/signup"
            className="inline-flex rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            Start Free Trial →
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 pt-8 text-sm text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} tandavv. All rights reserved.</p>
        <div className="flex items-center gap-6 text-sm text-slate-600">
          <Link to="/privacy" className="transition hover:text-orange-600">
            Privacy Policy
          </Link>
          <Link to="/terms" className="transition hover:text-orange-600">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}