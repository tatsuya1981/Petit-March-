import { Request, Response, NextFunction } from "express";
import reviewModel, { ReviewValidationError } from "./review.model";

// バリデーションの検証
export const validateReviewMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await reviewModel.ValidateReview(req.body);
    next();
  } catch (error) {
    if (error instanceof ReviewValidationError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({
        error: "バリデーション中にエラーが発生しました！",
        details: error instanceof Error ? error.message : "不明なエラーです",
      });
    }
  }
};
