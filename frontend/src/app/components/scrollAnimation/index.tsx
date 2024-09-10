'use client';

import { useAnimation, useInView, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface Props {
  children: React.ReactNode;
}

const ScrollComponent: React.FC<Props> = ({ children }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.1,
  });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, x: 0 },
        hidden: { opacity: 0, x: 100 },
      }}
      transition={{ duration: 1.0 }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollComponent;
