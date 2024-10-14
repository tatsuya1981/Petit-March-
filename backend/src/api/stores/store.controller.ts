import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../middleware/errorHandler';
import storeModel, { StoreInput } from './store.model';
import { Store } from '@prisma/client';

// ストア情報獲得
export const get = async (req: Request, res: Response, next: NextFunction) => {
  const storeId = parseInt(req.params.id);
  try {
    const store = await storeModel.getStore(storeId);
    if (!store) {
      return next(new AppError('not found store', 404));
    }
    res.status(200).json(store);
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

// ストア情報作成
export const create = async (req: Request, res: Response, next: NextFunction): Promise<Store | void> => {
  const storeData: StoreInput = req.body;
  try {
    const store = await storeModel.createStore(storeData);
    res.status(201).json(store);
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

// ストア情報更新
export const update = async (req: Request, res: Response, next: NextFunction): Promise<Store | void> => {
  const storeId = parseInt(req.params.id);
  const storeData: StoreInput = req.body;
  try {
    const store = await storeModel.updateStore(storeId, storeData);
    res.status(200).json(store);
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

// ストア情報削除
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<StoreInput | void> => {
  const storeId = await parseInt(req.params.id);
  try {
    const store = await storeModel.deleteStore(storeId);
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};
