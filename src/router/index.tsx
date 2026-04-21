import { LoginPage } from "@/pages";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { PublicLayout } from "@/components/layouts/public";
import { AuthLayout } from "@/components/layouts/auth";
import DashboardPage from "@/pages/dashboard";
import ProductsPage from "@/pages/products";
import CategoryPage from "@/pages/category";
import StockPage from "@/pages/stock";
import SupplierPage from "@/pages/supplier";
import PurchaseOrderPage from "@/pages/purchase-order";
import ReportPage from "@/pages/report";
import { ROUTE_PATHS } from "./route-paths";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: ROUTE_PATHS.DASHBOARD, element: <DashboardPage /> },
      { path: ROUTE_PATHS.PRODUCTS, element: <ProductsPage /> },
      { path: ROUTE_PATHS.CATEGORY, element: <CategoryPage /> },
      { path: ROUTE_PATHS.STOCK, element: <StockPage /> },
      { path: ROUTE_PATHS.SUPPLIERS, element: <SupplierPage /> },
      { path: ROUTE_PATHS.PURCHASE_ORDERS, element: <PurchaseOrderPage /> },
      { path: ROUTE_PATHS.REPORT, element: <ReportPage /> },
      {
        path: "*",
        element: <Navigate to={ROUTE_PATHS.DASHBOARD} replace />,
      },
    ],
  },
]);
