'use client';

import { useAuth } from '@/app/hooks/useAuth';
import Navigation from '@/app/Components/Navigation/Navigation';
import './styles.css';
import {ChangeEvent, FormEvent, use, useEffect, useState } from 'react';
import { ClipLoader, GridLoader } from 'react-spinners';
import StaticLoader from '../../Components/StaticLoader/StaticLoader';
import { ToastContainer, toast } from 'react-toastify';
import { formatBalance } from '@/app/utils/helpers';
import AccountCard from '@/app/Components/AccountCard/AccountCard';
import { FaArrowLeft } from 'react-icons/fa'; 
import { AiOutlineBank, AiOutlineToTop, AiOutlineUnorderedList, AiOutlineDelete, AiOutlineEdit, AiOutlineDollar } from "react-icons/ai";
import Dialog from '@/app/Components/Dialog/Dialog';

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


export default function Account({ params }: { params: Promise<{ id: string }> }) {
  useAuth();
  const { id } = use(params);
  const [userAccount, setUserAccount] = useState<AccountInterface>();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [openedModal, setOpenedModal] = useState<string>('');
  const [accountHolder, setAccountHolder] = useState<string>('');
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [checkingBalance, setCheckingBalance] = useState<number>(0);

  const [transactionAmount, setTransactionAmount] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");





  useEffect(() => {
    setLoading(true);
    setIsClient(true);
    fetchAccount();
  }, []);

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
      
      document.title = 'MONETIS | Accounts - ' + account.name;
      setCheckingBalance(accountData.checkingBalance);
      setTotalBalance(totalBalance._sum.amount);
      setAccountHolder(accountData.accountHolder);
      setAccountName(account.name);
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

  const goBack = () => {
    window.location.href = "/accounts"
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // check if is Number. can be decimal
    if (isNaN(Number(value))) return;

    // allow max 2 decimals
    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts[1].length > 2) {
        return;
      }
    }
    setTransactionAmount(value);
  };

  const withdrawAmount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingAction(true);
    launchRequest(e, '/api/account/withdraw', {amount: transactionAmount, account_id: userAccount?.id});
  }

  const topUpAmount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingAction(true);
    launchRequest(e, '/api/account/topup', {amount: transactionAmount, account_id: userAccount?.id});
  }

  const deleteAccount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingAction(true);
    launchRequest(e, '/api/account/delete', {account_id: userAccount?.id}, true);
  }

  const editAccount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingAction(true);
    launchRequest(e, '/api/account/edit', {newName: accountName, account_id: userAccount?.id});
  }

  const launchRequest = async (e: FormEvent<HTMLFormElement>, url: string, data: object, redirect?: boolean) => {
    try {
      const withdrawResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const withdrawData = await withdrawResponse.json();
      if (withdrawResponse.status !== 200) {
        toast.dismiss();
        for (const error of withdrawData.errors) {
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

      if(redirect) {
        window.location.href = '/accounts';
      }
      //run fetchAccount again
      await fetchAccount(); 
      setOpenedModal("");

    } catch (error: unknown) {
      console.error('An unexpected error happened:', error);
    } finally {
      setLoadingAction(false);
      setTransactionAmount("");
    }
  }
  
  return (
    <div>
      <div className='user_account'>
        <Navigation />

        <div className='content'>
          <div className='top'>
            <FaArrowLeft onClick={goBack}/>
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
              createdAt={userAccount.createdAt}
              updatedAt={userAccount.updatedAt}
            />
          )}  

          <div className='actions'>
            <h2>Account Actions</h2>
            <div className='actions_container'>

              {userAccount?.type==='checking' ? (
                <>
                  <div className='action' onClick={() => window.location.href = `/transfer`}>
                    <AiOutlineBank />
                    <div>Transfer</div>
                  </div>
                  <div className='action' onClick={() => window.location.href = `/transactions`}>
                    <AiOutlineUnorderedList />
                    <div>History</div>
                  </div>
                </>
              ) : (
                <>
                  <div className='action' onClick={() => setOpenedModal("withdrawAmount")}>
                    <AiOutlineDollar />
                    <div>Withdraw</div>
                  </div>
                  <div className='action' onClick={() => setOpenedModal("topUp")}>
                    <AiOutlineToTop />
                    <div>Top up</div>
                  </div>
                </>
              )}

              {!userAccount?.isSystemAccount && (
                <>
                  <div className={userAccount?.isSystemAccount ? 'action disabled' : 'action'} onClick={() => setOpenedModal("edit")}>
                    <AiOutlineEdit />
                    <div>Edit</div>
                  </div>
                  <div className={userAccount?.isSystemAccount ? 'action disabled' : 'action'} onClick={() => setOpenedModal("delete")}>
                    <AiOutlineDelete />
                    <div>Delete</div>
                  </div>
                </>
              )}
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

      <Dialog title="Withdraw amount" isOpen={openedModal === "withdrawAmount"} onClose={() => setOpenedModal("")}>
        <form onSubmit={withdrawAmount}>
          <div className='row'>
            <div className='column'>
              <label htmlFor="name">Effective Date</label>
              <input
                type="text"
                name="name"
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
            <div className='column'>
              <label htmlFor="name">Current Balance</label>
              <div className='suffix_container'>
                <input
                  type="text"
                  name="amount"
                  placeholder="10"
                  style={{ textAlign: 'right' }}
                  value={formatBalance(Number(userAccount?.amount))}
                  readOnly
                />
                <span>€</span>
              </div>
            </div>

            <div className='column required'>
              <label htmlFor="name">Withdraw Amount</label>
              <div className='suffix_container'>
                <input
                  type="text"
                  name="amount"
                  style={{ textAlign: 'right' }}
                  maxLength={14}
                  value={transactionAmount}
                  onChange={handleChange}
                  required
                />
                <span>€</span>
              </div>
            </div>

            
          </div>

          <span className='helpText'>Amount will be withdrawn to the checking account!</span>

          <button type="submit" disabled={loadingAction}>
            {loadingAction ? <ClipLoader color="#fff" size={11} /> : 'Withdraw'}
          </button>
        </form>
      </Dialog>

      <Dialog title="Top up account" isOpen={openedModal === "topUp"} onClose={() => setOpenedModal("")}>
        <form onSubmit={topUpAmount}>
          <div className='row'>
            <div className='column'>
              <label htmlFor="name">Effective Date</label>
              <input
                type="text"
                name="name"
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
            <div className='column'>
              <label htmlFor="name">Checking Account Balance</label>
              <div className='suffix_container'>
                <input
                  type="text"
                  name="amount"
                  placeholder="10"
                  style={{ textAlign: 'right' }}
                  value={formatBalance(Number(checkingBalance))}
                  readOnly
                />
                <span>€</span>
              </div>
            </div>

            <div className='column required'>
              <label htmlFor="name">Top up Amount</label>
              <div className='suffix_container'>
                <input
                  type="text"
                  name="amount"
                  style={{ textAlign: 'right' }}
                  maxLength={14}
                  value={transactionAmount}
                  onChange={handleChange}
                  required
                />
                <span>€</span>
              </div>
            </div>

            
          </div>

          <span className='helpText'>Amount will be transfered from the checking account to this account!</span>

          <button type="submit" disabled={loadingAction}>
            {loadingAction ? <ClipLoader color="#fff" size={11} /> : 'Top up'}
          </button>
        </form>
      </Dialog>

      <Dialog title="Delete account" isOpen={openedModal === "delete"} onClose={() => setOpenedModal("")}>
        <form onSubmit={deleteAccount}>
          <p className='text'>Current balance will be transfered to the checking account!</p>
          <p className='text'><strong>Account balance:</strong> {formatBalance(Number(userAccount?.amount))}€</p>
          <p className='text'><strong>Checking account balance:</strong> {formatBalance(Number(checkingBalance))}€</p>
          <p className='text'><strong>New checking account balance:</strong> {formatBalance(Number((userAccount?.amount || 0) + checkingBalance))}€</p>

          <div className="row">
            <button type="button" disabled={loadingAction} onClick={() => setOpenedModal("")}>Cancel</button>
            <button type="submit" disabled={loadingAction} className='delete'>
              {loadingAction ? <ClipLoader color="#fff" size={11} /> : 'Delete account'}
            </button>
          </div>
        </form>
      </Dialog>

      <Dialog title="Edit account" isOpen={openedModal === "edit"} onClose={() => setOpenedModal("")}>
        <form onSubmit={editAccount}>

          <div className='row'>
            <div className='column required'>
              <label htmlFor="name">Account name</label>
              <input
                type="text"
                name="name"
                value={accountName}
                maxLength={25}
                onChange={(e) => setAccountName(e.target.value)}
                required
              />
            </div>
          </div>

          <span className='helpText'>Amount will be transfered from the checking account to this account!</span>

          <button type="submit" disabled={loadingAction}>
            {loadingAction ? <ClipLoader color="#fff" size={11} /> : 'Update'}
          </button>
        </form>
      </Dialog>

      <ToastContainer/>
    </div>
  );
}
