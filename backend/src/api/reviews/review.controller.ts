// HTTPレスポンスとリクエストの処理を記述

import { Request, Response, NextFunction } from 'express';
import reviewModel, { ReviewJapanTime } from './review.model';
import { AppError } from '../../middleware/errorHandler';

// レビュー獲得
export const get = async (req: Request, res: Response, next: NextFunction): Promise<ReviewJapanTime | void> => {
  const reviewId = await parseInt(req.params.id, 10);
  try {
    const review = await reviewModel.getReviewById(reviewId);
    if (!review) {
      throw new AppError('not found review', 400);
    }
    res.json(review);
  } catch (error) {
    next(error);
  }
};

// レビュー作成
export const create = async (req: Request, res: Response, next: NextFunction): Promise<ReviewJapanTime | void> => {
  const reviewData = req.body;
  try {
    const newReview = await reviewModel.createReview(reviewData);
    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
};

// レビュー更新
export const update = async (req: Request, res: Response, next: NextFunction): Promise<ReviewJapanTime | void> => {
  const reviewId = await parseInt(req.params.id, 10);
  const review = req.body;
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
