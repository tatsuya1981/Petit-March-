import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const TOKYO_TIMEZONE = "Asia/Tokyo";

// タイムゾーンを東京時刻へ
export const formatToJapanTime = (date: Date): string => {
  const tokyoDate = toZonedTime(date, TOKYO_TIMEZONE);
  return format(tokyoDate, "yyyy/MM/dd HH:mm:ss");
};

export const getCurrentJapanTime = (): string => {
  const now = new Date();
  const tokyoDate = toZonedTime(now, TOKYO_TIMEZONE);
  return format(tokyoDate, "yyyy/MM/dd HH:mm:ss");
};
