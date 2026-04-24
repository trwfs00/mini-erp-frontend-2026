import type { ApiReturn } from "@/types/api/ApiReturn";
import { AxiosUtil } from "@/utils/AxiosUtil";
import { $mockMode } from "@/stores/debugModeStore";
import { ProductService } from "../ProductService";
import { StockService } from "../StockService";
import { PurchaseOrderService } from "../PurchaseOrderService";
import type { GetDashboardStatsResponse } from "./types/DashboardResponse";
import type { DashboardStats } from "@/types/dashboard/DashboardStats";
import type { StockMovementDailyPoint } from "@/types/report/StockMovementReport";
import type { PurchaseTrendPoint } from "@/types/report/PurchaseSummary";
import { toIsoDate, toYearMonth } from "@/utils/DateUtil";
import { FETCH_ALL_ARGS } from "@/consts/api/fetchAllArgs";
import { MOCK_DELAY_MS } from "@/consts/api/mockDelay";

const computeStockMovementDaily = async (
  fromDate: string,
  toDate: string,
): Promise<{ daily: StockMovementDailyPoint[] }> => {
  const res = await StockService.getTransactionList(FETCH_ALL_ARGS);
  const txs = res.ok && res.data ? res.data.data : [];

  const from = new Date(fromDate).getTime();
  const to = new Date(toDate).getTime() + 24 * 60 * 60 * 1000 - 1;
  const inRange = txs.filter((t) => {
    const ts = new Date(t.created_at).getTime();
    return ts >= from && ts <= to;
  });

  const dailyMap = new Map<string, StockMovementDailyPoint>();
  for (const t of inRange) {
    const date = toIsoDate(t.created_at);
    const point = dailyMap.get(date) ?? { date, in: 0, out: 0, adjust: 0 };
    if (t.type === "IN") point.in += t.quantity;
    else if (t.type === "OUT") point.out += t.quantity;
    else point.adjust += t.quantity;
    dailyMap.set(date, point);
  }
  return { daily: Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date)) };
};

const computePurchaseTrend = async (months: number): Promise<PurchaseTrendPoint[]> => {
  const res = await PurchaseOrderService.getPurchaseOrderList(FETCH_ALL_ARGS);
  const pos = res.ok && res.data ? res.data.data : [];

  const now = new Date();
  const buckets: PurchaseTrendPoint[] = [];
  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.push({ month: key, total_amount: 0, order_count: 0 });
  }

  const index = new Map(buckets.map((b) => [b.month, b]));
  for (const p of pos) {
    const bucket = index.get(toYearMonth(p.created_at));
    if (!bucket) continue;
    bucket.total_amount += p.total_amount;
    bucket.order_count += 1;
  }

  return buckets;
};

const computeDashboardStats = async (): Promise<DashboardStats> => {
  const now = new Date();
  const fourteenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 13);

  const [productRes, poRes, movement, purchase_trend] = await Promise.all([
    ProductService.getProductList(FETCH_ALL_ARGS),
    PurchaseOrderService.getPurchaseOrderList(FETCH_ALL_ARGS),
    computeStockMovementDaily(toIsoDate(fourteenDaysAgo.toISOString()), toIsoDate(now.toISOString())),
    computePurchaseTrend(6),
  ]);

  const products = productRes.ok && productRes.data ? productRes.data.data : [];
  const pos = poRes.ok && poRes.data ? poRes.data.data : [];

  const totals = products.reduce(
    (acc, p) => ({
      total_products: acc.total_products + 1,
      total_stock_value: acc.total_stock_value + p.cost_price * p.current_stock,
      total_selling_value: acc.total_selling_value + p.selling_price * p.current_stock,
      low_stock_count: acc.low_stock_count + (p.current_stock <= p.min_stock ? 1 : 0),
    }),
    { total_products: 0, total_stock_value: 0, total_selling_value: 0, low_stock_count: 0 },
  );

  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const pending_po_count = pos.filter((p) => p.status === "DRAFT" || p.status === "CONFIRMED").length;
  const received_po_this_month = pos.filter(
    (p) => p.status === "RECEIVED" && toYearMonth(p.created_at) === thisMonth,
  ).length;

  const low_stock_products = products
    .filter((p) => p.current_stock <= p.min_stock)
    .map((p) => ({
      product_id: p.product_id,
      sku: p.sku,
      name: p.name,
      current_stock: p.current_stock,
      min_stock: p.min_stock,
      unit: p.unit,
    }));

  return {
    summary: {
      total_products: totals.total_products,
      total_stock_value: totals.total_stock_value,
      total_selling_value: totals.total_selling_value,
      low_stock_count: totals.low_stock_count,
      pending_po_count,
      received_po_this_month,
    },
    stock_movement: movement.daily,
    purchase_trend,
    low_stock_products,
  };
};

export class DashboardService {
  static async getDashboardStats(): Promise<ApiReturn<GetDashboardStatsResponse>> {
    const isDebug = $mockMode.get();

    if (isDebug) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          console.log("[Mock] Fetching dashboard stats");
          const data = await computeDashboardStats();
          resolve({ ok: true, data });
        }, MOCK_DELAY_MS);
      });
    }

    return AxiosUtil.createRequest<GetDashboardStatsResponse>({
      url: "/dashboard/stats",
      method: "GET",
    });
  }
}
