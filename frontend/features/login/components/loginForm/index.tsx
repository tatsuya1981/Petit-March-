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

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const LoginForm = ({ onSuccess, onError }: LoginFormProps) => {
  const [serverError, setServerError] = useState('');
  const { handleAuthSuccess } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (data: LoginFormData) => {
    setServerError('');

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/log-in`, data);
      const { token, user } = response.data;

      await handleAuthSuccess({
        token,
        userId: user.id,
        name: user.name,
        email: user.email,
      });
      onSuccess?.();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'ログインに失敗しました';
        setServerError(errorMessage);
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
