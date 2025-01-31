'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


export function useAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
      fetch('/api/auth/checkValidToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.clearSession) {
            sessionStorage.clear();
            router.push('/login');
          } else {
            setIsAuthenticated(true);
          }
        })
        .catch(() => {
          sessionStorage.clear();
          router.push('/login');
        });
  }, [router]);

  return { isAuthenticated };
}
