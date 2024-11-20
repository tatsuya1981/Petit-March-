'use client';

import styles from './index.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import petitMarche from '@/images/PetitMarche.svg';
import { useAuth } from '@/../../hooks/useAuth';
import { useEffect, useState } from 'react';
import LogoutButton from '@/components/elements/logoutButton';

const Header = () => {
  const { isAuthenticated } = useAuth();
  const [userName, setUserName] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setMounted(true);

    const initializeAuth = () => {
      const isAuth = isAuthenticated();
      setIsAuthed(isAuth);
      if (isAuth) {
        const storedName = localStorage.getItem('name');
        console.log('Stored name:', storedName);
        if (storedName) {
          setUserName(storedName);
        }
      }
    };
    initializeAuth();

    // 認証状態の変更を監視
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      setIsAuthed(isAuth);

      if (isAuth) {
        const currentName = localStorage.getItem('name');
        console.log('Current name:', currentName);
        if (currentName) {
          setUserName(currentName);
        } else {
          setUserName('');
        }
      }
    };

    // イベントリスナーを設定
    window.addEventListener('storage', checkAuth);
    // カスタムイベントを設定
    window.addEventListener('authStateChange', checkAuth);

    // クリーンアップ
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authStateChange', checkAuth);
    };
  }, [isAuthenticated]);

  if (!mounted) {
    return null;
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <Link href="/" className={styles.logoLink}>
            <Image src={petitMarche} alt="当サイトのロゴ" className={styles.logo} width={100} height={100} priority />
          </Link>
        </div>
        <nav className={styles.nav}>
          {isAuthed ? (
            <div className={styles.loginContainer}>
              <span className={styles.userName}> {userName}さん </span>
              <LogoutButton className={styles.logoutButton} />
            </div>
          ) : (
            <>
              <Link href="/sign-up" className={styles.link}>
                新規登録
              </Link>
              <Link href="" className={styles.link}>
                ログイン
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
