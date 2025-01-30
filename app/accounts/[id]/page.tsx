'use client';

import { useAuth } from '@/app/hooks/useAuth';
import Navigation from '@/app/Components/Navigation/Navigation';
import './styles.css';
import {use, useEffect, useState } from 'react';
import { GridLoader } from 'react-spinners';
import StaticLoader from '../../Components/StaticLoader/StaticLoader';
import { ToastContainer, toast } from 'react-toastify';

interface AccountInterface {
  name: string;
  amount: number;
  iban: string;
}

type CreateAccount = {
  name: string;
  amount: string;
}


export default function Accounts({ params }: { params: Promise<{ id: string }> }) {
  useAuth();
  const { id } = use(params);
  const [userAccount, setUserAccount] = useState<AccountInterface>();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [accountHolder, setAccountHolder] = useState<string>('');


  useEffect(() => {
    setAccountHolder(sessionStorage.getItem('userName') || '');
    setLoading(true);
    setIsClient(true);

    async function fetchAccounts() {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`/api/account/data?token=${encodeURIComponent(token || '')}&id=${encodeURIComponent(id)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
  
        console.log(response.status);
        if (response.status !== 200) {
          window.location.href = '/accounts';
          return;
        }
        
        const accountData = await response.json();
        const account = accountData.account;

        document.title = 'Monetis | Accounts - ' + account.name;
        setUserAccount({ name: account.name, amount: account.amount, iban: account.iban });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAccounts();
  }, []);

  return (
    <div>
      <div className='user_account'>
        <Navigation />

        <div className='content'>
          <h1>Account {userAccount?.name}</h1>
        </div>

        <div className={`loading_screen ${!loading ? "hidden" : ""}`}>
          {isClient ? (
            <GridLoader color="#4d8bf7" size={10} />
          ) : (
            <StaticLoader/>
          )}
        </div>
      </div>

      <ToastContainer/>
    </div>
  );
}
