'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface GoogleAuthButtonProps {
  className?: string;
}

export const GoogleAuthButton = ({ className }: GoogleAuthButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // バックエンドのGoogle認証エンドポイントにリダイレクトさせる
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };
};
