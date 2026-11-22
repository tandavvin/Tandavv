import FormPage from "../../../components/BusinessDashboard/FormPage";
const fields = [{"name": "name", "label": "Full name", "type": "text", "required": true, "placeholder": "Enter full name"}, {"name": "email", "label": "Email address", "type": "email", "required": true, "placeholder": "Enter email address"}, {"name": "role", "label": "Role", "type": "select", "required": true, "placeholder": "Enter role", "options": ["Owner", "Admin", "Manager", "Employee", "Viewer"]}];
export default function EditMember() {
  return <FormPage title="Edit Team Member" description="Update the member's role and details." fields={fields} submitLabel="Save member" backTo="/dashboard/team" onSubmit={values => console.log("Edit Team Member demo submission:", values)} />;
}
