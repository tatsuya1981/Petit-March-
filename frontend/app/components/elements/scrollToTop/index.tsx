'use client';

import { useEffect, useState } from 'react';
import styles from './index.module.scss';

const ScrollToTop = (): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrolled / (fullHeight - viewportHeight) > 0.6) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    //初期状態チェック
    toggleVisibility();

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const toTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button onClick={toTop} className={styles.scroll} aria-label="Scroll to top">
          PAGE TOP
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
