import { Store } from "@prisma/client";
import prisma from "../../config/database";
import { z } from "zod";

// zodライブラリを使用してプロパティの型や制約を定義
export const storeSchema = z.object({
  brandId: z.number().int().positive(),
  name: z.string().min(1).max(255),
  latitude: z.number().min(1).max(255),
  longitude: z.number().min(-180).max(180),
  prefecture: z.string().min(1),
  city: z.string().min(1),
  streetAddress1: z.string().min(1),
  streetAddress2: z.string().optional(),
  zip: z
    .string()
    .regex(/^\d{3}-\d{4}$/, "郵便番号は123-4567の形式である必要があります"),
});

// zodスキーマからTypeScriptの型を生成
export type StoreInput = z.infer<typeof storeSchema>;

export class StoreModel {
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

  // ストア情報の更新
  updateStore = async (id: number, storeData: StoreInput): Promise<Store> => {
    return prisma.store.update({
      where: { id },
      data: storeData,
    });
  };

  // ストア情報の削除
  deleteStore = async (id: number): Promise<Store> => {
    return prisma.store.delete({
      where: { id },
    });
  };
}

export default new StoreModel();
