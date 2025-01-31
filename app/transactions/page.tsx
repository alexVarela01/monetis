'use client';

import { useAuth } from '@/app/hooks/useAuth';
import Navigation from '@/app/Components/Navigation/Navigation';
import './styles.css';
import { useEffect, useState } from 'react';
import { GridLoader } from 'react-spinners';
import StaticLoader from '../Components/StaticLoader/StaticLoader';


export default function Transactions() {
  useAuth();


  const [loading, setLoading] = useState<boolean>(true);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Monetis | Transactions';
    
    setLoading(true);
    setIsClient(true);
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
        <h1>Transactions - Under development</h1>

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
