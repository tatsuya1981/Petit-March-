import FormInput from '@/components/elements/formInput';
import styles from './index.module.scss';
import TextArea from '@/components/elements/textArea';

interface ReviewContentProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
}

const ReviewContent: React.FC<ReviewContentProps> = ({ title, setTitle, content, setContent }) => {
  return (
    <div className={styles.container}>
      <FormInput
        label="レビュータイトル"
        name="reviewTitle"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextArea
        label="レビュー内容"
        name="reviewContent"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={6}
      />
    </div>
  );
};

export default ReviewContent;
