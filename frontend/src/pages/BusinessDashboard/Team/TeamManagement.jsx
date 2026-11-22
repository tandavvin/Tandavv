import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

export default function TeamManagement({ storeId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeId) return;
    
    apiFetch(`/team?storeId=${storeId}`)
      .then((res) => {
        setMembers(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load team members:", err);
        setLoading(false);
      });
  }, [storeId]);

  if (loading) return <div className="p-6 text-center text-sm text-gray-500">Loading team...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Team Management</h1>
          <p className="mt-1 text-xs text-gray-500">Invite and manage employees and their permissions.</p>
        </div>
        <Link
          to="/dashboard/team/invite"
          className="rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-orange-700 transition"
        >
          + Invite Employee
        </Link>
      </div>

      <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Active Team Members</h2>

        {members.length === 0 ? (
          <p className="text-xs text-gray-400 py-8 text-center">No team members found for this store.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {members.map((member) => (
              <div key={member._id} className="flex items-center justify-between py-3.5">
                <div>
                  <p className="text-xs font-bold text-gray-800">{member.userId?.name || "Employee"}</p>
                  <p className="text-[11px] text-gray-400">{member.userId?.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full uppercase text-[10px]">
                    {member.role}
                  </span>
                  <Link
                    to={`/dashboard/team/edit/${member._id}`}
                    className="text-xs font-semibold text-gray-600 hover:text-orange-600 border border-gray-200 px-3 py-1 rounded-lg transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}