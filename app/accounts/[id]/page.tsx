'use client';

import { useAuth } from '@/app/hooks/useAuth';
import Navigation from '@/app/Components/Navigation/Navigation';
import './styles.css';
import {use, useEffect, useState } from 'react';
import { GridLoader } from 'react-spinners';
import StaticLoader from '../../Components/StaticLoader/StaticLoader';
import { ToastContainer, toast } from 'react-toastify';
import { formatBalance } from '@/app/utils/helpers';
import AccountCard from '@/app/Components/AccountCard/AccountCard';
import { FaArrowLeft } from 'react-icons/fa'; 

interface AccountInterface {
  id: number;
  name: string;
  amount: number;
  iban: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
  index?: number;
  isSystemAccount?: boolean;
}

type CreateAccount = {
  name: string;
  amount: string;
}


export default function Account({ params }: { params: Promise<{ id: string }> }) {
  useAuth();
  const { id } = use(params);
  const [userAccount, setUserAccount] = useState<AccountInterface>();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [accountHolder, setAccountHolder] = useState<string>('');
  const [totalBalance, setTotalBalance] = useState<number>(0);


  useEffect(() => {
    setLoading(true);
    setIsClient(true);

    async function fetchAccount() {
      try {
        const response = await fetch(`/api/account/data?id=${encodeURIComponent(id)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (response.status !== 200) {
          window.location.href = '/accounts';
          return;
        }
        
        const accountData = await response.json();
        const account = accountData.account;
        const index = accountData.index;
        const totalBalance = accountData.totalBalance;
        
        document.title = 'Monetis | Accounts - ' + account.name;

        setTotalBalance(totalBalance._sum.amount);
        setAccountHolder(accountData.accountHolder);
        setUserAccount({ 
          id: account.id, 
          index: index, 
          name: account.name, 
          amount: account.amount, 
          iban: account.iban, 
          type: account.type, 
          createdAt: account.createdAt || account.created_at, // Ensure correct field mapping
          updatedAt: account.updatedAt || account.updated_at, // Ensure correct field mapping
          isSystemAccount: account.type !== 'user' 
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAccount();
  }, []);

  const sendToastIban = (message: string) => {
    toast.info(message, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  }

  return (
    <div>
      <div className='user_account'>
        <Navigation />

        <div className='content'>
          <div className='top'>
            <FaArrowLeft onClick={() => window.history.back()}/>
            <h1>Account</h1>
          </div>

          {userAccount && (
            <AccountCard
              colorKey={userAccount.index || 0}
              accountId={userAccount.id}
              accountName={userAccount.name}
              balance={userAccount.amount}
              fillPercent={(userAccount.amount / (totalBalance || 1)) * 100} // Avoid division by zero
              iban={userAccount.iban}
              accountHolder={accountHolder}
              handleToast={sendToastIban}
              cardDetails={true}
            />
          )}  

          <div className='actions'>
            <h2>Actions</h2>
            <div className='actions_container'>
              <div className='action'>
                <a href={`/accounts/${id}/transfer`}>Transfer (only checking)</a>
              </div>

              <div className='action'>
                <a href={`/accounts/${id}/transfer`}>Transfer to Checking (other accounts)</a>
              </div>

              <div className='action'>
                <a href={`/accounts/${id}/transfer`}>Top up (otgher accounts)</a>
              </div>

              <div className='action'>
                <a href={`/accounts/${id}/transactions`}>Transactions History(only checking)</a>
              </div>
              <div className='action'>
                <a href={`/accounts/${id}/edit`}>Edit (other accounts. Should appear disabled on checkign and saving)</a>
              </div>
              <div className='action'>
                <a href={`/accounts/${id}/delete`}>Delete (other accounts. Should appear disabled on checkign and saving)</a>
              </div>

            </div>
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

      <ToastContainer/>
    </div>
  );
}
