import { ROUTE_PATHS } from "@/router/routePaths";
import { $authUser } from "@/stores/authUserStore";
import type { User } from "@/types/auth/User";
import type { ActionCode } from "@/types/permission/ActionCode";
import type { PermissionCode } from "@/types/permission/PermissionCode";
import { PermissionUtil } from "@/utils/PermissionUtil";
import { useStore } from "@nanostores/react";
import { useEffect, useState, type FC, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type Condition = {
  permissionCode: PermissionCode;
  actionCode?: ActionCode[];
};

type RoleGuardProps =
  | {
      mode: "single";
      permissionCode: PermissionCode;
      actionCode?: ActionCode[];
      children: ReactNode;
    }
  | { mode: "or"; conditions: Condition[]; children: ReactNode }
  | { mode: "and"; conditions: Condition[]; children: ReactNode };

const checkPermission = (
  authUser: User,
  permissionCode: PermissionCode,
  actionCode?: ActionCode[],
): boolean => {
  if (!actionCode) {
    return PermissionUtil.checkAnyPermission(authUser, permissionCode);
  }
  return PermissionUtil.checkPermissionAction(
    authUser,
    permissionCode,
    actionCode,
  );
};

export const RoleGuard: FC<RoleGuardProps> = (props) => {
  const navigate = useNavigate();
  const authUser = useStore($authUser);
  const [checkedRole, setCheckedRole] = useState<boolean>(false);

  useEffect(() => {
    if (!authUser) {
      navigate(ROUTE_PATHS.LOGIN);
      return;
    }

    let ok = false;

    if (props.mode === "single") {
      ok = checkPermission(authUser, props.permissionCode, props.actionCode);
    } else if (props.mode === "or") {
      ok = props.conditions.some((p) =>
        checkPermission(authUser, p.permissionCode, p.actionCode),
      );
    } else if (props.mode === "and") {
      ok = props.conditions.every((p) =>
        checkPermission(authUser, p.permissionCode, p.actionCode),
      );
    }

    if (!ok) {
      navigate(ROUTE_PATHS.DASHBOARD);
      return;
    }
    setCheckedRole(true);
  }, [authUser, props, navigate]);

  if (!checkedRole) return null;
  return <>{props.children}</>;
};
