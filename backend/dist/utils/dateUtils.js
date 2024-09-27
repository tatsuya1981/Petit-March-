"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentJapanTime = exports.formatToJapanTime = void 0;
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
const TOKYO_TIMEZONE = "Asia/Tokyo";
// タイムゾーンを東京時刻へ
const formatToJapanTime = (date) => {
    const tokyoDate = (0, date_fns_tz_1.toZonedTime)(date, TOKYO_TIMEZONE);
    return (0, date_fns_1.format)(tokyoDate, "yyyy/MM/dd HH:mm:ss");
};
exports.formatToJapanTime = formatToJapanTime;
const getCurrentJapanTime = () => {
    const now = new Date();
    const tokyoDate = (0, date_fns_tz_1.toZonedTime)(now, TOKYO_TIMEZONE);
    return (0, date_fns_1.format)(tokyoDate, "yyyy/MM/dd HH:mm:ss");
};
exports.getCurrentJapanTime = getCurrentJapanTime;
