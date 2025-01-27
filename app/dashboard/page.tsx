'use client';

import { useAuth } from '@/app/hooks/useAuth';
import Navigation from '@/app/Components/Navigation/Navigation';
import AccountCard from '@/app/Components/AccountCard/AccountCard';
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
        <h1>Dashboard</h1>

        <div className='accounts_balance'>
          <AccountCard accountName='Checking' balance={19.2} color='33, 110, 247' />
          <AccountCard accountName='Savings' balance={19.0} color='51, 206, 139' />
          <AccountCard accountName='Account_1' balance={19.0} color='254, 192, 102' />
          <AccountCard accountName='Account_2' balance={19.0} color='241, 103, 93' />
        </div>

        <div className='left'>
          <div className='statistics'></div>
          <div className='overview'></div>
        </div>

        <div className='right'>
          <div className='transactions'></div>
        </div>
      </div>
    </div>
  );
}
