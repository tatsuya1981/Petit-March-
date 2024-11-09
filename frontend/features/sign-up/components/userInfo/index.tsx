'use client';

import styles from './index.module.scss';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import FormInput from '@/components/elements/formInput';
import FormSelect from '@/components/elements/formSelect';

const signUpSchema = z
  .object({
    name: z.string().min(1, '名前を入力してください').max(50, 'ユーザー名は５０文字以内です'),
    email: z.string().min(1, 'メールアドレスを入力してください').email('正しいメールアドレスを入力してください'),
    generation: z
      .string()
      .transform((val) => parseInt(val))
      .optional(),
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
  const router = useRouter();
  // エラーを保存するための状態管理
  const [submitError, setSubmitError] = useState<string | null>(null);
  // フォーム送信の状態管理 true の場合は送信ボタン無効化
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    // 各入力フィールドを登録
    register,
    // フォームの送信を処理する関数
    handleSubmit,
    // 各フィールドのバリデーションエラーを保存
    formState: { errors, isSubmitted },
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
    // 送信前にエラー状態をクリア
    setSubmitError(null);
    // 送信開始時に送信中フラグをtrueにする
    setIsSubmitting(true);
    try {
      // フォームの入力データを送信
      const response = await axios.post('/api/auth/sign-up', data);
      // 処理が成功したら指定ページへリダイレクトする
      router.push('/reviews');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setSubmitError(error.response?.data?.message || '登録に失敗しました。もう一度お試しください。');
      } else {
        // その他エラー
        setSubmitError('予期せぬエラーが発生しました。もう一度お試しください');
      }
      console.error('Error:', error);
    } finally {
      // 処理完了後送信中フラグをfalseにする
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {submitError && (
          <div className={styles.errorMessage} role="alert">
            {submitError}
          </div>
        )}
        <FormInput label="名前" required {...register('name')} error={errors.name?.message} disabled={isSubmitting} />
        <FormInput
          label="メールアドレス"
          type="email"
          required
          {...register('email')}
          error={errors.email?.message}
          disabled={isSubmitting}
        />
        <FormSelect
          label="年代"
          options={generationOptions}
          {...register('generation')}
          error={errors.generation?.message}
          disabled={isSubmitting}
        />
        <FormSelect
          label="性別"
          options={genderOptions}
          {...register('gender')}
          error={errors.gender?.message}
          disabled={isSubmitting}
        />
        <FormInput
          label="パスワード"
          type="password"
          required
          {...register('password')}
          error={errors.password?.message}
          disabled={isSubmitting}
        />
        <FormInput
          label="パスワード確認"
          type="password"
          required
          {...register('passwordConfirmation')}
          error={errors.passwordConfirmation?.message}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? '登録中・・・' : '登録する'}
        </button>
      </form>
    </>
  );
};
