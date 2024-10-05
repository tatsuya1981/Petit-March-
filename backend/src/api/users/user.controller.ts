// HTTPレスポンスとリクエストの処理を記述

import { User } from '@prisma/client';
import { AppError } from '../../middleware/errorHandler';
import userModel, { UserInput, userSchema } from './user.model';
import { NextFunction, Request, Response } from 'express';
import { isPrismaError } from '../../utils/isPrismaError';

// ユーザー情報獲得
export const get = async (req: Request, res: Response, next: NextFunction) => {
  const userId = parseInt(req.params.id, 10);
  const user = await userModel.getUserById(userId);
  try {
    if (user === undefined) {
      throw new AppError('ユーザーが見つかりません', 404);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// ユーザー情報作成
export const create = async (req: Request, res: Response, next: NextFunction): Promise<User | void> => {
  // zodによるバリデーション検証
  const parseUser = await userSchema.safeParse(req.body);
  if (!parseUser.success) {
    return next(new AppError(parseUser.error.message, 400));
  }
  const { name, email, generation, gender, passwordDigest } = parseUser.data;
  // ユーザーデータのユニーク判定
  const isUnique = await userModel.uniqueness(name, email);
  if (!isUnique) {
    return next(new AppError('名前・メールアドレスはすでに使用されています', 400));
  }
  const newUser = await userModel.createUser({
    name,
    email,
    generation,
    gender,
    passwordDigest,
  });
  res.status(201).json(newUser);
};

// ユーザー情報更新
export const update = async (req: Request, res: Response, next: NextFunction): Promise<User | void> => {
  const userId = await parseInt(req.params.id);
  if (isNaN(userId)) {
    return next(new AppError('無効なＩＤです', 400));
  }
  // zodによるバリデーション検証
  const parseUser = await userSchema.safeParse(req.body);
  if (!parseUser.success) {
    return next(new AppError(parseUser.error.message, 400));
  }
  const userData: UserInput = parseUser.data;
  const { email } = parseUser.data;
  // メールのユニーク判定
  const isUnique = await userModel.uniqueness(email);
  if (!isUnique) {
    return next(new AppError('メールアドレスはすでに使用されています', 400));
  }
  try {
    const store = await userModel.updateUser(userId, userData);
    res.status(200).json(store);
  } catch (error: unknown) {
    if (isPrismaError(error)) {
      if (error.code === 'P2025') {
        return next(new AppError('ユーザー情報が見つかりません', 404));
      }
    }
    next(error);
  }
};

// ユーザー情報削除
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<UserInput | void> => {
  const userId = await parseInt(req.params.id);
  if (isNaN(userId)) {
    return next(new AppError('無効なＩＤです', 400));
  }
  try {
    await userModel.deleteUser(userId);
    res.status(204).send();
  } catch (error: unknown) {
    if (isPrismaError(error)) {
      if (error.code === 'P2025') {
        return next(new AppError('ユーザー情報が見つかりません', 404));
      }
    }
    next(error);
  }
};
