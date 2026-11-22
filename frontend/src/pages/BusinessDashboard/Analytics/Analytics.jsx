import { useState, useEffect } from "react";
import { TrendingUp, ShoppingBag, Users, DollarSign } from "lucide-react";
import { apiFetch } from "../../../utils/api";

export default function Analytics() {
  const [storeName, setStoreName] = useState("Store");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/config")
      .then((res) => {
        if (res.data?.storeName) setStoreName(res.data.storeName);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-xs text-gray-400">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
        <p className="mt-1 text-sm text-gray-500">Performance insights for {storeName}.</p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wider text-gray-400">TOTAL REVENUE</p>
            <div className="rounded-xl bg-orange-50 p-2.5 text-[#FF7200]"><DollarSign size={20}/></div>
          </div>
          <p className="mt-3 text-2xl font-bold text-900">₹48,290</p>
          <p className="mt-1 text-xs font-medium text-green-600 flex items-center gap-1">
            <TrendingUp size={14}/> +18% from last week
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wider text-gray-400">TOTAL ORDERS</p>
            <div className="rounded-xl bg-orange-50 p-2.5 text-[#FF7200]"><ShoppingBag size={20}/></div>
          </div>
          <p className="mt-3 text-2xl font-bold text-900">312</p>
          <p className="mt-1 text-xs font-medium text-green-600 flex items-center gap-1">
            <TrendingUp size={14}/> +12% new orders
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wider text-gray-400">STORE VISITORS</p>
            <div className="rounded-xl bg-orange-50 p-2.5 text-[#FF7200]"><Users size={20}/></div>
          </div>
          <p className="mt-3 text-2xl font-bold text-900">8,940</p>
          <p className="mt-1 text-xs font-medium text-green-600 flex items-center gap-1">
            <TrendingUp size={14}/> +24% traffic growth
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wider text-gray-400">CONVERSION RATE</p>
            <div className="rounded-xl bg-orange-50 p-2.5 text-[#FF7200]"><TrendingUp size={20}/></div>
          </div>
          <p className="mt-3 text-2xl font-bold text-900">3.49%</p>
          <p className="mt-1 text-xs font-medium text-green-600 flex items-center gap-1">
            <TrendingUp size={14}/> +0.6% optimization
          </p>
        </div>
      </div>

      {/* Chart Placeholder Box */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900">Revenue Overview</h3>
        <p className="text-xs text-gray-500 mt-0.5">Daily earnings report over the last 7 days.</p>
        <div className="mt-6 h-64 w-full flex items-end justify-between gap-2 border-b border-gray-100 pb-4 px-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
            const heights = ["40%", "65%", "50%", "80%", "62%", "95%", "78%"];
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div style={{ height: heights[i] }} className="w-full max-w-[48px] bg-[#FF7200]/90 hover:bg-[#FF7200] rounded-t-xl transition-all"></div>
                <span className="text-xs font-medium text-gray-500">{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}