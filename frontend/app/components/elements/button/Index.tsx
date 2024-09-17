import React, { ReactNode } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';

type variant = 'base' | 'main' | 'edit' | 'delete';
interface ButtonProps {
  variant: variant | variant[];
  children?: ReactNode;
  className?: string;
  [key: string]: any;
}

const Button = ({ variant = 'base', children, className, ...props }: ButtonProps) => {
  const variantClass = Array.isArray(variant) ? variant.map((v) => styles[v]) : [styles[variant]];

  const buttonClassName = classNames(...variantClass, className);
  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
