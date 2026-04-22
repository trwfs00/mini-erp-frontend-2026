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

// 2. ตั้งค่า Locale เริ่มต้นเป็นภาษาไทย
dayjs.locale("en");

type DateInput = string | number | Date | dayjs.Dayjs | null | undefined;

/**
 * แปลงวันที่เป็นรูปแบบภาษาไทย (ค่าเริ่มต้น: "22 เม.ย. 2569")
 */
export const formatDate = (
  date: DateInput,
  format: string = "DD MMM BBBB",
): string => {
  if (!date) return "-";
  return dayjs(date).format(format);
};

/**
 * แปลงวันที่และเวลาเป็นรูปแบบอเมริกาตะวันตกฐานเวลาไทย (เช่น "22 เมษายน 2569 เวลา 14:30 น.")
 */
export const formatDateTime = (date: DateInput): string => {
  if (!date) return "-";
  return `${dayjs(date).format("DD MMMM BBBB")} เวลา ${dayjs(date).format("HH:mm")} น.`;
};

/**
 * แสดงความแตกต่างของเวลาแบบ Relative (เช่น "2 ชั่วโมงที่แล้ว", "อีก 5 วัน")
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
 * Export instance ควบคุมกลางกรณีต้องใช้งาน Dayjs โดยตรงในงานที่ซับซ้อน
 */
export default dayjs;
