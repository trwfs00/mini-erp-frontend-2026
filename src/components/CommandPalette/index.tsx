import { Spotlight, type SpotlightActionData } from "@mantine/spotlight";
import { useMantineColorScheme } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  FileText,
  LogOut,
  Moon,
  Package,
  Palette,
  PlusCircle,
  Search,
  ShoppingCart,
  Sun,
  Tag,
  Truck,
  Warehouse,
} from "lucide-react";
import { ROUTE_PATHS } from "@/router/routePaths";
import { AuthUtil } from "@/utils/AuthUtil";
import { ACCENT_COLORS } from "@/consts/theme/accentColors";
import { setPrimaryColor } from "@/stores/primaryColorStore";
import { useCommandPaletteToggle } from "./hooks/useCommandPaletteToggle";

import "@mantine/spotlight/styles.css";

export const CommandPalette = () => {
  const navigate = useNavigate();
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  useCommandPaletteToggle();

  const navActions: SpotlightActionData[] = [
    {
      id: "go-dashboard",
      label: "Dashboard",
      description: "Overview and key metrics",
      leftSection: <BarChart3 size={18} />,
      onClick: () => navigate(ROUTE_PATHS.DASHBOARD),
      keywords: ["home", "overview"],
    },
    {
      id: "go-product",
      label: "Products",
      description: "Manage product catalog",
      leftSection: <Package size={18} />,
      onClick: () => navigate(ROUTE_PATHS.PRODUCT),
    },
    {
      id: "go-category",
      label: "Categories",
      description: "Manage product categories",
      leftSection: <Tag size={18} />,
      onClick: () => navigate(ROUTE_PATHS.CATEGORY),
    },
    {
      id: "go-stock",
      label: "Stock",
      description: "Stock transactions and movement",
      leftSection: <Warehouse size={18} />,
      onClick: () => navigate(ROUTE_PATHS.STOCK),
    },
    {
      id: "go-supplier",
      label: "Suppliers",
      description: "Manage supplier list",
      leftSection: <Truck size={18} />,
      onClick: () => navigate(ROUTE_PATHS.SUPPLIERS),
    },
    {
      id: "go-po",
      label: "Purchase Orders",
      description: "View all purchase orders",
      leftSection: <ShoppingCart size={18} />,
      onClick: () => navigate(ROUTE_PATHS.PURCHASE_ORDERS),
    },
    {
      id: "go-po-create",
      label: "Create Purchase Order",
      description: "Open new PO form",
      leftSection: <PlusCircle size={18} />,
      onClick: () => navigate(ROUTE_PATHS.PO_CREATE),
      keywords: ["new", "add"],
    },
    {
      id: "go-report",
      label: "Reports",
      description: "Stock and purchase reports",
      leftSection: <FileText size={18} />,
      onClick: () => navigate(ROUTE_PATHS.REPORT),
    },
  ];

  const themeActions: SpotlightActionData[] = [
    {
      id: "theme-toggle",
      label:
        colorScheme === "dark" ? "Switch to Light mode" : "Switch to Dark mode",
      description: "Toggle color scheme",
      leftSection:
        colorScheme === "dark" ? <Sun size={18} /> : <Moon size={18} />,
      onClick: () => setColorScheme(colorScheme === "dark" ? "light" : "dark"),
      keywords: ["dark", "light", "theme", "mode"],
    },
    ...ACCENT_COLORS.map<SpotlightActionData>((c) => ({
      id: `accent-${c.value}`,
      label: `Accent: ${c.label}`,
      description: "Change accent color",
      leftSection: <Palette size={18} />,
      onClick: () => setPrimaryColor(c.value),
      keywords: ["color", "accent", "primary", c.value],
    })),
  ];

  const accountActions: SpotlightActionData[] = [
    {
      id: "logout",
      label: "Sign out",
      description: "Log out and return to login",
      leftSection: <LogOut size={18} />,
      onClick: () => AuthUtil.logout(),
      keywords: ["logout", "exit"],
    },
  ];

  const actions = [
    { group: "Navigation", actions: navActions },
    { group: "Appearance", actions: themeActions },
    { group: "Account", actions: accountActions },
  ] as unknown as SpotlightActionData[];

  return (
    <Spotlight
      actions={actions}
      nothingFound="No matching commands"
      highlightQuery
      searchProps={{
        leftSection: <Search size={18} />,
        placeholder: "Type a command or search...",
      }}
      scrollable
      radius="md"
    />
  );
};
