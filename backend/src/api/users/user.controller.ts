import userService from "./user.service";
import { Request, Response } from "express";

export const getUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await userService.getUserId(userId);
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
