import type { ApiReturn } from "@/types/api/ApiReturn";
import { AxiosUtil } from "@/utils/AxiosUtil";
import { $debugMode } from "@/stores/debugModeStore";
import { ProductService } from "../ProductService";
import { StockService } from "../StockService";
import { PurchaseOrderService } from "../PurchaseOrderService";
import { ExportUtil } from "@/utils/ExportUtil";
import { toIsoDate, toYearMonth } from "@/utils/DateUtil";
import { FETCH_ALL_ARGS } from "@/consts/api/fetchAllArgs";
import { MOCK_DELAY_MS } from "@/consts/api/mockDelay";
import type {
  GetStockSummaryResponse,
  GetStockMovementResponse,
  GetPurchaseSummaryResponse,
} from "./types/ReportResponse";
import type {
  StockMovementRangeRequest,
  PurchaseSummaryMonthRequest,
  StockMovementExportRequest,
  PurchaseSummaryExportRequest,
} from "./types/ReportRequest";
import type {
  StockSummaryReport,
  StockSummaryRow,
} from "@/types/report/StockSummary";
import type {
  StockMovementReport,
  StockMovementRow,
  StockMovementDailyPoint,
} from "@/types/report/StockMovementReport";
import type {
  PurchaseSummaryReport,
  PurchaseSummaryRow,
} from "@/types/report/PurchaseSummary";
import type { PurchaseOrderStatus } from "@/types/purchase-order/PurchaseOrder";

const computeStockSummary = async (): Promise<StockSummaryReport> => {
  const res = await ProductService.getProductList(FETCH_ALL_ARGS);
  const products = res.ok && res.data ? res.data.data : [];

  const rows: StockSummaryRow[] = products.map((p) => ({
    product_id: p.product_id,
    sku: p.sku,
    name: p.name,
    unit: p.unit,
    current_stock: p.current_stock,
    min_stock: p.min_stock,
    cost_price: p.cost_price,
    selling_price: p.selling_price,
    cost_value: p.cost_price * p.current_stock,
    selling_value: p.selling_price * p.current_stock,
    is_low_stock: p.current_stock <= p.min_stock,
  }));

  const totals = rows.reduce(
    (acc, r) => ({
      total_products: acc.total_products + 1,
      total_cost_value: acc.total_cost_value + r.cost_value,
      total_selling_value: acc.total_selling_value + r.selling_value,
      low_stock_count: acc.low_stock_count + (r.is_low_stock ? 1 : 0),
    }),
    { total_products: 0, total_cost_value: 0, total_selling_value: 0, low_stock_count: 0 },
  );

  return { rows, totals };
};

const computeStockMovement = async (
  range: StockMovementRangeRequest,
): Promise<StockMovementReport> => {
  const res = await StockService.getTransactionList(FETCH_ALL_ARGS);
  const txs = res.ok && res.data ? res.data.data : [];

  const from = new Date(range.from).getTime();
  const to = new Date(range.to).getTime() + 24 * 60 * 60 * 1000 - 1;
  const inRange = txs.filter((t) => {
    const ts = new Date(t.created_at).getTime();
    return ts >= from && ts <= to;
  });

  const rows: StockMovementRow[] = inRange.map((t) => ({
    transaction_id: t.transaction_id,
    product_id: t.product_id,
    product_name: t.product_name,
    type: t.type,
    quantity: t.quantity,
    balance_after: t.balance_after,
    note: t.note,
    reason: t.reason,
    created_at: t.created_at,
    created_by_name: t.created_by_name,
  }));

  const dailyMap = new Map<string, StockMovementDailyPoint>();
  for (const r of rows) {
    const date = toIsoDate(r.created_at);
    const point = dailyMap.get(date) ?? { date, in: 0, out: 0, adjust: 0 };
    if (r.type === "IN") point.in += r.quantity;
    else if (r.type === "OUT") point.out += r.quantity;
    else point.adjust += r.quantity;
    dailyMap.set(date, point);
  }
  const daily = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  const totals = rows.reduce(
    (acc, r) => ({
      total_in: acc.total_in + (r.type === "IN" ? r.quantity : 0),
      total_out: acc.total_out + (r.type === "OUT" ? r.quantity : 0),
      total_adjust: acc.total_adjust + (r.type === "ADJUST" ? r.quantity : 0),
    }),
    { total_in: 0, total_out: 0, total_adjust: 0 },
  );

  return { rows, daily, totals };
};

const computePurchaseSummary = async (
  req: PurchaseSummaryMonthRequest,
): Promise<PurchaseSummaryReport> => {
  const res = await PurchaseOrderService.getPurchaseOrderList(FETCH_ALL_ARGS);
  const pos = res.ok && res.data ? res.data.data : [];

  const filtered = pos.filter((p) => toYearMonth(p.created_at) === req.month);

  const rows: PurchaseSummaryRow[] = filtered.map((p) => ({
    purchase_order_id: p.purchase_order_id,
    supplier_name: p.supplier_name,
    status: p.status,
    item_count: p.item_count,
    total_amount: p.total_amount,
    created_at: p.created_at,
    created_by_name: p.created_by_name,
  }));

  const by_status: Record<PurchaseOrderStatus, number> = {
    DRAFT: 0,
    CONFIRMED: 0,
    RECEIVED: 0,
    CANCELLED: 0,
  };
  for (const r of rows) by_status[r.status] += 1;

  const totals = {
    total_orders: rows.length,
    total_amount: rows.reduce((s, r) => s + r.total_amount, 0),
    by_status,
  };

  return { month: req.month, rows, totals };
};

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
  const headers = ["Transaction ID", "Date", "Product", "Type", "Quantity", "Balance After", "Note", "By"];
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
  const headers = ["PO ID", "Supplier", "Status", "Items", "Total Amount", "Created At", "Created By"];
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

export class ReportService {
  static async getStockSummary(): Promise<ApiReturn<GetStockSummaryResponse>> {
    const isDebug = $debugMode.get();

    if (isDebug) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          console.log("[Mock] Fetching stock summary");
          const data = await computeStockSummary();
          resolve({ ok: true, data });
        }, MOCK_DELAY_MS);
      });
    }

    return AxiosUtil.createRequest<GetStockSummaryResponse>({
      url: "/reports/stock-summary",
      method: "GET",
    });
  }

  static async getStockMovement(
    request: StockMovementRangeRequest,
  ): Promise<ApiReturn<GetStockMovementResponse>> {
    const isDebug = $debugMode.get();

    if (isDebug) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          console.log("[Mock] Fetching stock movement:", request);
          const data = await computeStockMovement(request);
          resolve({ ok: true, data });
        }, MOCK_DELAY_MS);
      });
    }

    return AxiosUtil.createRequest<GetStockMovementResponse>({
      url: "/reports/stock-movements",
      method: "GET",
      params: request,
    });
  }

  static async getPurchaseSummary(
    request: PurchaseSummaryMonthRequest,
  ): Promise<ApiReturn<GetPurchaseSummaryResponse>> {
    const isDebug = $debugMode.get();

    if (isDebug) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          console.log("[Mock] Fetching purchase summary:", request);
          const data = await computePurchaseSummary(request);
          resolve({ ok: true, data });
        }, MOCK_DELAY_MS);
      });
    }

    return AxiosUtil.createRequest<GetPurchaseSummaryResponse>({
      url: "/reports/purchase-summary",
      method: "GET",
      params: request,
    });
  }

  static async exportStockSummary(): Promise<ApiReturn<Blob>> {
    const isDebug = $debugMode.get();

    if (isDebug) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          console.log("[Mock] Exporting stock summary (CSV)");
          const data = await computeStockSummary();
          resolve({ ok: true, data: buildStockSummaryCsv(data) });
        }, MOCK_DELAY_MS);
      });
    }

    return AxiosUtil.createRequest<Blob>({
      url: "/reports/stock-summary/export",
      method: "GET",
      params: { format: "csv" },
      responseType: "blob",
    });
  }

  static async exportStockMovement(
    request: StockMovementExportRequest,
  ): Promise<ApiReturn<Blob>> {
    const isDebug = $debugMode.get();

    if (isDebug) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          console.log("[Mock] Exporting stock movement:", request);
          const data = await computeStockMovement(request);
          resolve({ ok: true, data: buildStockMovementCsv(data) });
        }, MOCK_DELAY_MS);
      });
    }

    return AxiosUtil.createRequest<Blob>({
      url: "/reports/stock-movements/export",
      method: "GET",
      params: request,
      responseType: "blob",
    });
  }

  static async exportPurchaseSummary(
    request: PurchaseSummaryExportRequest,
  ): Promise<ApiReturn<Blob>> {
    const isDebug = $debugMode.get();

    if (isDebug) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          console.log("[Mock] Exporting purchase summary:", request);
          const data = await computePurchaseSummary(request);
          resolve({ ok: true, data: buildPurchaseSummaryCsv(data) });
        }, MOCK_DELAY_MS);
      });
    }

    return AxiosUtil.createRequest<Blob>({
      url: "/reports/purchase-summary/export",
      method: "GET",
      params: request,
      responseType: "blob",
    });
  }
}
