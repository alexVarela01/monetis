'use client';

import { useAuth } from '@/app/hooks/useAuth';
import Navigation from '@/app/Components/Navigation/Navigation';
import AccountCard from '@/app/Components/AccountCard/AccountCard';
import StatisticsPanel from '@/app/Components/StatisticsPanel/StatisticsPanel';
import OverallPanel from '@/app/Components/OverallPanel/OverallPanel';
import TransactionItem from '@/app/Components/TransactionItem/TransactionItem';
import './styles.css';
import { useEffect } from 'react';
import { CiSquarePlus  } from "react-icons/ci";

export default function Dashboard() {
  useAuth();

  const accounts = [
    { name: 'Checking', balance: 20000},
    { name: 'Savings', balance: 2000},
    { name: 'Account_1', balance: 512},
    { name: 'Account_2', balance: 239.21},
  ];

  const dataStatistics: { income: number[]; expenses: number[] } = {
    income: [152, 142, 64, 156, 121, 70, 152, 171, 124, 137],
    expenses: [146, 129, 133, 160, 179, 82, 31, 117, 67, 10],
  };

  const transactions = [
    { type: 'payment', amount: -100, date: '2021-10-01', category: 'Salary' },
    { type: 'payment', amount: -50, date: '2021-10-02', category: 'Groceries' },
    { type: 'transfer', amount: -50, date: '2021-10-03', category: 'Alexandre Varela' },
    { type: 'payment', amount: -20, date: '2021-10-04', category: 'Clothing' },
    { type: 'payment', amount: 10, date: '2021-10-05', category: 'Bills' },
    { type: 'payment', amount: -40, date: '2021-10-06', category: 'Other' },
    { type: 'payment', amount: -20, date: '2021-10-07', category: 'Online' },
  ]

  const overview = [
    { type: "payment", category: 'Groceries', amount: 1002, count: 1 },
    { type: "payment", category: 'Online Shopping', amount: 520, count: 3 },
    { type: "payment", category: 'Entertainment', amount: 123, count: 10 },
    { type: "payment", category: 'Clothing', amount: 5310, count: 25 },
    { type: "transfer", category: 'Alexandre Varela', amount: 5310 },
    { type: "transfer", category: 'NTT Data', amount: 5310 },
    { type: "transfer", category: 'John Doe', amount: 5310 },
    { type: "transfer", category: 'John Doeasd', amount: -5310 },
  ]

  const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);
  useEffect(() => {
    document.title = 'Monetis | Dashboard';


    
  }, []);

  return (
    <div className='dashboard'>
      <Navigation />

      <div className='content'>
        <h1>Dashboard</h1>

        <div className='accounts_balance'>

          {accounts.map((account, index) => (
            <AccountCard key={index} colorKey={index} accountName={account.name} balance={account.balance} fillPercent={(account.balance / totalBalance) * 100}/>
          ))}

          {accounts.length < 4 && 
            <div className='new_account'>
              <span><CiSquarePlus /></span>
            </div>
          }
        </div>

        <div className='panels'>
          <div className='left'>
            <StatisticsPanel data={dataStatistics}/>
            <OverallPanel data={overview}/>
          </div>

          <div className='right'>
            <div className='transactions'>
              <h2>Transactions</h2>
              <div className='transaction-list'>
                {transactions.map((transaction, index) => (
                  <TransactionItem key={index} type={transaction.type} amount={transaction.amount} date={transaction.date} category={transaction.category}/>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
