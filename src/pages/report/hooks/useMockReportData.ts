// TODO: ลบไฟล์นี้เมื่อ integrate API จริง

import { FETCH_ALL_ARGS } from "@/consts/api/fetchAllArgs";
import { toIsoDate, toYearMonth } from "@/utils/DateUtil";
import { useMockProductData } from "@/pages/product/hooks/useMockProductData";
import { useMockStockData } from "@/pages/stock/hooks/useMockStockData";
import { useMockPurchaseOrderData } from "@/pages/purchase-order/hooks/useMockPurchaseOrderData";
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

type Range = { from: string; to: string };
type MonthParams = { month: string };

export const useMockReportData = () => {
  const { getMockProductList } = useMockProductData();
  const { getMockTransactionList } = useMockStockData();
  const { getMockPurchaseOrderList } = useMockPurchaseOrderData();

  const getMockStockSummaryReport = async (): Promise<StockSummaryReport> => {
    const res = await getMockProductList(FETCH_ALL_ARGS);
    const products = res.data.data;

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
      {
        total_products: 0,
        total_cost_value: 0,
        total_selling_value: 0,
        low_stock_count: 0,
      },
    );

    return { rows, totals };
  };

  const getMockStockMovementReport = async (
    range: Range,
  ): Promise<StockMovementReport> => {
    const res = await getMockTransactionList(FETCH_ALL_ARGS);
    const txs = res.data.data;

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
    const daily = Array.from(dailyMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    );

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

  const getMockPurchaseSummaryReport = async ({
    month,
  }: MonthParams): Promise<PurchaseSummaryReport> => {
    const res = await getMockPurchaseOrderList(FETCH_ALL_ARGS);
    const pos = res.data.data;

    const filtered = pos.filter((p) => toYearMonth(p.created_at) === month);

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

    return { month, rows, totals };
  };

  return {
    getMockStockSummaryReport,
    getMockStockMovementReport,
    getMockPurchaseSummaryReport,
  };
};
