import ResourcePage from "../../../components/BusinessDashboard/ResourcePage";
const columns = [{"key": "code", "label": "Code"}, {"key": "discount", "label": "Discount"}, {"key": "uses", "label": "Uses"}, {"key": "expires", "label": "Expires"}, {"key": "status", "label": "Status"}];
const initialItems = [{"code": "WELCOME10", "discount": "10%", "uses": "42", "expires": "30 Nov 2026", "status": "Active"}, {"code": "FESTIVE200", "discount": "₹200", "uses": "18", "expires": "15 Nov 2026", "status": "Active"}, {"code": "SUMMER15", "discount": "15%", "uses": "100", "expires": "31 Aug 2026", "status": "Expired"}];
export default function Coupons() {
  return <ResourcePage title="Coupons" description="Create discounts and promotional coupon codes." singular="Coupon" initialItems={initialItems} columns={columns} addLabel={"Create coupon"} />;
}
