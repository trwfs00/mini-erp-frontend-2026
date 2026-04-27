import type { RequestTable } from "@/types/api/RequestTable";
import type { TransactionType } from "@/types/stock/StockTransaction";

export type GetStockListRequest = RequestTable<{
  search?: string;
  product_id?: string;
  type?: TransactionType;
  start_date?: string;
  end_date?: string;
}>;

export type CreateStockTransactionRequest = {
  product_id: string;
  type: TransactionType;
  quantity: number;
  note?: string;
  reason?: string;
};
