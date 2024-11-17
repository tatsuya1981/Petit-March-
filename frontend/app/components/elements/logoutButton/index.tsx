'use client';

import { useState } from 'react';
import styles from './index.module.scss';
import { useAuth } from '../../../../hooks/useAuth';

interface LogoutButtonProps {
  // 追加のクラス名を受け取り外部からスタイルを変更できるようにする
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  // カスタムフックを使用
  const { logout } = useAuth();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // カスタムフックのログアウト機能を実行
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      // isLoadingがtrueの場合、ボタンを無効化
      disabled={isLoading}
      // プロップスでclassNameが渡された場合、logoutButtonスタイルと一緒に適用
      className={`${styles.logoutButton} ${className || ''}`}
      type="button"
    >
      {isLoading ? 'ログアウト中・・・' : 'ログアウト'}
    </button>
  );
}
