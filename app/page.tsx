'use client';

import { useEffect } from 'react';
import "./page.css";
import HomeNavigation from './Components/HomeNavigation/HomeNavigation';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { BiAnalyse, BiMoney, BiShield, BiTestTube } from 'react-icons/bi';
import logoImage from '@/public/Logo_white.png';
import Image from 'next/image';


export default function Home() {
  const curYear = new Date().getFullYear();

  useEffect(() => {
    document.title = 'MONETIS';
  }, []);

  return (
    <>
      <HomeNavigation/>
      <div className='homeContainer'>
        <div className='mainSection'>
          <h1>Banking made <span>simple</span></h1>
          <p>MONETIS is a secure and user-friendly testing platform for <br />managing finances—ideal for test automators.</p>
          <Link href="/register">Start your journey <FaArrowRight/></Link>
        </div>

        <div className='featuresSection'>
          <h2>Smart account management for the modern world</h2>

          <div className='features'>
            <div className='feature'>
              <BiAnalyse/>
                <h3>Real-time Analytics</h3>
                <p>Track your spending habits and monitor account activity with detailed insights, interactive reports, and data-driven recommendations.</p>
            </div>

            <div className='feature'>
              <BiMoney/>
                <h3>Instant Transfers</h3>
                <p>Send and receive money instantly between accounts with zero fees, ensuring fast and secure transactions whenever you need them.</p>
            </div>

            <div className='feature'>
              <BiShield/>
                <h3>Bank-grade Security</h3>
                <p>Keep your finances safe with state-of-the-art encryption, multi-factor authentication, and real-time fraud detection.</p>
            </div>

            <div className='feature'>
              <BiTestTube/>
                <h3>For Test Automation Purposes</h3>
                <p>Learn, experiment, and implement test automation tools get familiar with the whole process</p>
            </div>
          </div>
            
        </div>

        <footer>
          <div className='getStarted'>
            <h3>Ready to take your finances to the next level?</h3>
            <Link href="/register">Get Started Now</Link>
          </div>

          <div className='copyright'>
            <Image src={logoImage} alt="Register"></Image>
            <p>&copy; {curYear} MONETIS. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

