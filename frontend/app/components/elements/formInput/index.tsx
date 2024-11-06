import React, { forwardRef } from 'react';
import styles from './index.module.scss';

// React.InputHTMLAttributesから name プロパティを除外して、独自プロパティを追加
interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  label: string;
  name: string;
  // 入力が必須かどうか
  required?: boolean;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, name, type, value, error, onChange, required = false, placeholder, ...props }, ref) => {
    return (
      <div className={styles.form}>
        <label htmlFor={name} className={styles.label}>
          {label}
          {/* 必須項目の場合、印を表示する */}
          {required && <span className={styles.required}>*</span>}
        </label>
        <input
          ref={ref}
          className={styles.input}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          {...props}
        />
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    );
  },
);

FormInput.displayName = 'FormInput';

export default FormInput;
