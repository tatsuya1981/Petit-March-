'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface AuthSuccessData {
  token: string;
  userId: string;
  name: string;
  email: string;
}

export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // クライアントサイドであるかどうかを示す状態変数
  const [isClient, setIsClient] = useState(false);
  // ユーザーが認証されているかどうかを管理
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // トークンをローカルストレージから取得し存在すればユーザー認証管理をtrueへ変更する共通関数
  const updateAuthState = useCallback(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    }
  }, []);

  // クライアントサイドでのみ実行されるようにする
  useEffect(() => {
    setIsClient(true);
    updateAuthState();
  }, [updateAuthState]);
  // 認証状態の変更を検知したら呼び出されるコールバック関数
  useEffect(() => {
    const handleStorageChange = () => {
      updateAuthState();
    };
    // イベントリスナーでイベント発生時、handleStorageChange関数で認証状態を更新
    window.addEventListener('storage', handleStorageChange);
    // authStateChangeはカスタムイベント
    window.addEventListener('authStateChange', handleStorageChange);

    return () => {
      // アンマウント時にイベントリスナーを削除するクリーンアップ関数
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChange', handleStorageChange);
    };
  }, [updateAuthState]);

  // 認証状態変更を通知するヘルパー関数
  const notifyAuthStateChange = useCallback(() => {
    // カスタムイベントをディスパッチ
    window.dispatchEvent(new Event('authStateChange'));
  }, []);

  const handleAuthSuccess = useCallback(
    async (data: AuthSuccessData) => {
      if (typeof window !== 'undefined') {
        console.log('Saving auth data:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('name', data.name);
        localStorage.setItem('email', data.email);
        setIsAuthenticated(true);
        // 認証状態の変更を通知
        notifyAuthStateChange();
      }
    },
    [notifyAuthStateChange],
  );

  const logout = useCallback(async () => {
    // ログアウト処理中へ状態変更
    setIsLoading(true);
    try {
      // クライアントサイドのチェック
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/log-out`,
            // 空のリクエストボディ
            {},
            {
              // バックエンド側でログアウトリクエスト認証を受け付ける特に使用される
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
        }
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
        setIsAuthenticated(false);
        // ログアウト時も認証状態の変更を通知
        notifyAuthStateChange();
        setIsLoading(false);
        router.push('/');
      }
    }
  }, [router, notifyAuthStateChange]);

  // 認証状態のチェック
  const checkAuth = useCallback(() => {
    // サーバーサイドでは未認証とする
    if (!isClient) return false;
    return isAuthenticated;
  }, [isClient, isAuthenticated]);

  return {
    logout,
    isAuthenticated: checkAuth,
    isLoading,
    handleAuthSuccess,
  };
};
