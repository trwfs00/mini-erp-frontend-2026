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

export type NavItem = {
  path: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { path: ROUTE_PATHS.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { path: ROUTE_PATHS.PRODUCT, label: "Products", icon: Package },
  { path: ROUTE_PATHS.CATEGORY, label: "Category", icon: Tags },
  { path: ROUTE_PATHS.STOCK, label: "Stock", icon: Warehouse },
  { path: ROUTE_PATHS.SUPPLIERS, label: "Suppliers", icon: Truck },
  {
    path: ROUTE_PATHS.PURCHASE_ORDERS,
    label: "Purchase Orders",
    icon: ClipboardList,
  },
  { path: ROUTE_PATHS.REPORT, label: "Report", icon: BarChart3 },
] as const;
