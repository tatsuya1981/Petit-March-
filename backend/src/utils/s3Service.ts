import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BUCKET_NAME, s3Client } from '../config/s3Client';
import { v4 } from 'uuid';

class S3Service {
  static getSignedS3Url = async (url: string): Promise<string> => {
    try {
      // URLからキーを抽出
      const key = this.extractKeyFromUrl(url);
      console.log('Extracted key:', key); // デバッグログ

      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600, // 1時間
      });

      return signedUrl;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      return url; // エラー時は元のURLを返す
    }
  };

  // URLからS3のキーを抽出するヘルパー関数
  private static extractKeyFromUrl(url: string): string {
    try {
      if (url.includes('amazonaws.com')) {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        return pathParts.slice(1).join('/');
      }
      return url;
    } catch (error) {
      console.error('Error extracting key from URL:', error);
      throw new Error('Invalid S3 URL format');
    }
  }

  static uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
    try {
      // ファイル名から特殊文字を除去
      const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '');
      const key = `reviews/${v4()}-${sanitizedFileName}`;

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'private',
      });

      await s3Client.send(command);

      // キーを返すように変更（フルURLではなく）
      return key;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw new Error('Failed to upload file to S3');
    }
  };

  static deleteS3Object = async (imageUrl: string): Promise<void> => {
    try {
      const key = this.extractKeyFromUrl(imageUrl);

      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      await s3Client.send(command);
      console.log(`Successfully deleted object from S3: ${key}`);
    } catch (error) {
      console.error('Error deleting from S3:', error);
      throw new Error(`Failed to delete object from S3: ${imageUrl}`);
    }
  };
}

export default S3Service;
