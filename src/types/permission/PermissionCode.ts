import { permissionCodes } from "@/consts/permission/permissionCodes";

export type PermissionCode =
  (typeof permissionCodes)[keyof typeof permissionCodes];
