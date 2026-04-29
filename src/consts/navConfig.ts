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

export type NavItem = {
  path: string;
  label: string;
  icon: LucideIcon;
  permissionCode: PermissionCode;
};

export const NAV_ITEMS: readonly NavItem[] = [
  {
    path: ROUTE_PATHS.DASHBOARD,
    label: "Dashboard",
    icon: LayoutDashboard,
    permissionCode: "dashboard",
  },
  {
    path: ROUTE_PATHS.PRODUCT,
    label: "Products",
    icon: Package,
    permissionCode: "product",
  },
  {
    path: ROUTE_PATHS.CATEGORY,
    label: "Categories",
    icon: Tags,
    permissionCode: "category",
  },
  {
    path: ROUTE_PATHS.STOCK,
    label: "Stock",
    icon: Warehouse,
    permissionCode: "stock",
  },
  {
    path: ROUTE_PATHS.SUPPLIERS,
    label: "Suppliers",
    icon: Truck,
    permissionCode: "supplier",
  },
  {
    path: ROUTE_PATHS.PURCHASE_ORDERS,
    label: "Purchase Orders",
    icon: ClipboardList,
    permissionCode: "purchase_order",
  },
  {
    path: ROUTE_PATHS.REPORT,
    label: "Report",
    icon: BarChart3,
    permissionCode: "report",
  },
] as const;
