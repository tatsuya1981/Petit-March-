import { Request, Response, NextFunction } from "express";
import reviewService from "./review.service";
import { ReviewValidationError } from "./review.service";

// バリデーションの検証
export const validateReviewMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await reviewService.ValidateReview(req.body);
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
