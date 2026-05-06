import {
  LayoutDashboard,
  Package,
  Tags,
  Warehouse,
  Truck,
  ClipboardList,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { ROUTE_PATHS } from "@/router/routePaths";
import type { PermissionCode } from "@/types/permission/PermissionCode";
import type { Language } from "@/types/language/Language";
import { tMenu } from "@/consts/translations/tMenu";

export type NavItem = {
  path: string;
  label: Record<Language, string>;
  icon: LucideIcon;
  permissionCode: PermissionCode;
};

export const NAV_ITEMS: readonly NavItem[] = [
  {
    path: ROUTE_PATHS.DASHBOARD,
    label: tMenu.dashboard,
    icon: LayoutDashboard,
    permissionCode: "dashboard",
  },
  {
    path: ROUTE_PATHS.PRODUCT,
    label: tMenu.product,
    icon: Package,
    permissionCode: "product",
  },
  {
    path: ROUTE_PATHS.CATEGORY,
    label: tMenu.category,
    icon: Tags,
    permissionCode: "category",
  },
  {
    path: ROUTE_PATHS.STOCK,
    label: tMenu.stock,
    icon: Warehouse,
    permissionCode: "stock",
  },
  {
    path: ROUTE_PATHS.SUPPLIERS,
    label: tMenu.supplier,
    icon: Truck,
    permissionCode: "supplier",
  },
  {
    path: ROUTE_PATHS.PURCHASE_ORDERS,
    label: tMenu.purchaseOrder,
    icon: ClipboardList,
    permissionCode: "purchase_order",
  },
  {
    path: ROUTE_PATHS.REPORT,
    label: tMenu.report,
    icon: BarChart3,
    permissionCode: "report",
  },
] as const;
