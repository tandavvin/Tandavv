import FormPage from "../../../components/BusinessDashboard/FormPage";
const fields=[{name:"name",label:"Full name",required:true},{name:"email",label:"Email address",type:"email",required:true},{name:"phone",label:"Phone number",type:"tel"}];
export default function ProfileSettings(){return <FormPage title="Profile Settings" description="Update the details associated with your account." fields={fields} submitLabel="Update profile" onSubmit={v=>console.log("Profile demo:",v)}/>;}
