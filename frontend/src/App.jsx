
import { Navigate, Route, Routes } from "react-router-dom";

import RequireAuth from "./components/RequireAuth";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PublicStore from "./pages/PublicStore";
import Signup from "./pages/Signup";
import GoogleCallback from "./pages/GoogleCallback";

import TemplateEditor from "./Editor/TemplateEditor";
import LandingPage from "./pages/LandingPage";

// Business Dashboard
import DashboardLayout from "./components/BusinessDashboard/DashboardLayout";
import Overview from "./pages/BusinessDashboard/Overview";

import WebsiteOverview from "./pages/BusinessDashboard/Website/WebsiteOverview";
import Pages from "./pages/BusinessDashboard/Website/Pages";
import Domain from "./pages/BusinessDashboard/Website/Domain";
import ManagePages from "./pages/BusinessDashboard/Website/ManagePages";

import Products from "./pages/BusinessDashboard/Products/Products";
import AddProduct from "./pages/BusinessDashboard/Products/AddProduct";
import EditProduct from "./pages/BusinessDashboard/Products/EditProduct";

import Orders from "./pages/BusinessDashboard/Orders/Orders";
import OrderDetails from "./pages/BusinessDashboard/Orders/OrderDetails";

import Customers from "./pages/BusinessDashboard/Customers/Customers";
import CustomerDetails from "./pages/BusinessDashboard/Customers/CustomerDetails";

import Marketing from "./pages/BusinessDashboard/Marketing/Marketing";
import Coupons from "./pages/BusinessDashboard/Marketing/Coupons";
import Campaigns from "./pages/BusinessDashboard/Marketing/Campaigns";

import TeamManagement from "./pages/BusinessDashboard/Team/TeamManagement";
import InviteMember from "./pages/BusinessDashboard/Team/InviteMember";
import EditMember from "./pages/BusinessDashboard/Team/EditMember";

import Analytics from "./pages/BusinessDashboard/Analytics/Analytics";
import Billing from "./pages/BusinessDashboard/Billing/Billing";

import Settings from "./pages/BusinessDashboard/Settings/Settings";
import GeneralSettings from "./pages/BusinessDashboard/Settings/GeneralSettings";
import ProfileSettings from "./pages/BusinessDashboard/Settings/ProfileSettings";
import SecuritySettings from "./pages/BusinessDashboard/Settings/SecuritySettings";

import Support from "./pages/BusinessDashboard/Support/Support";

// Public Pages
import TemplatePreviewPage from "./pages/TemplatePreview";
import Templates from "./pages/Templates";
import Pricing from "./pages/Pricing";
import About from "./pages/About";

// Super Admin
import SuperAdminLayout from "./admin/layouts/SuperAdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import SubAdminList from "./admin/pages/SubAdmins/SubAdminList";
import SubAdminForm from "./admin/pages/SubAdmins/SubAdminForm";
import Permissions from "./admin/pages/Permissions";
import SubAdminDetails from "./admin/pages/SubAdmins/SubAdminDetails";
import Users from "./admin/pages/Users";
import ForgotPassword from "./pages/ForgetPassword";
import Stores from "./admin/pages/Stores";
import AdminProducts from "./admin/pages/Products";

export default function App() {
    return (
        <Routes>

            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Public Marketing & Discovery Pages */}
            <Route path="/templates" element={<Templates />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />

            {/* Public Template Preview */}
            <Route
                path="/templates/preview/:templateId"
                element={<TemplatePreviewPage />}
            />
            
            <Route
                path="/templates/:templateId/preview"
                element={<TemplatePreviewPage />}
            />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Google OAuth Callback */}
            <Route
                path="/auth/google/callback"
                element={<GoogleCallback />}
            />

            {/* Super Admin / Sub Admin Routes */}
            <Route
                path="/admin"
                element={
                    <RequireAuth allowedRoles={["superadmin", "subadmin"]}>
                        <SuperAdminLayout />
                    </RequireAuth>
                }
            >
                <Route
                    index
                    element={<Navigate to="dashboard" replace />}
                />

                <Route path="dashboard" element={<Dashboard />} />

                {/* Sub Admin Management */}
                <Route path="sub-admins" element={<SubAdminList />} />

                <Route
                    path="sub-admins/create"
                    element={<SubAdminForm />}
                />

                <Route
                    path="sub-admins/view/:subAdminId"
                    element={<SubAdminDetails />}
                />

                <Route
                    path="sub-admins/edit/:subAdminId"
                    element={<SubAdminForm />}
                />

                <Route path="permissions" element={<Permissions />} />

                <Route path="users" element={<Users />} />

                <Route path="stores" element={<Stores />} />

                <Route path="products" element={<AdminProducts />} />

            </Route>

            {/* Protected Business Dashboard */}
            <Route
                path="/dashboard"
                element={
                    <RequireAuth>
                        <DashboardLayout />
                    </RequireAuth>
                }
            >
                <Route index element={<Overview />} />

                {/* Website */}
                <Route path="website" element={<WebsiteOverview />} />
                <Route path="website/pages" element={<Pages />} />
                <Route path="website/domain" element={<Domain />} />
                <Route
                    path="website/manage-pages"
                    element={<ManagePages />}
                />

                {/* Products */}
                <Route path="products" element={<Products />} />
                <Route path="products/new" element={<AddProduct />} />
                <Route path="products/:id/edit" element={<EditProduct />} />

                {/* Orders */}
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:id" element={<OrderDetails />} />

                {/* Customers */}
                <Route path="customers" element={<Customers />} />
                <Route
                    path="customers/:id"
                    element={<CustomerDetails />}
                />

                {/* Marketing */}
                <Route path="marketing" element={<Marketing />} />
                <Route path="marketing/coupons" element={<Coupons />} />
                <Route
                    path="marketing/campaigns"
                    element={<Campaigns />}
                />

                {/* Team Management */}
                <Route path="team" element={<TeamManagement />} />
                <Route path="team/invite" element={<InviteMember />} />
                <Route path="team/:id/edit" element={<EditMember />} />

                {/* Analytics */}
                <Route path="analytics" element={<Analytics />} />

                {/* Billing */}
                <Route path="billing" element={<Billing />} />

                {/* Settings */}
                <Route path="settings" element={<Settings />} />
                <Route
                    path="settings/general"
                    element={<GeneralSettings />}
                />
                <Route
                    path="settings/profile"
                    element={<ProfileSettings />}
                />
                <Route
                    path="settings/security"
                    element={<SecuritySettings />}
                />

                {/* Support */}
                <Route path="support" element={<Support />} />

                {/* Dashboard Fallback */}
                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />
            </Route>

            {/* Template Editor */}
            <Route
                path="/editor"
                element={<Navigate to="/dashboard" replace />}
            />

            <Route
                path="/editor/:storeId"
                element={
                    <RequireAuth>
                        <TemplateEditor />
                    </RequireAuth>
                }
            />

            {/* Public Customer Store */}
            <Route path="/s/:slug" element={<PublicStore />} />
            <Route path="/s/:slug/product/:productId" element={<PublicStore />} />

            {/* Not Found */}
            <Route path="*" element={<NotFound />} />

        </Routes>
    );
}
