import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BUCKET_NAME, s3Client } from '../config/s3Client';
import { v4 } from 'uuid';

class S3Service {
  // プライベートファイルへ一時的にアクセスする関数
  static getSignedS3Url = async (key: string): Promise<string> => {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    // 署名付きURLを生成して文字列として返す
    try {
      return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  };

  static uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
    // ユニークなファイル名を生成
    const key = `reviews/${v4()}-${file.originalname}`;

    // S3へアップロードするためのデータ
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'private',
    });
    try {
      // S3へファイルをアップロード
      await s3Client.send(command);
      // アップロードしたファイルのURLを返す
      return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw new Error('Failed to upload file');
    }
  };

  // S3から画像データを削除する関数
  static deleteS3Object = async (imageUrl: string): Promise<void> => {
    // URLをスラッシュで分割して配列にする処理
    const urlParts = imageUrl.split('/');
    // URLを分割した配列から４番目の要素から最後までの要素を取得して再度スラッシュで結合
    const key = urlParts.slice(3).join('/');

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    try {
      await s3Client.send(command);
      console.log(`Successfully deleted object from S3: ${key}`);
    } catch (error) {
      throw new Error(`Failed to delete object from S3: ${key}`);
    }
  };
}

export default S3Service;
