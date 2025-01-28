'use client';

import { useAuth } from '@/app/hooks/useAuth';
import Navigation from '@/app/Components/Navigation/Navigation';
import './styles.css';
import { useEffect, useState } from 'react';
import { GridLoader } from 'react-spinners';
import AccountCard from '../Components/AccountCard/AccountCard';
import { CiSquarePlus } from "react-icons/ci";
import StaticLoader from '../Components/StaticLoader/StaticLoader';

interface AccountInterface {
  name: string;
  amount: number;
  totalBalance: number;
}

export default function Accounts() {
  useAuth();

  const [userAccounts, setUserAccounts] = useState<Array<AccountInterface>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Monetis | Accounts';
    
    setLoading(true);
    setIsClient(true);
    async function fetchAccounts() {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch('/api/users/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
  
        const accountData = await response.json();
        const totalBalance = accountData.accounts.reduce((acc: number, account: AccountInterface) => acc + account.amount, 0);

        setUserAccounts(accountData.accounts.map((account: AccountInterface) => ({ name: account.name, amount: account.amount, totalBalance })));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAccounts();
  }, []);

  return (
    <div className='accounts'>
      <Navigation />

      <div className='content'>
        <h1>Accounts</h1>

        <div className='accounts_balance'>

          {userAccounts.length > 0 && userAccounts.map((account, index) => (
            <AccountCard key={index} colorKey={index} accountName={account.name} balance={account.amount} fillPercent={(account.amount / account.totalBalance) * 100}/>
          ))}
            {userAccounts.length > 0 && userAccounts.map((account, index) => (
            <AccountCard key={index} colorKey={index} accountName={account.name} balance={account.amount} fillPercent={(account.amount / account.totalBalance) * 100}/>
          ))}

          {userAccounts.length > 0 && userAccounts.length < 4 && 
            <div className='new_account'>
              <span><CiSquarePlus /></span>
            </div>
          }
        </div>
      </div>

      <div className={`loading_screen ${!loading ? "hidden" : ""}`}>
        {isClient ? (
          <GridLoader color="#4d8bf7" size={10} />
        ) : (
          <StaticLoader/>
        )}
      </div>
    </div>
  );
}
