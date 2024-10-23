import * as z from 'zod';

// 共通の定数
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

// 画像のバリデーション
const ImageSchema = z.object({
  order: z.number().int().min(0),
  isMain: z.boolean(),
  // Fileの型検証
  size: z.number().max(MAX_FILE_SIZE, 'ファイルは５ＭＢ以下にしてください'),
  type: z.enum(ALLOWED_IMAGE_TYPES, {
    errorMap: () => ({ message: 'JPG、PNG、またはWEBP形式の画像をアップロードしてください' }),
  }),
  file: z.instanceof(File),
});

// 店舗情報のバリデーション
const StoreLocationSchema = z.object({
  name: z.string().min(1, '店舗名は必須です').max(255, '店舗名は２５５字以内です'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  prefecture: z.string().min(1, '都道府県は必須です'),
  city: z.string().min(1, '市区町村は必須です'),
  streetAddress1: z.string().min(1, '住所は必須です'),
  streetAddress2: z.string().optional(),
  zip: z.string().regex(/^\d{3}-?\d{4}$/, '正しい郵便番号形式で入力してください'),
});

// レビューフォームのバリデーション
export const ReviewFormSchema = z.object({
  rating: z.number().int().min(1, '評価を選択してください').max(5, '評価は５以下である必要があります'),
  productId: z.number().int().positive('商品カテゴリーを選択してください'),
  productName: z.string().min(1, '商品名は必須です').max(255, '商品名は２５５字以内です'),
  price: z
    .number()
    .positive('価格は0円以上で入力してください')
    .max(9999999.99, '価格が上限を超えました')
    .transform((val) => Number(val.toFixed(2)))
    .optional()
    .nullable(),
  purchaseDate: z.date().max(new Date(), '購入日は今日以前の日付を選択してください').optional().nullable(),
  brandId: z.number().int().positive('コンビニブランドを選択してください'),
  title: z.string().min(1, 'レビュータイトルは必須です').max(255, 'レビュータイトルは２５５字以内です'),
  content: z.string().min(1, 'レビュー内容を入力してください').max(2000, 'レビュー内容は２０００字以内です'),
  images: z.array(ImageSchema).max(3, '画像は３枚までアップロードできます'),
  // 既存店舗の選択
  storeId: z.number().int().positive().optional(),
  // 新規店舗の選択
  newStore: StoreLocationSchema.optional(),
});
