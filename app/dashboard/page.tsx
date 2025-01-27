'use client';

import { useAuth } from '@/app/hooks/useAuth';
import Navigation from '@/app/Components/Navigation/Navigation';
import './styles.css';
import { useEffect } from 'react';

export default function Dashboard() {
  useAuth();

  useEffect(() => {
    document.title = 'Monetis | Dashboard';
  }, []);

  return (
    <div className='dashboard'>
      <Navigation />

      <div className='content'>

      </div>
    </div>
  );
}
