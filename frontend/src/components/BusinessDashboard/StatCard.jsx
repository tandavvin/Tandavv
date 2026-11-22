import { ArrowDownRight, ArrowUpRight } from "lucide-react";
export default function StatCard({ title, value, change, note, icon: Icon, positive = true }) {
  return <article className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-100">
    <div className="flex items-start justify-between">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-orange-50 text-[#FF7200]">{Icon && <Icon size={21}/>}</div>
      {change && <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>{positive ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {change}</span>}
    </div>
    <p className="mt-5 text-sm font-medium text-gray-500">{title}</p>
    <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">{value}</p>
    {note && <p className="mt-2 text-xs text-gray-400">{note}</p>}
  </article>;
}
