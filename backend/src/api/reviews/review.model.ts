// データベースの操作、記述とデータ構造の定義を記述
// データベースクエリの操作やテーブルの構造を反映したインターフェースの定義など

import { Review, Prisma } from "@prisma/client";
import prisma from "../../config/database";

export type { Review };

// バリデーション作成
export class ReviewValidationError extends Error {
  constructor(public errors: string[]) {
    super("Validation failed");
    this.name = "ReviewValidationError";
  }
}

export class ReviewModel {
  ValidateData = (data: Review): string[] => {
    const errors: string[] = [];

    if (!data.userId) errors.push("ユーザーIDは必須です");
    if (!data.productId) errors.push("商品IDは必須です");
    if (!data.brandId) errors.push("コンビニブランドは必須です");
    if (data.rating < 1 || data.rating > 5)
      errors.push("評価は１から５の間でなくてはなりません");
    if (!data.title) errors.push("タイトルは必須です");
    if (!data.productName) errors.push("商品名は必須です");
    if (!data.content) errors.push("レビューは必須です");

    return errors;
  };

  ValidateReview = async (data: Review) => {
    const errors = this.ValidateData(data);
    if (errors.length > 0) {
      throw new ReviewValidationError(errors);
    }
  };

  // レビューの生成
  createReview = async (data: Prisma.ReviewCreateInput): Promise<Review> => {
    return await prisma.review.create({
      data: {
        ...data,
        price: data.price ? new Prisma.Decimal(data.price.toString()) : null,
        // ISO-8601形式の日時をDateオブジェクトへ変換
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
      },
    });
  };
}

export default new ReviewModel();
