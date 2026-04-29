import { LoginPage } from "@/pages";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardPage } from "@/pages/dashboard";
import { ProductsPage } from "@/pages/product";
import { CategoryPage } from "@/pages/category";
import { StockPage } from "@/pages/stock";
import { SupplierPage } from "@/pages/supplier";
import { PurchaseOrderPage } from "@/pages/purchase-order";
import { PurchaseOrderCreatePage } from "@/pages/purchase-order/components/PurchaseOrderCreate";
import { PurchaseOrderDetailPage } from "@/pages/purchase-order/components/PurchaseOrderDetail";
import { ReportPage } from "@/pages/report";
import { StockSummaryReportPage } from "@/pages/report/components/StockSummaryReport";
import { StockMovementReportPage } from "@/pages/report/components/StockMovementReport";
import { PurchaseSummaryReportPage } from "@/pages/report/components/PurchaseSummaryReport";
import { PublicLayout } from "@/components/Layouts/Public";
import { AuthLayout } from "@/components/Layouts/Auth";
import { RoleGuard } from "@/components/Layouts/RoleGuard";
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
        element: (
          <RoleGuard mode="single" permissionCode="dashboard">
            <DashboardPage />
          </RoleGuard>
        ),
      },
      {
        path: ROUTE_PATHS.PRODUCT,
        element: (
          <RoleGuard mode="single" permissionCode="product">
            <ProductsPage />
          </RoleGuard>
        ),
      },
      {
        path: ROUTE_PATHS.CATEGORY,
        element: (
          <RoleGuard mode="single" permissionCode="category">
            <CategoryPage />
          </RoleGuard>
        ),
      },
      {
        path: ROUTE_PATHS.STOCK,
        element: (
          <RoleGuard mode="single" permissionCode="stock">
            <StockPage />
          </RoleGuard>
        ),
      },
      {
        path: ROUTE_PATHS.SUPPLIERS,
        element: (
          <RoleGuard mode="single" permissionCode="supplier">
            <SupplierPage />
          </RoleGuard>
        ),
      },
      {
        path: ROUTE_PATHS.PURCHASE_ORDERS,
        children: [
          {
            index: true,
            element: (
              <RoleGuard mode="single" permissionCode="purchase_order">
                <PurchaseOrderPage />
              </RoleGuard>
            ),
          },
          {
            path: "create",
            element: (
              <RoleGuard
                mode="single"
                permissionCode="purchase_order"
                actionCode={["create"]}
              >
                <PurchaseOrderCreatePage />
              </RoleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <RoleGuard mode="single" permissionCode="purchase_order">
                <PurchaseOrderDetailPage />
              </RoleGuard>
            ),
          },
        ],
      },
      {
        path: ROUTE_PATHS.REPORT,
        element: (
          <RoleGuard mode="single" permissionCode="report">
            <ReportPage />
          </RoleGuard>
        ),
        children: [
          {
            index: true,
            element: <Navigate to={ROUTE_PATHS.REPORT_STOCK_SUMMARY} replace />,
          },
          {
            path: "stock-summary",
            element: <StockSummaryReportPage />,
          },
          {
            path: "stock-movement",
            element: <StockMovementReportPage />,
          },
          {
            path: "purchase-summary",
            element: <PurchaseSummaryReportPage />,
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
