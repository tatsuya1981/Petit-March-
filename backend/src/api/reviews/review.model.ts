// データベースの操作と記述とデータ構造の定義を記述
// データベースクエリの操作やテーブルの構造を反映したインターフェースの定義など

import { Review as PrismaReview } from "@prisma/client";
import prisma from "../config/database";

export type Review = PrismaReview;

// レビューの生成
const createReview = async (data: Review): Promise<Review> => {
  return await prisma.review.create({
    data: {
      ...data,
      price: data.price ? parseFloat(data.price.toFixed(2)) : null,
    },
  });
};

export default { createReview };
