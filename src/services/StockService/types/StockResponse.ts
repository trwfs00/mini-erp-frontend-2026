import type { ResponseTable } from "@/types/api/ResponseTable";
import type {
  StockTransaction,
  StockSummary,
} from "@/types/stock/StockTransaction";

export type GetStockListResponse = ResponseTable<StockTransaction>;

export type StockSummaryResponse = StockSummary;
