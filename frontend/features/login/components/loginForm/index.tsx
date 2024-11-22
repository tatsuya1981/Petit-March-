import { useState } from 'react';
import { useAuth } from '@/../../hooks/useAuth';
import axios from 'axios';

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const LoginForm = ({ onSuccess, onError }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { handleAuthSuccess } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, { email, password });
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
        setError(errorMessage);
        onError?.(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
};
