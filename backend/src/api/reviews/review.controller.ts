// HTTPレスポンスとリクエストの処理を記述

import { Request, Response, NextFunction } from 'express';
import reviewModel, { reviewSchema } from './review.model';
import { Review } from '@prisma/client';
import { AppError } from '../../middleware/errorHandler';

// レビュー作成
export const create = async (req: Request, res: Response, next: NextFunction): Promise<Review | void> => {
  const parseReview = await reviewSchema.safeParse(req.body);
  if (!parseReview.success) {
    return next(new AppError(parseReview.error.message, 400));
  }
  const reviewData = parseReview.data;
  try {
    const newReview = await reviewModel.createReview(reviewData);
    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
};

// レビュー獲得
export const get = async (req: Request, res: Response, next: NextFunction) => {
  const reviewId = await parseInt(req.params.id, 10);
  const review = await reviewModel.getReviewById(reviewId);
  try {
    if (!review) {
      throw new AppError('レビューが見つかりません', 400);
    }
    res.json(review);
  } catch (error) {
    next(error);
  }
};

// レビュー更新
export const update = async (req: Request, res: Response, next: NextFunction) => {
  const reviewId = await parseInt(req.params.id, 10);
  const parseReview = await reviewSchema.safeParse(req.body);
  if (!parseReview.success) {
    throw new AppError(parseReview.error.message, 400);
  }
  const review = parseReview.data;
  try {
    const updateReview = await reviewModel.updateReview(reviewId, review);
    res.json(updateReview);
  } catch (error) {
    next(error);
  }
};

// レビュー削除
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  const reviewId = await parseInt(req.params.id);
  try {
    await reviewModel.deleteReview(reviewId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
