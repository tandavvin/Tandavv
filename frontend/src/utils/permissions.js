//src/utils/permissions.js

const rolePermissions = {
  Owner: ["*"],
  Admin: ["dashboard:read","website:read","website:edit","products:read","products:write","orders:read","orders:write","customers:read","marketing:read","marketing:write","analytics:read","team:read","team:write","billing:read","settings:write"],
  Manager: ["dashboard:read","website:read","products:read","products:write","orders:read","orders:write","customers:read","marketing:read","analytics:read","team:read"],
  Employee: ["dashboard:read","products:read","orders:read","orders:write","customers:read"],
  Viewer: ["dashboard:read","website:read","products:read","orders:read","customers:read","analytics:read"],
};
export function hasPermission(role, permission) {
  const permissions = rolePermissions[role] || [];
  return permissions.includes("*") || permissions.includes(permission);
}
export function getPermissions(role) {
  return rolePermissions[role] || [];
}
