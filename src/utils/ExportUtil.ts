import type { ExportFormat } from "@/services/ReportService/types/ReportRequest";

export type ExportFile = {
  blob: Blob;
  filename: string;
};

const MIME: Record<ExportFormat, string> = {
  csv: "text/csv;charset=utf-8;",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

const escapeCsvCell = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes("\"") || str.includes("\n")) {
    return `"${str.replace(/"/g, "\"\"")}"`;
  }
  return str;
};

/**
 * Build a CSV blob from header + rows. Used only for mock/dev export.
 * Production backend returns the blob directly.
 */
export const buildCsvBlob = (headers: string[], rows: (string | number)[][]): Blob => {
  const lines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
  ];
  return new Blob(["﻿" + lines.join("\n")], { type: MIME.csv });
};

/**
 * Trigger a browser download for a blob. Works in all evergreen browsers.
 */
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
  buildCsvBlob,
  downloadBlob,
  mimeFor: (format: ExportFormat) => MIME[format],
};
