import FormPage from "../../../components/BusinessDashboard/FormPage";
const fields = [{"name": "name", "label": "Full name", "type": "text", "required": true, "placeholder": "Enter full name"}, {"name": "email", "label": "Email address", "type": "email", "required": true, "placeholder": "Enter email address"}, {"name": "role", "label": "Role", "type": "select", "required": true, "placeholder": "Enter role", "options": ["Owner", "Admin", "Manager", "Employee", "Viewer"]}, {"name": "message", "label": "Invitation message", "type": "textarea", "required": false, "placeholder": "Enter invitation message"}];
export default function InviteMember() {
  return <FormPage title="Invite Team Member" description="Invite someone to collaborate on your store." fields={fields} submitLabel="Send invitation" backTo="/dashboard/team" onSubmit={values => console.log("Invite Team Member demo submission:", values)} />;
}
