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

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <Link href="/" className={styles.logoLink}>
            <Image src={petitMarche} alt="当サイトのロゴ" className={styles.logo} width={100} height={100} priority />
          </Link>
        </div>
        <nav className={styles.nav}>
          {isAuthenticated() ? (
            <>
              <span className={styles.userName}> {userName}さん </span>
              <LogoutButton className={styles.logoutButton} />
            </>
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
