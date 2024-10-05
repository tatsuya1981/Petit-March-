import { Storage } from '@google-cloud/storage';
import { AppError } from 'middleware/errorHandler';

// 環境変数が存在しているかチェック
if (
  !process.env.GOOGLE_CLOUD_PROJECT_ID ||
  !process.env.GOOGLE_CLOUD_KEYFILE_PATH ||
  !process.env.GOOGLE_CLOUD_STORAGE_BUCKET
) {
  throw new AppError('環境変数がありません', 500);
}
// google cloud storageクライアントを初期化
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE_PATH,
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);

export const uploadImage = (file: Express.Multer.File): Promise<string> => {};
