import { useState, useEffect } from "react";
import ResourcePage from "../../../components/BusinessDashboard/ResourcePage";
import { apiFetch, API_ORIGIN, getToken } from "../../../utils/api";

const columns = [
  { key: "orderId", label: "Order ID" },
  { key: "customer", label: "Customer" },
  { key: "total", label: "Total Amount" },
  { key: "status", label: "Fulfillment Status" },
  { key: "date", label: "Date" }
];

export default function Orders() {
  const [items, setItems] = useState([]);
  const [storeId, setStoreId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch active store config or connect to an /api/orders endpoint if available
    apiFetch("/config")
      .then((res) => {
        const store = res.data;
        if (store) {
          setStoreId(store._id);
          // Simulated order items matching your store activity; can be swapped with a real orders API call
          setItems([
            {
              id: "ord_101",
              orderId: "#TR-8921",
              customer: "Aarav Sharma",
              total: "₹1,499",
              status: "Completed",
              date: "Today, 10:45 AM"
            },
            {
              id: "ord_102",
              orderId: "#TR-8922",
              customer: "Priya Patel",
              total: "₹799",
              status: "Processing",
              date: "Yesterday"
            }
          ]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load orders:", err);
        setLoading(false);
      });
  }, []);

  const handleExportOrders = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_ORIGIN}/api/config/export?storeId=${storeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tandav-orders-export-${storeId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to export orders.");
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-gray-400">Loading orders...</div>;

  return (
    <ResourcePage
      title="Orders"
      description="Track and manage customer purchases, payment confirmations, and fulfillment."
      singular="Order"
      initialItems={items}
      columns={columns}
      addLabel="Create order"
      onAdd={() => alert("Manual order creation modal can be hooked here.")}
      onEdit={(item) => alert(`Viewing order details for ${item.orderId}`)}
      onExport={handleExportOrders}
    />
  );
}