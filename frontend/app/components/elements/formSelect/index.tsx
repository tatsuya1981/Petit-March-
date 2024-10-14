import React from 'react';
import styles from './index.module.scss';

interface FormSelectProps {
  label: string;
  name: string;
  options: Option[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  // 入力が必須かどうか
  required?: boolean;
}

interface Option {
  value: string;
  label: string;
}

const FormSelect: React.FC<FormSelectProps> = ({ label, name, options, value, onChange, required = false }) => {
  return (
    <div className={styles.form}>
      <label>
        {label}
        {/* 必須項目の場合、印を表示する */}
        {required && <span className={styles.required}>*</span>}
      </label>
      <select className={styles.select} id={name} name={name} value={value} onChange={onChange} required={required}>
        {/* 選択肢を生成 */}
        <option value="">選択してください</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
