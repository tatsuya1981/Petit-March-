import { Request, Response, NextFunction } from "express";
import authService, { UserValidationError } from "./auth.service";

// バリデーションの検証
export const validateUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.validateUser(req.body);
    next();
  } catch (error) {
    if (error instanceof UserValidationError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({
        error: "バリデーション中にエラーが発生しました！",
        details: error instanceof Error ? error.message : "不明なエラーです",
      });
    }
  }
};
