// HTTPレスポンスとリクエストの処理を記述

import { Request, Response } from "express";
import reviewModel from "./review.model";

export const createReview = async (req: Request, res: Response) => {
  const reviewData = req.body;
  const newReview = await reviewModel.createReview(reviewData);
  res.status(201).json(newReview);
};
