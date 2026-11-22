import { X, AlertTriangle } from "lucide-react";
export default function ConfirmModal({ open, title = "Are you sure?", message, confirmText = "Confirm", onConfirm, onCancel, danger = false }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
    <div className="flex items-start justify-between"><div className={`grid h-11 w-11 place-items-center rounded-xl ${danger ? "bg-red-50 text-red-600" : "bg-orange-50 text-[#FF7200]"}`}><AlertTriangle size={21}/></div><button onClick={onCancel} aria-label="Close" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X size={18}/></button></div>
    <h3 className="mt-4 text-lg font-bold text-gray-900">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-500">{message}</p>
    <div className="mt-6 flex justify-end gap-3"><button onClick={onCancel} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button><button onClick={onConfirm} className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white ${danger ? "bg-red-600 hover:bg-red-700" : "bg-[#FF7200] hover:bg-[#E66500]"}`}>{confirmText}</button></div>
  </div></div>;
}
