import type { TransactionType } from "@/types/stock/StockTransaction";

export type StockMovementRow = {
  transaction_id: string;
  product_id: string;
  product_name: string;
  type: TransactionType;
  quantity: number;
  balance_after: number;
  note?: string;
  reason?: string;
  created_at: string;
  created_by_name: string;
};

export type StockMovementDailyPoint = {
  date: string;
  in: number;
  out: number;
  adjust: number;
};

export type StockMovementReport = {
  rows: StockMovementRow[];
  daily: StockMovementDailyPoint[];
  totals: {
    total_in: number;
    total_out: number;
    total_adjust: number;
  };
};
