export type TransactionType = "IN" | "OUT" | "ADJUST";

export type StockTransaction = {
  transaction_id: string;
  product_id: string;
  product_name: string;
  type: TransactionType;
  quantity: number;
  balance_after: number;
  note?: string;
  reason?: string; // Mandatory for ADJUST
  created_at: string;
  created_by_name: string;
};

export type StockSummary = {
  product_id: string;
  current_stock: number;
  min_stock: number;
  is_low_stock: boolean;
};
