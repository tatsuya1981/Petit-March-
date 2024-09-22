// HTTPレスポンスとリクエストの処理を記述

import userModel from "./user.model";
import { Request, Response } from "express";

export const getUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await userModel.getUserByModel(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "ユーザーが見つかりません" });
    }
  } catch (error) {
    res.status(500).json({ error: "サーバーエラーです" });
  }
};

export default getUserById;
