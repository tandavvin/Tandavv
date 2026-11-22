import ResourcePage from "../../../components/BusinessDashboard/ResourcePage";
const columns = [{"key": "name", "label": "Customer"}, {"key": "email", "label": "Email"}, {"key": "orders", "label": "Orders"}, {"key": "spent", "label": "Total spent"}, {"key": "joined", "label": "Joined"}];
const initialItems = [{"name": "Rahul Sharma", "email": "rahul@example.com", "orders": "5", "spent": "₹12,450", "joined": "12 Oct 2026"}, {"name": "Priya Patel", "email": "priya@example.com", "orders": "3", "spent": "₹8,200", "joined": "18 Oct 2026"}, {"name": "Amit Kumar", "email": "amit@example.com", "orders": "2", "spent": "₹4,500", "joined": "25 Oct 2026"}];
export default function Customers() {
  return <ResourcePage title="Customers" description="View your customers and their purchase activity." singular="Customer" initialItems={initialItems} columns={columns} addLabel={"Add customer"} />;
}
