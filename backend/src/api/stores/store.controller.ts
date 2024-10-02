import { NextFunction, Request, Response } from "express";
import { AppError } from "../../middleware/errorHandler";
import storeModel, { StoreInput, storeSchema } from "./store.model";
import { Store } from "@prisma/client";
import { isPrismaError } from "../../utils/isPrismaError";

// ストア情報獲得
export const get = async (req: Request, res: Response, next: NextFunction) => {
  const storeId = parseInt(req.params.id);
  if (isNaN(storeId)) {
    return next(new AppError("無効なＩＤです", 400));
  }

  try {
    const store = await storeModel.getStore(storeId);
    if (!store) {
      return next(new AppError("ストア情報が見つかりません", 404));
    }
    res.status(200).json(store);
  } catch (error) {
    next(error);
  }
};

// ストア情報作成
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Store | void> => {
  const parseStore = await storeSchema.safeParse(req.body);
  if (!parseStore.success) {
    return next(new AppError(parseStore.error.message, 400));
  }
  const storeData: StoreInput = parseStore.data;
  try {
    const store = await storeModel.createStore(storeData);
    res.status(201).json(store);
  } catch (error) {
    next(error);
  }
};

// ストア情報更新
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Store | void> => {
  const storeId = await parseInt(req.params.id);
  if (isNaN(storeId)) {
    return next(new AppError("無効なＩＤです", 400));
  }
  const parseStore = await storeSchema.safeParse(req.body);
  if (!parseStore.success) {
    return next(new AppError(parseStore.error.message, 400));
  }
  const storeData: StoreInput = parseStore.data;
  try {
    const store = await storeModel.updateStore(storeId, storeData);
    res.status(200).json(store);
  } catch (error: unknown) {
    if (isPrismaError(error)) {
      if (error.code === "P2025") {
        return next(new AppError("ストア情報が見つかりません", 404));
      }
    }
    next(error);
  }
};

// ストア情報削除
export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<StoreInput | void> => {
  const storeId = await parseInt(req.params.id);
  if (isNaN(storeId)) {
    return next(new AppError("無効なＩＤです", 400));
  }
  try {
    const store = await storeModel.deleteStore(storeId);
    res.status(204).send();
  } catch (error: unknown) {
    if (isPrismaError(error)) {
      if (error.code === "P2025") {
        return next(new AppError("ストア情報が見つかりません", 404));
      }
    }
    next(error);
  }
};
