// HTTPレスポンスとリクエストの処理を記述

import { Request, Response } from "express";
import reviewModel from "./review.model";

export const createReview = async (req: Request, res: Response) => {
  console.log("Received review data:", req.body);
  const reviewData = req.body;
  try {
    const newReview = await reviewModel.createReview(reviewData);
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      error: "レビューの作成に失敗しました",
      details: error instanceof Error ? error.message : "不明なエラー",
    });
  }
};
