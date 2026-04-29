import { NO_PERMISSION } from "@/consts/permission/noPermission";
import { $authUser } from "@/stores/authUserStore";
import type { ActionCode } from "@/types/permission/ActionCode";
import type { PermissionActions } from "@/types/permission/PermissionActions";
import type { PermissionCode } from "@/types/permission/PermissionCode";
import { PermissionUtil } from "@/utils/PermissionUtil";
import { useStore } from "@nanostores/react";

export function usePermission(
  permissionCode: PermissionCode,
): PermissionActions;

export function usePermission(
  permissionCode: PermissionCode,
  actionCode: ActionCode[],
): boolean;

export function usePermission(
  permissionCode: PermissionCode,
  actionCode?: ActionCode[],
): PermissionActions | boolean {
  const authUser = useStore($authUser);

  if (!actionCode) {
    if (!authUser) return NO_PERMISSION;
    return PermissionUtil.checkPermission(authUser, permissionCode);
  }

  if (!authUser) return false;
  return PermissionUtil.checkPermissionAction(
    authUser,
    permissionCode,
    actionCode,
  );
}
