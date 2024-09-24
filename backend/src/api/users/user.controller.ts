// HTTPレスポンスとリクエストの処理を記述

import { Request, Response } from "express";
import userService from "./user.service";

export const createUser = async (req: Request, res: Response) => {
  const { name, email, generation, gender, passwordDigest } = req.body;
  try {
    const newUser = await userService.createUser({
      name,
      email,
      generation,
      gender,
      passwordDigest,
    });
    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "予期せぬエラーが発生しました" });
    }
  }
};

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

export default { createUser, getUserById };
