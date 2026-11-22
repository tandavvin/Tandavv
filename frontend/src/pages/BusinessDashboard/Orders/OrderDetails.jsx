import FormPage from "../../../components/BusinessDashboard/FormPage";
const fields = [{"name": "customer", "label": "Customer name", "type": "text", "required": true, "placeholder": "Enter customer name"}, {"name": "product", "label": "Product", "type": "text", "required": true, "placeholder": "Enter product"}, {"name": "amount", "label": "Order amount", "type": "number", "required": true, "placeholder": "Enter order amount"}, {"name": "status", "label": "Order status", "type": "select", "required": true, "placeholder": "Enter order status", "options": ["Pending", "Processing", "Completed", "Cancelled"]}];
export default function OrderDetails() {
  return <FormPage title="Order Details" description="Create or update an order record." fields={fields} submitLabel="Save order" backTo="/dashboard/orders" onSubmit={values => console.log("Order Details demo submission:", values)} />;
}
