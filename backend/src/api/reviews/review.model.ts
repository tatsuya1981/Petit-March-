// データベースの操作、記述とデータ構造の定義を記述
// データベースクエリの操作やテーブルの構造を反映したインターフェースの定義など

import { Review, Prisma } from "@prisma/client";
import prisma from "../config/database";

export type { Review };

// レビューの生成
const createReview = async (
  data: Prisma.ReviewCreateInput
): Promise<Review> => {
  return await prisma.review.create({
    data: {
      ...data,
      price: data.price ? new Prisma.Decimal(data.price.toString()) : null,
      // ISO-8601形式の日時をDateオブジェクトへ変換
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
    },
  });
};

export default { createReview };
