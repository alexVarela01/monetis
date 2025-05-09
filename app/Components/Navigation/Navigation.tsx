import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './Navigation.css';
import logoImage from '@/public/Logo.png';
import { MdDashboard, MdCompareArrows, MdArrowOutward, MdCreditCard, MdOutlineSettings, MdLogout, MdMenu, MdClose  } from "react-icons/md";
import { LiaMoneyBillWaveAltSolid } from "react-icons/lia";

function Navigation() {
  const [currentPage, setCurrentPage] = useState("");
  const [open, setOpen] = useState(false);

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
    <>
      <div className='navigation'>
        <Image src={logoImage} onClick={() => window.location.href = '/dashboard'} alt="Register" className='logo'></Image>

        <div className='options'>
          <div onClick={() => window.location.href = "/dashboard"} className={currentPage === 'dashboard' ? 'active' : ''}><MdDashboard/><span>Dashboard</span></div>
          <div onClick={() => window.location.href = "/transfer"} className={currentPage === 'transfer' ? 'active' : ''}><MdArrowOutward/><span>Transfer</span></div>
          <div onClick={() => window.location.href = "/payments"} className={currentPage === 'payments' ? 'active' : ''}><LiaMoneyBillWaveAltSolid /><span>Payments</span></div>
          <div onClick={() => window.location.href = "/transactions"} className={currentPage === 'transactions' ? 'active' : ''}><MdCompareArrows/><span>Transactions</span></div>
          <div onClick={() => window.location.href = "/accounts"} className={currentPage === 'accounts' ? 'active' : ''}><MdCreditCard/><span>Accounts</span></div>
          <div onClick={() => window.location.href = "/settings"} style={{ marginTop: 'auto' }} className={currentPage === 'settings' ? 'active' : ''}><MdOutlineSettings/><span>Settings</span></div>
          <button onClick={handleLogout}><MdLogout/><span>Log out</span></button>
        </div>
      </div>

      <div className='navigation-mobile'>
        <Image src={logoImage} onClick={() => window.location.href = '/dashboard'} alt="Register" className='logo'></Image>

          {!open ? (
            <MdMenu onClick={() => setOpen(!open)}/>
          ): (
            <MdClose onClick={() => setOpen(!open)}/>
          )}
      </div>

      {open &&
        <>
          <div className='navigation-mobile-options'>
            <div onClick={() => window.location.href = "/dashboard"} className={currentPage === 'dashboard' ? 'active' : ''}><MdDashboard/><span>Dashboard</span></div>
            <div onClick={() => window.location.href = "/transfer"} className={currentPage === 'transfer' ? 'active' : ''}><MdArrowOutward/><span>Transfer</span></div>
            <div onClick={() => window.location.href = "/payments"} className={currentPage === 'payments' ? 'active' : ''}><LiaMoneyBillWaveAltSolid /><span>Payments</span></div>
            <div onClick={() => window.location.href = "/transactions"} className={currentPage === 'transactions' ? 'active' : ''}><MdCompareArrows/><span>Transactions</span></div>
            <div onClick={() => window.location.href = "/accounts"} className={currentPage === 'accounts' ? 'active' : ''}><MdCreditCard/><span>Accounts</span></div>
            <div onClick={() => window.location.href = "/settings"} style={{ marginTop: 'auto' }} className={currentPage === 'settings' ? 'active' : ''}><MdOutlineSettings/><span>Settings</span></div>
            <button onClick={handleLogout}><MdLogout/><span>Log out</span></button>
          </div>

          <div className="nav-background"></div>
        </>
      }
    </>
  );
}

export default Navigation;
