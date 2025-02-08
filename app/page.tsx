'use client';

import { useEffect } from 'react';
import "./page.css";
import HomeNavigation from './Components/HomeNavigation/HomeNavigation';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';


export default function Home() {

  useEffect(() => {
    document.title = 'Monetis';
  }, []);

  return (
    <>
      <HomeNavigation/>
      <div className='homeContainer'>
        <div className='mainSection'>
          <h1>Banking made <span>simple</span></h1>
          <p>Monetis is a secure and user-friendly testing platform for <br />managing finances—ideal for test automators.</p>
          <Link href="/register">Start your journey <FaArrowRight/></Link>
        </div>

        <div className='featuresSection'>
          <h2>Smart account management for the modern world</h2>
        </div>

        <footer>
          
        </footer>
      </div>
    </>
  );
}

