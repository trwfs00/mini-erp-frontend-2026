export type StockSummaryRow = {
  product_id: string;
  sku: string;
  name: string;
  unit: string;
  current_stock: number;
  min_stock: number;
  cost_price: number;
  selling_price: number;
  cost_value: number;
  selling_value: number;
  is_low_stock: boolean;
};

export type StockSummaryTotals = {
  total_products: number;
  total_cost_value: number;
  total_selling_value: number;
  low_stock_count: number;
};

export type StockSummaryReport = {
  rows: StockSummaryRow[];
  totals: StockSummaryTotals;
};
