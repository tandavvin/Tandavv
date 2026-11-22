export const dashboardNavigation = [
  { label: "Overview", path: "/dashboard", permission: "dashboard:read" },
  { label: "My Website", path: "/dashboard/website", permission: "website:read" },
  { label: "Pages", path: "/dashboard/website/pages", permission: "website:edit" },
  { label: "Products", path: "/dashboard/products", permission: "products:read" },
  { label: "Orders", path: "/dashboard/orders", permission: "orders:read" },
  { label: "Customers", path: "/dashboard/customers", permission: "customers:read" },
  { label: "Marketing", path: "/dashboard/marketing", permission: "marketing:read" },
  { label: "Analytics", path: "/dashboard/analytics", permission: "analytics:read" },
  { label: "Team", path: "/dashboard/team", permission: "team:read" },
  { label: "Billing", path: "/dashboard/billing", permission: "billing:read" },
];
