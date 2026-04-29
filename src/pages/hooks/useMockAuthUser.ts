// TODO: ลบไฟล์นี้เมื่อ integrate API จริง
import { permissionCodes } from "@/consts/permission/permissionCodes";
import type {
  MenuPermission,
  Permission,
  User,
} from "@/types/auth/User";
import type { PermissionCode } from "@/types/permission/PermissionCode";

const MOCK_DELAY_MS = 500;
const ONE_HOUR = 60 * 60;
const ONE_DAY = 24 * ONE_HOUR;

const buildPermissions = (allowed: Permission["code"][]): Permission[] =>
  (["view", "create", "update", "delete", "import", "export"] as const).map(
    (code, idx) => ({
      permission_id: idx + 1,
      code,
      is_allowed: allowed.includes(code),
      seq: idx + 1,
    }),
  );

const MENU_DEFS: { menu_id: number; code: PermissionCode; name: string }[] = [
  { menu_id: 1, code: permissionCodes.dashboard, name: "Dashboard" },
  { menu_id: 2, code: permissionCodes.category, name: "Category" },
  { menu_id: 3, code: permissionCodes.product, name: "Product" },
  { menu_id: 4, code: permissionCodes.stock, name: "Stock" },
  { menu_id: 5, code: permissionCodes.supplier, name: "Supplier" },
  { menu_id: 6, code: permissionCodes.purchase_order, name: "Purchase Order" },
  { menu_id: 7, code: permissionCodes.report, name: "Report" },
];

const buildMenuPermissions = (
  matrix: Record<string, Permission["code"][]>,
): MenuPermission[] =>
  MENU_DEFS.map((m, idx) => ({
    menu_id: m.menu_id,
    code: m.code,
    name: m.name,
    seq: idx + 1,
    permissions: buildPermissions(matrix[m.code] ?? []),
  }));

const ADMIN_MATRIX: Record<string, Permission["code"][]> = {
  dashboard: ["view"],
  category: ["view", "create", "update", "delete"],
  product: ["view", "create", "update", "delete"],
  stock: ["view", "create", "update", "delete", "import", "export"],
  supplier: ["view", "create", "update", "delete"],
  purchase_order: ["view", "create", "update", "delete", "export"],
  report: ["view", "export"],
};

const STAFF_MATRIX: Record<string, Permission["code"][]> = {
  dashboard: ["view"],
  category: ["view"],
  product: ["view", "update"],
  stock: ["view", "create"],
  supplier: ["view"],
  purchase_order: ["view", "create", "update"],
  report: ["view", "export"],
};

const VIEWER_MATRIX: Record<string, Permission["code"][]> = {
  dashboard: ["view"],
  category: ["view"],
  product: ["view"],
  stock: ["view"],
  supplier: ["view"],
  purchase_order: ["view"],
  report: ["view"],
};

const buildMockUser = (
  user_id: string,
  username: string,
  role_id: string,
  roleName: string,
  matrix: Record<string, Permission["code"][]>,
): User => {
  const now = Math.floor(Date.now() / 1000);
  return {
    user_id,
    username,
    role: { role_id, name: roleName },
    menu_permissions: buildMenuPermissions(matrix),
    access_token: `mock-access-${role_id}`,
    access_token_exp: now + ONE_HOUR,
    refresh_token: `mock-refresh-${role_id}`,
    refresh_token_exp: now + 7 * ONE_DAY,
    remember_me: false,
  };
};

export const MOCK_USERS: Record<string, User> = {
  admin: buildMockUser("u-admin", "admin", "role-admin", "Admin", ADMIN_MATRIX),
  staff: buildMockUser("u-staff", "staff", "role-staff", "Staff", STAFF_MATRIX),
  viewer: buildMockUser(
    "u-viewer",
    "viewer",
    "role-viewer",
    "Viewer",
    VIEWER_MATRIX,
  ),
};

export const useMockAuthUser = () => {
  const getMockAuthUser = async (
    username: string,
    remember_me: boolean,
  ): Promise<User | null> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    const user = MOCK_USERS[username.toLowerCase()];
    if (!user) return null;
    return { ...user, remember_me };
  };

  return { getMockAuthUser };
};
