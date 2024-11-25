'use client';

import styles from './index.module.scss';
import { useState } from 'react';
import { useAuth } from '@/../../hooks/useAuth';
import axios from 'axios';
import FormInput from '@/components/elements/formInput';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'メールアドレスを入力してください' })
    .email({ message: '正しいメールアドレスの形式で入力してください' }),
  password: z
    .string()
    .min(1, { message: 'パスワードを入力してください' })
    .min(8, { message: 'パスワードは８文字以上です' }),
});

// loginSchemaから型推論し、LoginFormDataという型を生成
type LoginFormData = z.infer<typeof loginSchema>;
// コンポーネントのプロップスの型定義
interface LoginFormProps {
  // ログインが成功した場合に呼び出されるコールバック関数
  onSuccess?: () => void;
  // ログインが失敗した場合に呼び出されるコールバック関数
  onError?: (error: string) => void;
}

export const LoginForm = ({ onSuccess, onError }: LoginFormProps) => {
  // サーバーのエラーメッセージを管理
  const [serverError, setServerError] = useState('');
  const { handleAuthSuccess } = useAuth();

  const {
    // 入力フィールドをフォームに登録させるregister関数
    register,
    handleSubmit,
    // フォームの状態を設定する（バリデーションエラー、送信中）
    formState: { errors, isSubmitting },
    // useFormでフォームデータの管理
  } = useForm<LoginFormData>({
    // loginSchemaに基づいたバリデーション判定
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (data: LoginFormData) => {
    // エラーメッセージをリセット
    setServerError('');
    try {
      // バックエンドへPOSTリクエスト
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/log-in`, data);
      const { token, user } = response.data;
      // 認証成功時、カスタムフックのhandleAuthSuccess関数にデータを渡す
      await handleAuthSuccess({
        token,
        userId: user.id,
        name: user.name,
        email: user.email,
      });
      // 親コンポーネントからonSuccessが渡されていたらその関数を実行
      onSuccess?.();
    } catch (error) {
      // axios関連のエラーだった場合
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'ログインに失敗しました';
        // サーバーからのレスポンスデータのエラーメッセージで状態を更新
        setServerError(errorMessage);
        // 親コンポーネントからonErrorが渡されていたらその関数を実行
        onError?.(errorMessage);
      }
    }
  };
  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {serverError && <div className={styles.errorMessage}>{serverError}</div>}
        <FormInput
          label="メールアドレス"
          {...register('email')}
          type="email"
          error={errors.email?.message}
          required
          placeholder="example@example.com"
        />
        <FormInput
          label="パスワード"
          {...register('password')}
          type="password"
          error={errors.password?.message}
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
        >
          {isSubmitting ? 'ログイン中' : 'ログイン'}
        </button>
      </form>
    </div>
  );
};
