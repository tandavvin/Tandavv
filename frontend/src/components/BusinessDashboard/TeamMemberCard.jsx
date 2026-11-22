export default function TeamMemberCard({ member }) {
  return <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-100 font-bold text-[#FF7200]">{member.name?.charAt(0) || "U"}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-gray-800">{member.name}</p><p className="truncate text-xs text-gray-500">{member.email}</p></div><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">{member.role}</span></div>;
}
