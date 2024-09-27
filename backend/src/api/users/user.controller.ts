// HTTPレスポンスとリクエストの処理を記述

import { Request, Response } from "express";
import userService from "./user.service";

export const getUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await userService.getUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "ユーザーが見つかりません" });
    }
  } catch (error) {
    res.status(500).json({ error: "サーバーエラーです" });
  }
};

export default { getUserById };
