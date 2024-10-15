import React from 'react';
import styles from './index.module.scss';

interface TextAreaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  // 入力が必須かどうか
  required?: boolean;
  placeholder?: string;
  rows?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  placeholder,
  rows = 5,
}) => {
  return (
    <div className={styles.container}>
      <label>
        {label}
        {/* 必須項目の場合、印を表示する */}
        {required && <span className={styles.required}>*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required
        className={styles.textForm}
        rows={rows}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextArea;
