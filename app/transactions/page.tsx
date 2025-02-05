'use client';

import { useAuth } from '@/app/hooks/useAuth';
import Navigation from '@/app/Components/Navigation/Navigation';
import './styles.css';
import { useEffect, useState } from 'react';
import { ClipLoader, GridLoader } from 'react-spinners';
import StaticLoader from '../Components/StaticLoader/StaticLoader';
import TransactionItem from '../Components/TransactionItem/TransactionItem';
import Select from 'react-select';

interface TransactionInterface {
  type: string;
  amount: number;
  category: string;
  date: string;
}

interface FiltersData {
  type: string;
  category: string;
}

const typeFilters : string[] = [
  'All',
  'Payment',
  'Transfer Between Accounts',
  'Transfer',
]

const categoryFilters : string[] = [
  "All",
  "Online Shopping",
  "Groceries",
  "Entertainment",
  "Clothing",
  "Bills",
  "Car",
  "Mobile",
  "House",
  "Travel",
  "Other",
]

export default function Transactions() {
  useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Array<TransactionInterface>>([]);
  const [page, setPage] = useState<number>(1);
  const [totalFilteredResults, setTotalFilteredResults] = useState<number>(1);
  const [filtersData, setFiltersData] = useState<FiltersData>({ type: 'All', category: 'All' });

  async function fetchTransactions() {
    setLoadingAction(true);
    try {
      const response = await fetch(`/api/users/transactions?page=${page}&type=${filtersData.type}&category=${filtersData.category}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const transactions = await response.json();
      setTotalFilteredResults(transactions.total);
      setTransactions(transactions.history.map((transaction: TransactionInterface) => ({ type: transaction.type, amount: transaction.amount, category: transaction.category, date: transaction.date })));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setLoadingAction(false);
    }
  }

  useEffect(() => {
    document.title = 'Monetis | Transactions';
    
    setLoading(true);
    setIsClient(true);
    fetchTransactions();
  }, []);

  useEffect(() => {
    document.title = `Monetis | Transactions - Page ${page}`;
    fetchTransactions();
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchTransactions();
  }, [filtersData]);

  const handleSelectChange = (selectedOption: string, filter: string) => {
    if(selectedOption.includes('Transfer')) {
      setFiltersData((prevData) => ({ ...prevData, category: 'All' }));
    }
    setFiltersData((prevData) => ({ ...prevData, [filter]: selectedOption }));
  }

  return (
    <div className='transactions'>
      <Navigation />

      <div className='content'>
        <h1>Transactions</h1>

        <div className="filters">
          {isClient &&
          <div className="row">
            <div className="column">
              <label htmlFor="type">Type</label>
              <Select 
                name='type'
                options={typeFilters.map((filter: string) => ({value: filter, label: filter }))} 
                value={{value: filtersData.type, label: filtersData.type}}
                onChange={(newValue) => {handleSelectChange(newValue?.value as string, 'type')}}
                className='select'/>
            </div>

            {!filtersData.type.includes('Transfer') &&
              <div className="column">
                <label htmlFor="category">Category</label>
                <Select 
                  name='category'
                  options={categoryFilters.map((filter: string) => ({value: filter, label: filter }))} 
                  value={{value: filtersData.category, label: filtersData.category}}
                  onChange={(newValue) => {handleSelectChange(newValue?.value as string, 'category')}}
                  className='select'/>
              </div>
            }

            {loadingAction &&
             <ClipLoader color="#000" size={11} />
            }
          </div>
          }
          <hr />
        </div>
        
        <div className={'transactions-list' + (loadingAction ? ' loading-data' : '')}>
          {transactions.map((transaction, index) => (
            <TransactionItem key={index} type={transaction.type} amount={transaction.amount} category={transaction.category} table={true} date={transaction.date}/>
          ))}

          {transactions.length === 0 &&
            <p className='no-data'>Nothing to display at the moment. <br /> We&apos;ll track all your transactions here.</p>
          }
        </div>

        {transactions.length > 0 &&
          <div className="pagination">
            <button onClick={() => setPage(page - 1)} className={page === 1 ? 'disabled' : ''}>Previous</button>

            {[...Array(Math.ceil(totalFilteredResults / 10)).keys()].map((pageNum) => (
              <button
                key={pageNum + 1}
                onClick={() => setPage(pageNum + 1)}
                className={page === pageNum + 1 ? 'active' : ''}
              >
                {pageNum + 1}
              </button>
            ))}

            <button onClick={() => setPage(page + 1)} className={transactions.length < 10 ? 'disabled' : ''}>Next</button>
          </div>
        }
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
