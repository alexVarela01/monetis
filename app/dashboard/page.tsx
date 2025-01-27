'use client';

import { useAuth } from '@/app/hooks/useAuth';
import Navigation from '@/app/Components/Navigation/Navigation';
import './styles.css';

export default function Dashboard() {
  useAuth();



  return (
    <div className='dashboard'>
      <Navigation />

      <div className='content'>

      </div>
    </div>
  );
}
