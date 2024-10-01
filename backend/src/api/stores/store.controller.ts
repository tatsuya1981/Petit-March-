import { NextFunction, Request, Response } from "express";
import { AppError } from "../../middleware/errorHandler";
import storeModel, { StoreInput, storeSchema } from "./store.model";
import { Prisma, Store } from "@prisma/client";

const isPrismaError = (
  error: unknown
): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError;
};

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
