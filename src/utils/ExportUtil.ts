import type { ExportFormat } from "@/services/ReportService/types/ReportRequest";

const MIME: Record<ExportFormat, string> = {
  csv: "text/csv;charset=utf-8;",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const ExportUtil = {
  downloadBlob,
  mimeFor: (format: ExportFormat) => MIME[format],
};
