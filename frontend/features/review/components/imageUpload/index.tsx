import React, { useRef, useState } from 'react';
import styles from './index.module.scss';

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void;
  maxImages?: number;
  maxWidth?: number;
  maxHeight?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesSelected,
  maxImages = 3,
  maxWidth = 1200,
  maxHeight = 1200,
}) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  // useRefで プログラムから input 要素にアクセス出来る様にする
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      // FileRender で画像ファイルの読み込み
      const render = new FileReader();
      // render の読み込み完了後イベントオブジェクトが渡されイベント発火
      render.onload = (e) => {
        const img = new Image();
        // img.src をブラウザが全て読み込み完了後にイベント発火
        img.onload = () => {
          // HTMLの canvas 要素を JavaScript で動的に作成
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // 最大の幅と高さを超えない様にリサイズ
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          // リサイズした width height を canvas の width height に設定
          canvas.width = width;
          canvas.height = height;
          // 2D描写の操作をするオブジェクトを ctx へ格納
          const ctx = canvas.getContext('2d');
          // ctx が null ではなかったら画像を描写
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                // バイナリデータを File へ変換
                const resizeFile = new File([blob], file.name, {
                  // MIME タイプの指定
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                // Promise の resolve でリサイズ後のファイルを返す
                resolve(resizeFile);
              }
            },
            'image/jpeg',
            // 画像の品質設定
            0.7,
          );
        };
        // 読み込みが完了したデータURLを result から取り出し img オブジェクトの src に格納
        img.src = e.target?.result as string;
      };
      // ユーザーの画像ファイルをデータURLへ変換する処理
      render.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: File[]) => {
    // 画像の最大数チェック
    if (files.length > maxImages) {
      alert('最大${maxImages}枚までアップロードできます');
      return;
    }

    // 全画像を一斉にリサイズ処理
    const resizedFiles = await Promise.all(files.map(resizeImage));
    // プレビュー用のURLの配列を生成
    const newPreviewUrls = resizedFiles.map((file) => URL.createObjectURL(file));
    // プレビュー用URLの配列をステートへ格納
    setPreviewUrls(newPreviewUrls);
    // リサイズ後の画像ファイルデータを親コンポーネントへ渡す
    onImagesSelected(resizedFiles);
  };

  // ユーザーがダイアログで画像を選択
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleFiles(files);
  };

  // ドラッグ＆ドロップ機能
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    // ドラッグ時ブラウザでファイルが開くのを無効化
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    // ドロップされたファイルのリストを配列化
    const files = Array.from(event.dataTransfer.files);
    handleFiles(files);
  };

  // ドラッグ＆ドロップエリアをクリックするとダイアログ表示
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.uploadContainer}>
      <div className={styles.dropArea} onDragOver={handleDragOver} onDrop={handleDrop} onClick={triggerFileInput}>
        <p>クリックまたはドラッグ＆ドロップで画像をアップロード</p>
        <p>（最大{maxImages}枚まで）</p>
      </div>
      <input type="file" accept="image/*" multiple onChange={handleFileChange} ref={fileInputRef} />
      <div className={styles.previewContainer}>
        {previewUrls.map((url, index) => (
          <img key={index} src={url} alt={`プレビュー ${index + 1}`} className={styles.previewImage} />
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
