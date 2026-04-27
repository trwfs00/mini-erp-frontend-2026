export type StockMovementRangeRequest = {
  from: string;
  to: string;
};

export type PurchaseSummaryMonthRequest = {
  month: string;
};

export type ExportFormat = "csv" | "xlsx";

export type ExportRequest = {
  format: ExportFormat;
};

export type StockMovementExportRequest = StockMovementRangeRequest & ExportRequest;

export type PurchaseSummaryExportRequest = PurchaseSummaryMonthRequest & ExportRequest;
