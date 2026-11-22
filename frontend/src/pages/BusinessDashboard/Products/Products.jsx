import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResourcePage from "../../../components/BusinessDashboard/ResourcePage";
import { apiFetch, API_ORIGIN, getToken } from "../../../utils/api";

const columns = [
  { key: "name", label: "Product Name" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "badge", label: "Badge" }
];

export default function Products() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [storeId, setStoreId] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    apiFetch("/config")
      .then((res) => {
        const store = res.data;
        if (store) {
          setStoreId(store._id);
          setStoreData(store);
          const productList = store?.products?.items || [];
          const formattedProducts = productList.map((prod, index) => ({
            id: index,
            name: prod.name || "Unnamed Product",
            category: prod.category || "General",
            price: prod.price || "₹0",
            badge: prod.badge || ""
          }));
          setItems(formattedProducts);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 1. ADD BUTTON: Navigates to the add product form page
  const handleAddProduct = () => {
    navigate("/dashboard/products/add");
  };

  // 2. EDIT BUTTON: Navigates to edit or opens product settings
  const handleEditProduct = (item) => {
    navigate(`/dashboard/products/edit/${item.id}`);
  };

  // 3. DELETE ACTION: Removes product from MongoDB
  const handleDeleteProduct = async (item) => {
    if (!storeData) return;
    const currentProducts = storeData.products?.items || [];
    const updatedProducts = currentProducts.filter((_, index) => index !== item.id);

    await apiFetch(`/config?storeId=${storeId}`, {
      method: "PUT",
      body: {
        products: {
          ...storeData.products,
          items: updatedProducts
        }
      }
    });

    fetchProducts();
  };

  // 4. EXPORT BUTTON: Downloads products as a JSON file
  const handleExportProducts = async () => {
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
      a.download = `tandav-products-export-${storeId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download product data.");
    }
  };

  // 5. THREE-DOT MENU ACTIONS SPECIFIC TO PRODUCTS
  const handlePreviewProduct = (item) => {
    alert(`Previewing product: ${item.name}`);
  };

  const handleDuplicateProduct = async (item) => {
    if (!storeData) return;
    const currentProducts = storeData.products?.items || [];
    const targetProduct = currentProducts[item.id];
    
    if (!targetProduct) return;

    const duplicated = {
      ...targetProduct,
      name: `${targetProduct.name} (Copy)`
    };

    const updatedProducts = [...currentProducts, duplicated];

    await apiFetch(`/config?storeId=${storeId}`, {
      method: "PUT",
      body: {
        products: {
          ...storeData.products,
          items: updatedProducts
        }
      }
    });

    fetchProducts();
  };

  if (loading) return <div className="p-8 text-center text-xs text-gray-400">Loading products...</div>;

  return (
    <ResourcePage
      title="Products"
      description="Manage items, inventory, and storefront product showcases."
      singular="Product"
      initialItems={items}
      columns={columns}
      addLabel="Add product"
      onAdd={handleAddProduct}
      onEdit={handleEditProduct}
      onDelete={handleDeleteProduct}
      onExport={handleExportProducts}
      onPreview={handlePreviewProduct}
      onDuplicate={handleDuplicateProduct}
    />
  );
}