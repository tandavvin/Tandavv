// /src/admin/constants/permissions.js

import {
    Users,
    Store,
    PanelsTopLeft,
    Package,
    CreditCard,
    Activity,
} from "lucide-react";

export const permissionGroups = [
    {
        title: "User Management",
        description: "Control platform user accounts.",
        icon: Users,
        permissions: [
            "View Users",
            "Create Users",
            "Edit Users",
            "Delete Users",
        ],
    },
    {
        title: "Store Management",
        description: "Manage customer storefronts.",
        icon: Store,
        permissions: [
            "View Stores",
            "Edit Stores",
            "Suspend Stores",
        ],
    },
    {
        title: "Template Management",
        description: "Control website templates.",
        icon: PanelsTopLeft,
        permissions: [
            "View Templates",
            "Create Templates",
            "Edit Templates",
            "Delete Templates",
        ],
    },
    {
        title: "Product Management",
        description: "Manage products across the platform.",
        icon: Package,
        permissions: [
            "View Products",
            "Create Products",
            "Edit Products",
            "Delete Products",
        ],
    },
    {
        title: "Finance Management",
        description: "Control payments and subscriptions.",
        icon: CreditCard,
        permissions: [
            "View Payments",
            "Manage Payments",
            "View Subscriptions",
            "Manage Subscriptions",
        ],
    },
    {
        title: "System Management",
        description: "Manage platform-level operations.",
        icon: Activity,
        permissions: [
            "View Activity Logs",
            "View Coupons",
            "Manage Coupons",
            "View Notifications",
            "Manage Notifications",
            "View Support",
            "Manage Support",
        ],
    },
];

// Every action permission requires its corresponding View permission.
export const permissionDependencies = {
    "Create Users": "View Users",
    "Edit Users": "View Users",
    "Delete Users": "View Users",

    "Edit Stores": "View Stores",
    "Suspend Stores": "View Stores",

    "Create Templates": "View Templates",
    "Edit Templates": "View Templates",
    "Delete Templates": "View Templates",

    "Create Products": "View Products",
    "Edit Products": "View Products",
    "Delete Products": "View Products",

    "Manage Payments": "View Payments",
    "Manage Subscriptions": "View Subscriptions",

    "Manage Coupons": "View Coupons",
    "Manage Notifications": "View Notifications",
    "Manage Support": "View Support",
};

export const allPermissions = permissionGroups.flatMap(
    (group) => group.permissions
);
