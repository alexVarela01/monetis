import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './Navigation.css';
import logoImage from '@/public/Logo.png';
import { MdDashboard, MdCompareArrows, MdArrowOutward, MdCreditCard, MdOutlineSettings, MdLogout } from "react-icons/md";


function Navigation() {
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    setCurrentPage(window.location.pathname.split("/")[1]);
  }, []);

  const router = useRouter();

  function handleLogout () {

    fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    .then((response) => response.json())
    .then(() => {
      router.push('/login');
    })
  };

  return (
    <div className='navigation'>
      <Image src={logoImage} onClick={() => window.location.href = '/dashboard'} alt="Register" className='logo'></Image>

      <div className='options'>
        <a href="/dashboard" className={currentPage === 'dashboard' ? 'active' : ''}><MdDashboard/><span>Dashboard</span></a>
        <a href="/transfer" className={currentPage === 'transfer' ? 'active' : ''}><MdArrowOutward/><span>Transfer</span></a>
        <a href="/transactions" className={currentPage === 'transactions' ? 'active' : ''}><MdCompareArrows/><span>Transactions</span></a>
        <a href="/accounts" className={currentPage === 'accounts' ? 'active' : ''}><MdCreditCard/><span>Accounts</span></a>
        <a href="/settings" style={{ marginTop: 'auto' }} className={currentPage === 'settings' ? 'active' : ''}><MdOutlineSettings/><span>Settings</span></a>
        <button onClick={handleLogout}><MdLogout/><span>Log out</span></button>
      </div>
    </div>
  );
}

export default Navigation;
