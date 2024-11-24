'use client';

import React, { forwardRef } from 'react';
import styles from './index.module.scss';

// React.InputHTMLAttributesから name プロパティを除外して、独自プロパティとして追加
interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  label: string;
  name: string;
  // 入力が必須かどうか
  required?: boolean;
  error?: string;
}
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  // refを渡し親コンポーネントからアクセスできるようにする
  ({ label, name, error, className, required = false, ...props }, ref) => {
    return (
      <div className={styles.form}>
        <label htmlFor={name} className={styles.label}>
          {label}
          {/* 必須項目の場合、印を表示する */}
          {required && <span className={styles.required}>*</span>}
        </label>
        <input
          ref={ref}
          className={`${styles.input} ${error ? styles.inputError : ''} ${className || ''}`}
          id={name}
          name={name}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <p className={styles.errorMessage} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

// React開発者ツールでコンポーネントの名前が匿名になるのを防止
FormInput.displayName = 'FormInput';

export default FormInput;
