import React, { forwardRef } from 'react';
import styles from './index.module.scss';

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'name'> {
  label: string;
  name: string;
  options: Option[];
  // 入力が必須かどうか
  required?: boolean;
  error?: string;
}

interface Option {
  value: string;
  label: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, name, options, error, className, required = false, ...props }, ref) => {
    return (
      <div className={styles.form}>
        <label>
          {label}
          {/* 必須項目の場合、印を表示する */}
          {required && <span className={styles.required}>*</span>}
        </label>
        <select
          ref={ref}
          className={`${styles.select} ${error ? styles.selectError : ''} ${className || ''}`}
          id={name}
          name={name}
          aria-invalid={!!error}
          {...props}
        >
          {/* 選択肢を生成 */}
          <option value="">選択してください</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className={styles.errorMessage} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;
