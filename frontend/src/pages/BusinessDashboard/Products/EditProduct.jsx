import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormPage from "../../../components/BusinessDashboard/FormPage";
import { apiFetch } from "../../../utils/api";

const fields = [
  { name: "name", label: "Product Name", type: "text", required: true, placeholder: "e.g. Premium Wheat Flour" },
  { name: "category", label: "Category", type: "text", required: true, placeholder: "e.g. Packaging & Goods" },
  { name: "price", label: "Price", type: "text", required: true, placeholder: "e.g. ₹299" },
  { name: "badge", label: "Badge (Optional)", type: "text", required: false, placeholder: "e.g. Best Seller, Sale" },
  { name: "link", label: "Action Link", type: "text", required: false, placeholder: "#" }
];

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams(); // Product index or ID from URL route
  const [store, setStore] = useState(null);
  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/config")
      .then((res) => {
        const storeData = res.data;
        if (storeData) {
          setStore(storeData);
          const productList = storeData.products?.items || [];
          const product = productList[id]; // Find product by index
          if (product) {
            setInitialValues({
              name: product.name || "",
              category: product.category || "",
              price: product.price || "",
              badge: product.badge || "",
              link: product.link || "#"
            });
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load product for editing:", err);
        setLoading(false);
      });
  }, [id]);

  const handleUpdateProduct = async (values) => {
    if (!store) throw new Error("No active store found.");

    const currentProducts = [...(store.products?.items || [])];
    currentProducts[id] = {
      ...currentProducts[id],
      name: values.name,
      category: values.category,
      price: values.price,
      badge: values.badge || "",
      link: values.link || "#"
    };

    await apiFetch(`/config?storeId=${store._id}`, {
      method: "PUT",
      body: {
        products: {
          ...store.products,
          items: currentProducts
        }
      }
    });

    navigate("/dashboard/products");
  };

  if (loading) return <div className="p-8 text-center text-xs text-gray-400">Loading product details...</div>;

  return (
    <FormPage
      title="Edit Product"
      description="Update product attributes, pricing, and badges."
      fields={fields}
      initialValues={initialValues}
      submitLabel="Update product"
      backTo="/dashboard/products"
      onSubmit={handleUpdateProduct}
    />
  );
}