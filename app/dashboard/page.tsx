'use client';

import { useAuth } from '@/app/hooks/useAuth';
import Navigation from '@/app/Components/Navigation/Navigation';
import AccountCard from '@/app/Components/AccountCard/AccountCard';
import StatisticsPanel from '@/app/Components/StatisticsPanel/StatisticsPanel';
import OverallPanel from '@/app/Components/OverallPanel/OverallPanel';
import TransactionItem from '@/app/Components/TransactionItem/TransactionItem';
import './styles.css';
import { useEffect, useState } from 'react';
import { CiSquarePlus  } from "react-icons/ci";
import { GridLoader } from 'react-spinners';
import StaticLoader from '../Components/StaticLoader/StaticLoader';
import {FaArrowRight} from "react-icons/fa";
import Link from 'next/link';

interface TransactionInterface {
  type: string;
  amount: number;
  category: string;
  date: string;
}

interface AccountInterface {
  id: number;
  name: string;
  amount: number;
  totalBalance: number;
}

interface CategoryInterface {
  type: string;
  category: string;
  amount: number;
  _sum: { amount: number };
  _count: { id: number };
}

export default function Dashboard() {
  useAuth();
  const [isClient, setIsClient] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [userAccounts, setUserAccounts] = useState<Array<AccountInterface>>([]);
  const [transactions, setTransactions] = useState<Array<TransactionInterface>>([]);
  const [dataStatistics, setDataStatistics] = useState<{income: number[]; expenses: number[];}>({ income: Array(10).fill(0), expenses: Array(10).fill(0),});
  const [overview, setOverview] = useState<Array<{ type: string; amount: number, category: string, count?: number }>>([]);
  const [accountHolder, setAccountHolder] = useState<string>('');

  useEffect(() => {
    document.title = 'Monetis | Dashboard';
    setLoading(true);
    setIsClient(true);
    
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users/data', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
  
        const accountData = await response.json();
        const totalBalance = accountData.accounts.reduce((acc: number, account: AccountInterface) => acc + account.amount, 0);

        // store history from last 7 days using accountData.history.date
        const currentDate = new Date();
        const lastTenDays = new Date(currentDate.setDate(currentDate.getDate() - 10));
        
        const lastTenDaysHistory = accountData.history.filter(
          (transaction: TransactionInterface) => new Date(transaction.date) >= lastTenDays
        );

        const newStatistics = { income: Array(10).fill(0), expenses: Array(10).fill(0) };

        for (let i = 9; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);

          const dateString = date.toISOString().split("T")[0];
          const dailyTransactions = lastTenDaysHistory.filter(
            (transaction: TransactionInterface) => transaction.date.startsWith(dateString)
          ).filter((transaction: TransactionInterface) => transaction.type !== 'transfer between accounts');

          dailyTransactions.forEach((transaction: TransactionInterface) => {
            if(transaction.amount < 0){
              newStatistics.expenses[9 - i] += Math.abs(transaction.amount);
            } else {
              newStatistics.income[9 - i] += transaction.amount;
            }
          });
        }

        setAccountHolder(accountData.accountHolder);
        setOverview(accountData.historyCategoryAmountCount.filter((transaction: TransactionInterface) => transaction.type !== 'transfer between accounts').map((category: CategoryInterface) => ({ type: category.type, amount: category._sum.amount, category: category.category, count: category._count.id })));
        setDataStatistics(newStatistics);
        setUserAccounts(accountData.accounts.map((account: AccountInterface) => ({ name: account.name, amount: account.amount, totalBalance, id: account.id })));
        setTransactions(accountData.history.slice(0, 7).map((transaction: TransactionInterface) => ({ type: transaction.type, amount: transaction.amount, category: transaction.category, date: transaction.date })));
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className='dashboard'>
      <Navigation />

      <div className='content'>
        <h1>Welcome, {accountHolder}</h1>

        <div className='accounts_balance'>

          {userAccounts.length > 0 && userAccounts.length > 4 && 
            <Link className='seeAll' href={'/accounts'}>See all accounts<FaArrowRight /></Link>
          }

          {userAccounts.length > 0 && userAccounts.slice(0,4).map((account, index) => (
            <AccountCard accountId={account.id} key={index} colorKey={index} accountName={account.name} balance={account.amount} fillPercent={(account.amount / account.totalBalance) * 100}/>
          ))}

          {userAccounts.length > 0 && userAccounts.length < 6 && 
            <Link href={'/accounts?createAccount=true'} className='new_account'>
              <span><CiSquarePlus /></span>
            </Link>
          }
        </div>

        <div className='panels'>
          <div className='left'>
            <StatisticsPanel data={dataStatistics} loading={loading}/>
            <OverallPanel data={overview} loading={loading}/>
          </div>

          <div className='right'>
            <div className='transactions'>
              <div className='header'>
                <h2>Transactions</h2>
                <Link className='seeAll' href={'/transactions'}>See all transactions<FaArrowRight /></Link>
              </div>
              <div className='transaction-list'>
                {transactions.map((transaction, index) => (
                  <TransactionItem key={index} type={transaction.type} amount={transaction.amount} category={transaction.category}/>
                ))}

                {transactions.length === 0 &&
                  <p className='no-data'>Nothing to display at the moment. <br /> We&apos;ll track all your transactions here.</p>
                }
              </div>
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
  );
}
