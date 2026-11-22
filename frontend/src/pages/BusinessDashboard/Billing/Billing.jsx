import ResourcePage from "../../../components/BusinessDashboard/ResourcePage";
const columns = [{"key": "invoice", "label": "Invoice"}, {"key": "date", "label": "Date"}, {"key": "plan", "label": "Plan"}, {"key": "amount", "label": "Amount"}, {"key": "status", "label": "Status"}];
const initialItems = [{"invoice": "INV-2026-010", "date": "01 Nov 2026", "plan": "Free Plan", "amount": "₹0", "status": "Paid"}, {"invoice": "INV-2026-009", "date": "01 Oct 2026", "plan": "Free Plan", "amount": "₹0", "status": "Paid"}];
export default function Billing() {
  return <ResourcePage title="Billing & Subscription" description="Review your current plan, invoices, and payment history." singular="Invoice" initialItems={initialItems} columns={columns} addLabel={"View plans"} />;
}
