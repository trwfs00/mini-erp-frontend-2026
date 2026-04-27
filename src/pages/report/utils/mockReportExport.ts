// TODO: ลบไฟล์นี้เมื่อ integrate API จริง — backend จะ return blob ตรง ๆ ผ่าน ReportService.exportXxx
import { ExportUtil } from "@/utils/ExportUtil";
import type { StockSummaryReport } from "@/types/report/StockSummary";
import type { StockMovementReport } from "@/types/report/StockMovementReport";
import type { PurchaseSummaryReport } from "@/types/report/PurchaseSummary";

const buildStockSummaryCsv = (report: StockSummaryReport): Blob => {
  const headers = [
    "SKU",
    "Name",
    "Unit",
    "Current Stock",
    "Min Stock",
    "Cost Price",
    "Selling Price",
    "Cost Value",
    "Selling Value",
    "Low Stock",
  ];
  const rows = report.rows.map((r) => [
    r.sku,
    r.name,
    r.unit,
    r.current_stock,
    r.min_stock,
    r.cost_price,
    r.selling_price,
    r.cost_value,
    r.selling_value,
    r.is_low_stock ? "YES" : "",
  ]);
  return ExportUtil.buildCsvBlob(headers, rows);
};

const buildStockMovementCsv = (report: StockMovementReport): Blob => {
  const headers = [
    "Transaction ID",
    "Date",
    "Product",
    "Type",
    "Quantity",
    "Balance After",
    "Note",
    "By",
  ];
  const rows = report.rows.map((r) => [
    r.transaction_id,
    r.created_at,
    r.product_name,
    r.type,
    r.quantity,
    r.balance_after,
    r.note ?? r.reason ?? "",
    r.created_by_name,
  ]);
  return ExportUtil.buildCsvBlob(headers, rows);
};

const buildPurchaseSummaryCsv = (report: PurchaseSummaryReport): Blob => {
  const headers = [
    "PO ID",
    "Supplier",
    "Status",
    "Items",
    "Total Amount",
    "Created At",
    "Created By",
  ];
  const rows = report.rows.map((r) => [
    r.purchase_order_id,
    r.supplier_name,
    r.status,
    r.item_count,
    r.total_amount,
    r.created_at,
    r.created_by_name,
  ]);
  return ExportUtil.buildCsvBlob(headers, rows);
};

export const MockReportExportUtil = {
  exportStockSummary: buildStockSummaryCsv,
  exportStockMovement: buildStockMovementCsv,
  exportPurchaseSummary: buildPurchaseSummaryCsv,
};
