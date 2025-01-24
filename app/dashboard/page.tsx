'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  function handleLogout () {
    sessionStorage.clear();
    router.push('/login');
  };

  return (
    <div>
      <h2>Welcome to the dashboard</h2>
      {isAuthenticated ? (
        <p>You are authenticated.</p>
      ) : (
        <p>You are not authenticated.</p>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
