import { NO_PERMISSION } from "@/consts/permission/noPermission";
import type { User } from "@/types/auth/User";
import type { ActionCode } from "@/types/permission/ActionCode";
import type { PermissionActions } from "@/types/permission/PermissionActions";
import type { PermissionCode } from "@/types/permission/PermissionCode";

export const PermissionUtil = {
  checkAnyPermission(authUser: User, permissionCode: PermissionCode): boolean {
    if (!authUser.menu_permissions) return false;
    return !!authUser.menu_permissions.find(
      (menu) =>
        menu.code === permissionCode &&
        menu.permissions.some((perm) => perm.is_allowed),
    );
  },

  checkPermission(
    authUser: User,
    permissionCode: PermissionCode,
  ): PermissionActions {
    if (!authUser.menu_permissions) return NO_PERMISSION;

    const menu = authUser.menu_permissions.find(
      (m) => m.code === permissionCode,
    );

    if (!menu) return NO_PERMISSION;

    const has = (actionCode: ActionCode): boolean =>
      menu.permissions.some(
        (perm) => perm.code === actionCode && perm.is_allowed,
      );

    return {
      canView: has("view"),
      canCreate: has("create"),
      canUpdate: has("update"),
      canDelete: has("delete"),
      canImport: has("import"),
      canExport: has("export"),
      hasSomePermission: menu.permissions.some((perm) => perm.is_allowed),
    };
  },

  checkPermissionAction(
    authUser: User,
    permissionCode: PermissionCode,
    actionCode: ActionCode[],
  ): boolean {
    if (!authUser.menu_permissions) return false;
    return !!authUser.menu_permissions.find(
      (menu) =>
        menu.code === permissionCode &&
        menu.permissions.some(
          (perm) =>
            actionCode.includes(perm.code as ActionCode) && perm.is_allowed,
        ),
    );
  },
};
