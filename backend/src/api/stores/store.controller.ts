import { NextFunction, Request, Response } from "express";
import { AppError } from "../../middleware/errorHandler";
import storeModel, { StoreInput } from "./store.model";

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
) => {
  const storeData: StoreInput = req.body;
  try {
    const store = await storeModel.createStore(storeData);
    res.status(201).json(store);
  } catch (error) {
    next(error);
  }
};
