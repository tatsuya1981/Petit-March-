// HTTPレスポンスとリクエストの処理を記述

import { Request, Response } from "express";
import authService from "./auth.service";

export const createUser = async (req: Request, res: Response) => {
  const { name, email, generation, gender, passwordDigest } = req.body;
  try {
    const newUser = await authService.createUser({
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

export default { createUser };
