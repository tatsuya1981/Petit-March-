import { Request, Response } from "express";
import reviewService from "../services/reviewService";

export const createReview = async (req: Request, res: Response) => {
  const reviewData = req.body;
  try {
    const newReview = await reviewService.createReview(reviewData);
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: "レビューの作成に失敗しました" });
  }
};
