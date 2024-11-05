import styles from './index.module.scss';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import FormInput from '@/components/elements/formInput';

const signUpSchema = z
  .object({
    name: z.string().min(1, '名前を入力してください').max(50, 'ユーザー名は５０文字以内です'),
    email: z.string().min(1, 'メールアドレスを入力してください').email('正しいメールアドレスを入力してください'),
    generation: z.number().optional(),
    gender: z.string().optional(),
    password: z.string().min(8, 'パスワードは８文字以上で入力してください'),
    passwordConfirmation: z.string().min(1, '確認用のパスワードがありません'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirmation'],
  });

// スキーマから型を自動生成
type SignUpFormInputs = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
  const navigate = useNavigate();
  const {
    // 各入力フィールドを登録
    register,
    // フォームの送信を処理する関数
    handleSubmit,
    // 各フィールドのバリデーションエラーを保存
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    // スキーマを使ってバリデーションチェック
    resolver: zodResolver(signUpSchema),
  });

  const generationOptions = [
    { value: '15', label: '１０代前半' },
    { value: '20', label: '１０代後半' },
    { value: '25', label: '２０代前半' },
    { value: '30', label: '２０代後半' },
    { value: '35', label: '３０代前半' },
    { value: '40', label: '３０代後半' },
    { value: '45', label: '４０代前半' },
    { value: '50', label: '４０代後半' },
    { value: '55', label: '５０代前半' },
    { value: '60', label: '５０代後半' },
    { value: '65', label: '６０代前半' },
    { value: '70', label: '６０代後半' },
    { value: '75', label: '７０歳以上' },
  ];

  const genderOptions = [
    { value: 'male', label: '男性' },
    { value: 'female', label: '女性' },
    { value: 'secret', label: '秘密' },
  ];

  const onSubmit = async (data: SignUpFormInputs) => {
    try {
      // フォームの入力データを送信
      const response = await axios.post('/api/auth/sign-up', data);
      // 処理が成功したら指定ページへリダイレクトする
      navigate('/reviews');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // axiosのエラーハンドリング
        console.error('Error:', error.response?.data);
      } else {
        // その他エラー
        console.error('Error:', error);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormInput label="名前" required {...register('name')} error={errors.name?.message} />
      </form>
    </>
  );
};
