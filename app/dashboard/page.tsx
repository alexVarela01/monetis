'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();



  return (
    <div>
      <h2>Welcome to the dashboard</h2>
    </div>
  );
}