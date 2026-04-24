import { LoginPage } from "@/pages";
import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardPage from "@/pages/dashboard";
import ProductsPage from "@/pages/product";
import CategoryPage from "@/pages/category";
import StockPage from "@/pages/stock";
import SupplierPage from "@/pages/supplier";
import PurchaseOrderPage from "@/pages/purchase-order";
import PurchaseOrderCreatePage from "@/pages/purchase-order/components/PurchaseOrderCreate";
import PurchaseOrderDetailPage from "@/pages/purchase-order/components/PurchaseOrderDetail";
import ReportPage from "@/pages/report";
import StockSummaryReportPage from "@/pages/report/components/StockSummaryReport";
import StockMovementReportPage from "@/pages/report/components/StockMovementReport";
import PurchaseSummaryReportPage from "@/pages/report/components/PurchaseSummaryReport";
import { PublicLayout } from "@/components/Layouts/Public";
import { AuthLayout } from "@/components/Layouts/Auth";
import { ROUTE_PATHS } from "./routePaths";

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
      {
        path: ROUTE_PATHS.DASHBOARD,
        element: <DashboardPage />,
        handle: { crumb: "Dashboard" },
      },
      {
        path: ROUTE_PATHS.PRODUCT,
        element: <ProductsPage />,
        handle: { crumb: "Products" },
      },
      {
        path: ROUTE_PATHS.CATEGORY,
        element: <CategoryPage />,
        handle: { crumb: "Category" },
      },
      {
        path: ROUTE_PATHS.STOCK,
        element: <StockPage />,
        handle: { crumb: "Stock" },
      },
      {
        path: ROUTE_PATHS.SUPPLIERS,
        element: <SupplierPage />,
        handle: { crumb: "Suppliers" },
      },
      {
        path: ROUTE_PATHS.PURCHASE_ORDERS,
        handle: { crumb: "Purchase Orders" },
        children: [
          { index: true, element: <PurchaseOrderPage /> },
          {
            path: "create",
            element: <PurchaseOrderCreatePage />,
            handle: { crumb: "Create" },
          },
          {
            path: ":id",
            element: <PurchaseOrderDetailPage />,
            handle: { crumb: "Detail" },
          },
        ],
      },
      {
        path: ROUTE_PATHS.REPORT,
        element: <ReportPage />,
        handle: { crumb: "Report" },
        children: [
          {
            index: true,
            element: <Navigate to={ROUTE_PATHS.REPORT_STOCK_SUMMARY} replace />,
          },
          {
            path: "stock-summary",
            element: <StockSummaryReportPage />,
            handle: { crumb: "Stock Summary" },
          },
          {
            path: "stock-movement",
            element: <StockMovementReportPage />,
            handle: { crumb: "Stock Movement" },
          },
          {
            path: "purchase-summary",
            element: <PurchaseSummaryReportPage />,
            handle: { crumb: "Purchase Summary" },
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to={ROUTE_PATHS.DASHBOARD} replace />,
      },
    ],
  },
]);
