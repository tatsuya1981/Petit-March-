import React, { ReactNode } from 'react';
import styles from './index.module.scss';

interface ButtonProps {
  variant: string;
  Children?: ReactNode;
  [key: string]: any;
}

const Button = ({ variant = 'base', children, ...props }: ButtonProps) => {
  const className = styles[variant];
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;
