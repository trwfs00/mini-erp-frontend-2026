import type { ActionCode } from "@/types/permission/ActionCode";
import type { PermissionCode } from "@/types/permission/PermissionCode";

export type UserRole = {
  role_id: string;
  name: string;
};

export type Permission = {
  permission_id: number;
  code: ActionCode;
  is_allowed: boolean;
  seq: number;
};

export type MenuPermission = {
  menu_id: number;
  code: PermissionCode;
  name: string;
  seq: number;
  permissions: Permission[];
};

export type User = {
  user_id: string;
  username: string;
  role: UserRole;
  menu_permissions: MenuPermission[];
  access_token: string;
  access_token_exp: number;
  refresh_token: string;
  refresh_token_exp: number;
  remember_me: boolean;
};
