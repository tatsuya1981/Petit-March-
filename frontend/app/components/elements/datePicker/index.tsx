import React from 'react';
import styles from './index.module.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  label: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  required?: boolean;
}

const DatePick: React.FC<DatePickerProps> = ({ label, selected, onChange, required = false }) => {
  return (
    <div className={styles.container}>
      <label>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <DatePicker
        id="purchaseDate"
        selected={selected}
        onChange={onChange}
        dateFormat="yyyy/MM/dd"
        maxDate={new Date()} // 未来の日付は選択できない様にする
        isClearable // 日付をクリアできるオプション
        placeholderText="購入日を選択"
        required={required}
        className={styles.date}
      />
    </div>
  );
};

export default DatePick;
