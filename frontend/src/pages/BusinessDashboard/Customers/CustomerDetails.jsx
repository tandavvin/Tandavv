import FormPage from "../../../components/BusinessDashboard/FormPage";
const fields = [{"name": "name", "label": "Full name", "type": "text", "required": true, "placeholder": "Enter full name"}, {"name": "email", "label": "Email address", "type": "email", "required": true, "placeholder": "Enter email address"}, {"name": "phone", "label": "Phone number", "type": "tel", "required": false, "placeholder": "Enter phone number"}, {"name": "notes", "label": "Notes", "type": "textarea", "required": false, "placeholder": "Enter notes"}];
export default function CustomerDetails() {
  return <FormPage title="Customer Details" description="Add or update a customer profile." fields={fields} submitLabel="Save customer" backTo="/dashboard/customers" onSubmit={values => console.log("Customer Details demo submission:", values)} />;
}
