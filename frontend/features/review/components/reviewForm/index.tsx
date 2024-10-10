import * as z from 'zod';

const schema = z.object({
  category: z.string().min(1, 'カテゴリーを選択してください'),
  productName: z.string().min(1, '商品名を入力してください').max(255, '商品名は２５５字以内です'),
  price: z.string().min(0, '０円以上で入力してください').optional(),
  purchaseDate: z.string().optional(),
  brand: z.string().min(1, 'コンビニブランドを選択してください'),
  title: z.string().min(1, 'レビュータイトルを入力してください').max(255, 'レビュータイトルは２５５字以内です'),
  content: z.string().min(1, 'レビュー内容を入力してください').max(2000, 'レビュー内容は２０００字以内です'),
});
