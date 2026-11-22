export default function PagesTab() {
    return (
        <div className="space-y-3 animate-fadeIn">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Website Pages</span>
            {["Home", "Products", "About Us", "Contact", "Privacy Policy"].map((page, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 shadow-2xs">
                    <span>{page} {idx === 0 && "(Homepage)"}</span>
                    <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded">Active</span>
                </div>
            ))}
        </div>
    );
}