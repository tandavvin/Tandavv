export default function DashboardChart({ title = "Visitors this week", data = [45, 65, 52, 85, 70, 95, 60] }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return <section className="rounded-2xl border border-gray-200 bg-white p-5">
    <div className="mb-6 flex items-center justify-between"><div><h3 className="font-bold text-gray-900">{title}</h3><p className="mt-1 text-xs text-gray-500">Last 7 days</p></div><span className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold text-[#FF7200]">This week</span></div>
    <div className="flex h-44 items-end justify-between gap-3 border-b border-gray-100 pb-2">
      {data.map((value, i) => <div key={days[i]} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="flex h-full w-full items-end"><div title={`${value}%`} style={{height:`${Math.max(5, Math.min(value, 100))}%`}} className="w-full rounded-t-md bg-[#FF7200] transition hover:bg-[#E66500]"/></div><span className="text-xs text-gray-400">{days[i]}</span></div>)}
    </div>
  </section>;
}
