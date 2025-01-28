'use client';

import { useAuth } from '@/app/hooks/useAuth';
import Navigation from '@/app/Components/Navigation/Navigation';
import './styles.css';
import { useEffect, useState } from 'react';
import { GridLoader } from 'react-spinners';



export default function Transactions() {
  useAuth();


  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = 'Monetis | Transactions';
    
    setLoading(true);
    async function fetchTransactions() {
      try {
        console.log("todo here")
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  return (
    <div className='transactions'>
      <Navigation />

      <div className='content'>
        <h1>Transactions</h1>

      </div>
      <div className={`loading_screen ${!loading ? "hidden" : ""}`}>
        <GridLoader color="#4d8bf7" size={10}/>
      </div>
    </div>
  );
}
