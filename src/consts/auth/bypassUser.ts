// TODO: ลบไฟล์นี้เมื่อ integrate API จริง — ใช้ผ่าน enableAuthBypass(true) เท่านั้น
import type { MenuPermission, User } from "@/types/auth/User";
import { permissionCodes } from "@/consts/permission/permissionCodes";
import { actionCodes } from "@/consts/permission/actionCodes";

const ALL_ACTIONS = Object.values(actionCodes);
const PERMISSION_CODES = Object.values(permissionCodes);

const buildAdminMenuPermissions = (): MenuPermission[] =>
  PERMISSION_CODES.map((code, menuIdx) => ({
    menu_id: menuIdx + 1,
    code,
    name: code,
    seq: menuIdx + 1,
    permissions: ALL_ACTIONS.map((action, actionIdx) => ({
      permission_id: menuIdx * 100 + actionIdx + 1,
      code: action,
      is_allowed: true,
      seq: actionIdx + 1,
    })),
  }));

export const BYPASS_ADMIN_USER: User = {
  user_id: "bypass-admin",
  username: "admin",
  role: { role_id: "admin", name: "Admin" },
  menu_permissions: buildAdminMenuPermissions(),
  access_token: "",
  access_token_exp: 0,
  refresh_token: "",
  refresh_token_exp: 0,
  remember_me: false,
};
