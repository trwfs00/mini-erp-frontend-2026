import type { PermissionActions } from "@/types/permission/PermissionActions";

export const NO_PERMISSION: PermissionActions = {
  canView: false,
  canCreate: false,
  canUpdate: false,
  canDelete: false,
  canImport: false,
  canExport: false,
  hasSomePermission: false,
};
