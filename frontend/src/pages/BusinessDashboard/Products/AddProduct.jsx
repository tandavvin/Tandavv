import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormPage from "../../../components/BusinessDashboard/FormPage";
import { apiFetch } from "../../../utils/api";

const fields = [
  { name: "name", label: "Product Name", type: "text", required: true, placeholder: "e.g. Premium Wheat Flour" },
  { name: "category", label: "Category", type: "text", required: true, placeholder: "e.g. Packaging & Goods" },
  { name: "price", label: "Price", type: "text", required: true, placeholder: "e.g. ₹299" },
  { name: "badge", label: "Badge (Optional)", type: "text", required: false, placeholder: "e.g. Best Seller, Sale" },
  { name: "link", label: "Action Link", type: "text", required: false, placeholder: "#" }
];

export default function AddProduct() {
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/config")
      .then((res) => {
        if (res.data) setStore(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load store config:", err);
        setLoading(false);
      });
  }, []);

  const handleSaveProduct = async (values) => {
    if (!store) throw new Error("No active store found.");

    const currentProducts = store.products?.items || [];
    const updatedProducts = [...currentProducts, {
      name: values.name,
      category: values.category,
      price: values.price,
      badge: values.badge || "",
      image: "",
      link: values.link || "#"
    }];

    await apiFetch(`/config?storeId=${store._id}`, {
      method: "PUT",
      body: {
        products: {
          ...store.products,
          items: updatedProducts
        }
      }
    });

    navigate("/dashboard/products");
  };

  if (loading) return <div className="p-8 text-center text-xs text-gray-400">Loading product form...</div>;

  return (
    <FormPage
      title="Add New Product"
      description="Add a new item to your store catalog and product showcase section."
      fields={fields}
      submitLabel="Save product"
      backTo="/dashboard/products"
      onSubmit={handleSaveProduct}
    />
  );
}