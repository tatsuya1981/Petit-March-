import React from 'react';
import styles from './index.module.scss';

interface FormInputProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // 入力が必須かどうか
  required?: boolean;
  placeholder?: string;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, name, type, value, onChange, required = false, placeholder }) => {
  return (
    <div className={styles.form}>
      <label>
        {label}
        {/* 必須項目の場合、印を表示する */}
        {required && <span className={styles.required}>*</span>}
      </label>
      <input
        className={styles.input}
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
};

export default FormInput;
