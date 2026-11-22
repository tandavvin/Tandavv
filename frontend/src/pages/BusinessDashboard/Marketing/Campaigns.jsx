import ResourcePage from "../../../components/BusinessDashboard/ResourcePage";
const columns = [{"key": "name", "label": "Campaign"}, {"key": "channel", "label": "Channel"}, {"key": "reach", "label": "Reach"}, {"key": "date", "label": "Date"}, {"key": "status", "label": "Status"}];
const initialItems = [{"name": "Diwali Sale", "channel": "Email", "reach": "2,400", "date": "25 Oct 2026", "status": "Completed"}, {"name": "New Arrivals", "channel": "Social", "reach": "1,850", "date": "01 Nov 2026", "status": "Running"}];
export default function Campaigns() {
  return <ResourcePage title="Campaigns" description="Plan and review your marketing campaigns." singular="Campaign" initialItems={initialItems} columns={columns} addLabel={"Create campaign"} />;
}
