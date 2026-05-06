import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import relativeTime from "dayjs/plugin/relativeTime";

// 1. นำเข้า Plug-in ที่มักใช้ในระบบ ERP
dayjs.extend(buddhistEra);
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(relativeTime);

dayjs.locale("en");

type DateInput = string | number | Date | dayjs.Dayjs | null | undefined;

export const formatMmYy = (date: DateInput): string => {
  if (!date) return "";
  return dayjs(date).format("MMM YYYY");
};

/**
 * แปลงวันที่เป็นรูปแบบภาษาอังกฤษ (ค่าเริ่มต้น: "22 Apr 2026")
 */
export const formatDate = (
  date: DateInput,
  format: string = "DD MMM YYYY",
): string => {
  if (!date) return "-";
  return dayjs(date).format(format);
};

/**
 * แปลงวันที่และเวลาเป็นรูปแบบอเมริกาตะวันตก (เช่น "22 April 2026 14:30")
 */
export const formatDateTime = (date: DateInput): string => {
  if (!date) return "-";
  return `${dayjs(date).format("DD MMMM YYYY")} ${dayjs(date).format("HH:mm")}`;
};

/**
 * แสดงความแตกต่างของเวลาแบบ Relative (เช่น "2 hours ago", "5 days ago")
 */
export const formatRelativeTime = (date: DateInput): string => {
  if (!date) return "-";
  return dayjs(date).fromNow();
};

/**
 * ฟังก์ชันสำหรับ Database/API (ได้รูปแบบ "2026-04-22")
 */
export const formatApiDate = (date: DateInput): string => {
  if (!date) return "";
  return dayjs(date).format("YYYY-MM-DD");
};

/**
 * ใช้สำหรับตรวจสอสอบว่าวันที่ถูกต้องหรือไม่
 */
export const isValidDate = (date: DateInput): boolean => {
  if (!date) return false;
  return dayjs(date).isValid();
};

/**
 * ตัด ISO string (หรือ Date) → "YYYY-MM-DD"
 */
export const toIsoDate = (input: DateInput): string => {
  if (!input) return "";
  if (typeof input === "string") return input.slice(0, 10);
  return dayjs(input).format("YYYY-MM-DD");
};

/**
 * ตัด ISO string → "YYYY-MM"
 */
export const toYearMonth = (input: DateInput): string => {
  if (!input) return "";
  if (typeof input === "string") return input.slice(0, 7);
  return dayjs(input).format("YYYY-MM");
};

/**
 * เดือนปัจจุบันในรูปแบบ "YYYY-MM"
 */
export const currentYearMonth = (): string => dayjs().format("YYYY-MM");

/**
 * ช่วงวัน N วันย้อนหลังถึงวันนี้ (รวมวันนี้) → { from: "YYYY-MM-DD", to: "YYYY-MM-DD" }
 */
export const getLastNDaysRange = (
  days: number,
): { from: string; to: string } => {
  const to = dayjs();
  const from = to.subtract(days - 1, "day");
  return { from: from.format("YYYY-MM-DD"), to: to.format("YYYY-MM-DD") };
};

/**
 * Export instance ควบคุมกลางกรณีต้องใช้งาน Dayjs โดยตรงในงานที่ซับซ้อน
 */
export default dayjs;
