import { Clock } from "lucide-react";
export default function RecentActivity({ items = [] }) {
  return <section className="rounded-2xl border border-gray-200 bg-white p-5"><h3 className="font-bold text-gray-900">Recent Activity</h3><p className="mt-1 text-xs text-gray-500">Latest updates from your store</p>
    <div className="mt-5 space-y-5">{items.map((item, i) => {const Icon=item.icon; return <div key={item.title+i} className="flex gap-3"><div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${item.color || "bg-orange-50 text-[#FF7200]"}`}>{Icon ? <Icon size={18}/> : <Clock size={18}/>}</div><div className="min-w-0"><p className="text-sm font-semibold text-gray-800">{item.title}</p><p className="mt-1 text-xs text-gray-500">{item.description}</p><p className="mt-2 text-xs text-gray-400">{item.time}</p></div></div>})}</div>
    {items.length===0 && <p className="py-8 text-center text-sm text-gray-400">No recent activity.</p>}
  </section>;
}
