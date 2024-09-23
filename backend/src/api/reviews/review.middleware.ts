import { Request, Response, NextFunction } from "express";
import Validate from "./review.service";
import { ValidationError } from "./review.service";

// バリデーションの検証
export const validateReviewMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Validate.ValidateReview(req.body);
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res
        .status(500)
        .json({
          error: "バリデーション中にエラーが発生しました！",
          details: error instanceof Error ? error.message : "不明なエラー",
        });
    }
  }
};
