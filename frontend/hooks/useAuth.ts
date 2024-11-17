'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // クライアントサイドでのみ実行されるようにする
  useEffect(() => {
    setIsClient(true);
  }, []);

  const logout = useCallback(async () => {
    // ログアウト処理中へ状態変更
    setIsLoading(true);
    try {
      // クライアントサイドのチェック
      if (typeof window !== 'undefined') {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/log-out`,
          // 空のリクエストボディ
          {},
          {
            // バックエンド側でログアウトリクエスト認証を受け付ける特に使用される
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Logout error:', error.response?.data?.message || 'ログアウトに失敗しました');
      } else {
        console.error('Unexpected error', error);
      }
    } finally {
      // クライアントサイドのチェック
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        setIsLoading(false);
        router.push('/sign-up');
      }
    }
  }, [router]);

  const isAuthenticated = useCallback(() => {
    // サーバーサイドでは未認証とする
    if (!isClient) return false;
    return !!localStorage.getItem('token');
  }, []);

  return {
    logout,
    isAuthenticated,
    isLoading,
  };
};
