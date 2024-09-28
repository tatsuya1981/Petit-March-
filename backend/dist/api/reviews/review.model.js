"use strict";
// データベースの操作、記述とデータ構造の定義を記述
// データベースクエリの操作やテーブルの構造を反映したインターフェースの定義など
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../config/database"));
// レビューの生成
const createReview = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.review.create({
        data: Object.assign(Object.assign({}, data), { price: data.price ? new client_1.Prisma.Decimal(data.price.toString()) : null, 
            // ISO-8601形式の日時をDateオブジェクトへ変換
            purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null }),
    });
});
exports.default = { createReview };
