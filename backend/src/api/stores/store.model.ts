import { Store } from "@prisma/client";
import prisma from "../../config/database";

export interface StoreInput {
  brandId: number;
  name: string;
  latitude: number;
  longitude: number;
  prefecture: string;
  city: string;
  streetAddress1: string;
  streetAddress2: string;
  zip: string;
}

export class StoreModel {
  // バリデーション
  validateData = (data: StoreInput): string[] => {
    const errors: string[] = [];
    if (isNaN(data.brandId)) errors.push("IDは数値である必要があります");
    if (data.name && data.name.length > 0 && data.name.length <= 255)
      errors.push("店舗名は１文字以上２５５字以内でなくてはなりません");
    if (data.latitude && data.latitude < -90 && data.latitude < 90)
      return errors;
  };

  // ストア情報の作成
  createStore = async (storeData: StoreInput): Promise<Store> => {
    return prisma.store.create({
      data: storeData,
    });
  };

  // ストア情報の取得
  getStore = async (id: number): Promise<Store | null> => {
    return prisma.store.findUnique({
      where: { id },
    });
  };
}

export default new StoreModel();
