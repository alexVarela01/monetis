'use client';

import { useAuth } from '@/app/hooks/useAuth';
import Navigation from '@/app/Components/Navigation/Navigation';
import './styles.css';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { ClipLoader, GridLoader } from 'react-spinners';
import AccountCard from '../Components/AccountCard/AccountCard';
import { CiSquarePlus } from "react-icons/ci";
import StaticLoader from '../Components/StaticLoader/StaticLoader';
import Dialog from '../Components/Dialog/Dialog';
import { ToastContainer, toast } from 'react-toastify';

interface AccountInterface {
  name: string;
  amount: number;
  iban: string;
  accountHolder: string;
  totalBalance: number;
}

type CreateAccount = {
  name: string;
  amount: string;
}


export default function Accounts() {
  useAuth();

  const [userAccounts, setUserAccounts] = useState<Array<AccountInterface>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [accountHolder, setAccountHolder] = useState<string>('');
  const [totalBalance, setTotalBalance] = useState<number>(0.0);
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<Omit<CreateAccount, 'id'>>({
    name: '',
    amount: '10'
  });

  useEffect(() => {
    document.title = 'Monetis | Accounts';
    
    setAccountHolder(sessionStorage.getItem('userName') || '');
    setLoading(true);
    setIsClient(true);
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      const token = sessionStorage.getItem('authToken');
      const userName = sessionStorage.getItem('userName');

      const response = await fetch('/api/users/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const accountData = await response.json();
      console.log(accountData);
      const totalBalance = accountData.accounts.reduce((acc: number, account: AccountInterface) => acc + account.amount, 0);

      setTotalBalance(totalBalance.toString());
      setUserAccounts(accountData.accounts.map((account: AccountInterface) => ({ name: account.name, amount: account.amount, iban: account.iban, accountHolder: userName, totalBalance })));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
      // check if page has ?createAccount=true
      const searchParams = new URLSearchParams(window.location.search);
      const createAccount = searchParams.get('createAccount');
      if (createAccount === 'true' && userAccounts.length < 6 && !loading) {
        setIsOpen(true)
      }else{
        setIsOpen(false)
      }
  }, [userAccounts, loading]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // check if the value only contains numbers and is positive and is multiple of 10
    if (/^\d+$/.test(value) && Number(value) > 0 || value === '') {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const createAccount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      const token = sessionStorage.getItem('authToken');
      const registerResponse = await fetch('/api/account/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, token }),
      });

      // Create new session using session storage
      const registerData = await registerResponse.json();

      if (registerResponse.status !== 200) {
        toast.dismiss();
        for (const error of registerData.errors) {
          toast.error(error, {
            position: "bottom-right",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
          });
        }

        return;
      }

      //run fetchAccounts again
      await fetchAccounts(); 
      setIsOpen(false);

      //remove search params
      const url = new URL(window.location.href);
      url.searchParams.delete('createAccount');
      window.history.replaceState({}, '', url);
    } catch (error: unknown) {
      console.error('An unexpected error happened:', error);
    } finally {
      setLoadingAction(false);
    }
  }

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
      <div className='accounts'>
        <Navigation />

        <div className='content'>
          <div className='top'>
            <h1>Accounts</h1>

            <div className='totalBalance'>
              <span className='total'>Total Balance</span> <span>{Number(totalBalance).toFixed(2)} EUR</span>
            </div>
          </div>

          <div className='accounts_balance'>

            {userAccounts.length > 0 && userAccounts.map((account, index) => (
              <AccountCard key={index} colorKey={index} accountName={account.name} balance={account.amount} fillPercent={(account.amount / account.totalBalance) * 100} iban={account.iban} accountHolder={account.accountHolder} handleToast={sendToastIban}/>
            ))}

            {userAccounts.length > 0 && userAccounts.length < 6 && 
              <button className='new_account' onClick={() => setIsOpen(true)}>
                <span><CiSquarePlus /></span>
              </button>
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

      <Dialog title="New Account" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={createAccount}>
          <div className='row'>
            <div className='column'>
              <label htmlFor="name">Effective Date</label>
              <input
                type="text"
                name="name"
                maxLength={15}
                placeholder="John"
                // with dd/mm/yyyy format
                value={(new Date()).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                readOnly
              />
            </div>
          </div>

          <div className='row'>
            <div className='column'>
              <label htmlFor="name">Account Holder</label>
              <input
                type="text"
                name="name"
                placeholder="John"
                value={accountHolder}
                readOnly
              />
            </div>
          </div>

          <div className='row'>
            <div className='column required'>
              <label htmlFor="name">Account Name</label>
              <input
                type="text"
                name="name"
                placeholder="My next vacations"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className='column required'>
              <label htmlFor="amount">Initial Deposit</label>
              <div className='suffix_container'>
                <input
                  type="text"
                  name="amount"
                  placeholder="10"
                  style={{ textAlign: 'right' }}
                  value={formData.amount}
                  onChange={handleChangeAmount}
                  required
                />
                <span>€</span>
              </div>
            </div>
          </div>

          <span className='helpText'>Initial deposit must be a multiple of 10. Minimum deposit is 10.</span>


          <button type="submit" disabled={loadingAction}>
            {loadingAction ? <ClipLoader color="#fff" size={11} /> : 'Create account'}
          </button>
        </form>
      </Dialog>

      <ToastContainer/>
    </div>
  );
}
