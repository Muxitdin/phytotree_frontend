'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Registration is handled via Telegram, redirect to login
export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return null;
}
