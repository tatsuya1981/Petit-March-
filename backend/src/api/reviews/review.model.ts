// データベースの操作、記述とデータ構造の定義を記述
// データベースクエリの操作やテーブルの構造を反映したインターフェースの定義など

import { Review, Prisma } from '@prisma/client';
import prisma from '../../config/database';
import { z } from 'zod';
import { formatToJapanTime } from '../../utils/dateUtils';

// zodライブラリを使用してプロパティの型や制約を定義
export const reviewSchema = z.object({
  userId: z.number().int().positive(),
  productId: z.number().int().positive(),
  brandId: z.number().int().positive(),
  storeId: z.number().int().positive().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(255),
  productName: z.string().min(1).max(255),
  price: z.number().positive().optional(),
  purchaseDate: z.date().optional(),
  content: z.string().min(1).max(2000),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

// 文字列で返される formatToJapanTime の為に型整合性を合わせる型定義
export type ReviewJapanTime = Omit<Review, 'createdAt' | 'updatedAt' | 'purchaseDate'> & {
  createdAt: string;
  updatedAt: string;
  purchaseDate: string | null;
};

export class ReviewModel {
  // レビュー関連の日付を日本時間へ変更するロジック
  private convertToJapanTime = (review: Review): ReviewJapanTime => {
    return {
      ...review,
      createdAt: formatToJapanTime(review.createdAt),
      updatedAt: formatToJapanTime(review.updatedAt),
      purchaseDate: review.purchaseDate ? formatToJapanTime(review.purchaseDate) : null,
    };
  };

  // レビューの生成
  createReview = async (reviewData: ReviewInput) => {
    return await prisma.review.create({
      data: {
        ...reviewData,
        price: reviewData.price ? new Prisma.Decimal(reviewData.price.toString()) : null,
        // ISO-8601形式の日時をDateオブジェクトへ変換
        purchaseDate: reviewData.purchaseDate ? new Date(reviewData.purchaseDate) : null,
      },
    });
  };

  // レビュー検索
  getReviewById = async (id: number): Promise<ReviewJapanTime | undefined> => {
    const review = await prisma.review.findUnique({
      where: { id },
    });
    if (review) {
      return this.convertToJapanTime(review);
    }
    return undefined;
  };

  // レビュー更新
  updateReview = async (id: number, reviewData: ReviewInput) => {
    const { rating, title, productName, price, purchaseDate, content } = reviewData;
    const review = await prisma.review.update({
      where: { id },
      data: { rating, title, productName, price, purchaseDate, content },
    });
    return this.convertToJapanTime(review);
  };

  // レビュー削除
  deleteReview = async (id: number) => {
    return await prisma.review.delete({
      where: { id },
    });
  };
}

export default new ReviewModel();
