import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function FormPage({ 
  title, 
  description, 
  fields = [], 
  submitLabel = "Save", 
  backTo = "/dashboard", 
  initialValues = {}, 
  onSubmit 
}) {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState({ loading: false, error: "", success: false });

  // Sync initialValues if they load asynchronously (e.g., fetched from a database API)
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setValues(initialValues);
    }
  }, [initialValues]);

  const update = (name, value) => { 
    setValues(v => ({ ...v, [name]: value })); 
    setStatus({ loading: false, error: "", success: false }); 
  };

  const submit = async e => { 
    e.preventDefault(); 
    setStatus({ loading: true, error: "", success: false });

    try {
      await onSubmit?.(values);
      setStatus({ loading: false, error: "", success: true });
    } catch (err) {
      setStatus({ loading: false, error: err.message || "Failed to save changes.", success: false });
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button 
        type="button" 
        onClick={() => navigate(backTo)} 
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#FF7200] cursor-pointer"
      >
        <ArrowLeft size={16}/> Back
      </button>

      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <form onSubmit={submit} className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7 shadow-sm">
        {fields.map(field => (
          <div key={field.name}>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>

            {field.type === "textarea" ? (
              <textarea 
                required={field.required} 
                rows={4} 
                value={values[field.name] || ""} 
                onChange={e => update(field.name, e.target.value)} 
                placeholder={field.placeholder} 
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#FF7200] focus:ring-2 focus:ring-orange-100"
              />
            ) : field.type === "select" ? (
              <select 
                required={field.required} 
                value={values[field.name] || ""} 
                onChange={e => update(field.name, e.target.value)} 
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#FF7200]"
              >
                <option value="">Select {field.label}</option>
                {field.options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input 
                required={field.required} 
                type={field.type || "text"} 
                value={values[field.name] || ""} 
                onChange={e => update(field.name, e.target.value)} 
                placeholder={field.placeholder} 
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#FF7200] focus:ring-2 focus:ring-orange-100"
              />
            )}
          </div>
        ))}

        {status.error && (
          <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100">
            {status.error}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
          <p className={`text-sm ${status.success ? "text-green-600" : "text-gray-400"}`}>
            {status.success ? "Changes saved successfully!" : ""}
          </p>
          <button 
            type="submit" 
            disabled={status.loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF7200] px-5 py-3 text-sm font-semibold text-white hover:bg-[#E66500] disabled:opacity-50 cursor-pointer transition"
          >
            {status.loading && <Loader2 className="animate-spin" size={16} />}
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}