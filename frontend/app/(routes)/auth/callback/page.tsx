'use client';

import styles from './page.module.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const name = searchParams.get('name');

    if (token) {
      // トークンをローカルストレージに保存
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId || '');
      localStorage.setItem('email', email || '');
      localStorage.setItem('name', name || '');

      // ユーザーを指定ページにリダイレクト
      router.push('/reviews');
    } else {
      // エラーの場合はログインページにリダイレクト
      router.push('/login?error=auth_failed');
    }
  }, [router, searchParams]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>認証中・・・</h1>
        <p className={styles.message}>しばらくお待ちください</p>
        <div className={styles.loadingSpinner} />
      </div>
    </div>
  );
}
