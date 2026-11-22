import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Globe, FileText, Package, ShoppingCart, Users,
  Megaphone, ChartNoAxesCombined, UserRoundCog, CreditCard, Settings,
  Headset, X, Store
} from "lucide-react";

const groups = [
  {
    label: "WORKSPACE", items: [
      ["Overview", "/dashboard", LayoutDashboard],
      ["My Website", "/dashboard/website", Globe],
      ["Pages", "/dashboard/website/pages", FileText],
      ["Products", "/dashboard/products", Package],
      ["Orders", "/dashboard/orders", ShoppingCart],
      ["Customers", "/dashboard/customers", Users],
    ]
  },
  {
    label: "GROW YOUR BUSINESS", items: [
      ["Marketing", "/dashboard/marketing", Megaphone],
      ["Analytics", "/dashboard/analytics", ChartNoAxesCombined],
      ["Team Management", "/dashboard/team", UserRoundCog],
      ["Billing", "/dashboard/billing", CreditCard],
    ]
  },
  {
    label: "PREFERENCES", items: [
      ["Settings", "/dashboard/settings", Settings],
      ["Help & Support", "/dashboard/support", Headset],
    ]
  },
];

export default function Sidebar({ open, onClose, onLogout }) {
  return <>
    {open && <button aria-label="Close menu overlay" onClick={onClose} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl text-xl font-black text-white"><img src="/logo.png" alt="logo" /></div>
          <span className="text-2xl font-bold tracking-tight text-[#171717]">Tandav</span>
        </div>
        <button onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"><X size={20} /></button>
      </div>
      <div className="mx-4 mt-5 rounded-xl border border-orange-100 bg-orange-50 p-3">
        <p className="text-[10px] font-bold tracking-widest text-gray-500">CURRENT WORKSPACE</p>
        <div className="mt-2 flex items-center gap-2"><Store size={17} className="text-[#FF7200]" /><span className="text-sm font-semibold text-gray-900">My Business</span></div>
        <p className="mt-1 text-xs text-gray-500">Free plan</p>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
        {groups.map(group => <section key={group.label}>
          <p className="mb-3 px-3 text-[10px] font-bold tracking-widest text-gray-400">{group.label}</p>
          <div className="space-y-1">
            {group.items.map(([label, to, Icon]) => <NavLink key={to} to={to} end={to === "/dashboard"} onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? "bg-[#FF7200] text-white shadow-md shadow-orange-200" : "text-gray-600 hover:bg-orange-50 hover:text-[#FF7200]"}`}>
              <Icon size={18} /><span>{label}</span>
            </NavLink>)}
          </div>
        </section>)}
      </nav>
      <div className="m-4 rounded-2xl bg-[#171717] p-4 text-white">
        <p className="font-semibold">Grow with Tandav</p>
        <p className="mt-1 text-xs leading-5 text-gray-300">Unlock more tools as your business grows.</p>
        <NavLink to="/dashboard/billing" className="mt-3 block rounded-lg bg-[#FF7200] px-3 py-2 text-center text-sm font-semibold hover:bg-[#E66500]">Explore plans</NavLink>
      </div>
      <button
        onClick={onLogout}
        className="flex w-full items-center border-t border-gray-100 px-7 py-4 text-left text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
      >
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-3 h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
        Log out
      </button>
    </aside>
  </>;
}
