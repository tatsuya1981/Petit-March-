// データベースの操作、記述とデータ構造の定義を記述
// データベースクエリの操作やテーブルの構造を反映したインターフェースの定義など

import { Review, Prisma } from '@prisma/client';
import prisma from '../../config/database';
import { z } from 'zod';
import { AppError } from 'middleware/errorHandler';

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

// zodスキーマからTypeScriptの型を生成
export type ReviewInput = z.infer<typeof reviewSchema>;

// formatToJapanTime が文字列で返される為、型整合性を合わせる
export type ReviewJapanTime = Omit<Review, 'createdAt' | 'updatedAt' | 'purchaseDate'> & {
  createdAt: string;
  updatedAt: string;
  purchaseDate: string | null;
};

export class ReviewModel {
  // レビュー検索
  getReviewById = async (id: number): Promise<Review | AppError | undefined> => {
    if (isNaN(id)) {
      return new AppError('Invalid ID', 400);
    }
    const review = await prisma.review.findUnique({
      where: { id },
    });
    if (review) {
      return review;
    }
    return undefined;
  };

  // レビューの生成
  createReview = async (reviewData: ReviewInput): Promise<Review | AppError> => {
    const parseReview = await reviewSchema.safeParse(reviewData);
    if (!parseReview.success) {
      return new AppError(parseReview.error.message, 400);
    }
    return await prisma.review.create({
      data: {
        ...reviewData,
        price: reviewData.price ? new Prisma.Decimal(reviewData.price.toString()) : null,
        // ISO-8601形式の日時をDateオブジェクトへ変換
        purchaseDate: reviewData.purchaseDate ? new Date(reviewData.purchaseDate) : null,
      },
    });
  };

  // レビュー更新
  updateReview = async (id: number, reviewData: ReviewInput): Promise<Review | AppError> => {
    if (isNaN(id)) {
      return new AppError('Invalid ID', 400);
    }
    const parseReview = await reviewSchema.safeParse(reviewData);
    if (!parseReview.success) {
      throw new AppError(parseReview.error.message, 400);
    }
    const { rating, title, productName, price, purchaseDate, content } = parseReview.data;
    const review = await prisma.review.update({
      where: { id },
      data: { rating, title, productName, price, purchaseDate, content },
    });
    return review;
  };

  // レビュー削除
  deleteReview = async (id: number) => {
    if (isNaN(id)) {
      return new AppError('Invalid ID', 400);
    }
    return await prisma.review.delete({
      where: { id },
    });
  };
}

export default new ReviewModel();
