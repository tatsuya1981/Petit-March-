// HTTPレスポンスとリクエストの処理を記述

import { AppError } from "../../middleware/errorHandler";
import userModel from "./user.model";
import { Request, Response } from "express";

export const createUser = async (req: Request, res: Response) => {
  const { name, email, generation, gender, passwordDigest } = req.body;
  const newUser = await userModel.createUser({
    name,
    email,
    generation,
    gender,
    passwordDigest,
  });
  res.status(201).json(newUser);
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  const user = await userModel.getUserById(userId);
  if (!user) {
    throw new AppError("ユーザーが見つかりません", 404);
  }
  res.json(user);
};
