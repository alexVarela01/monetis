import React from 'react';
import Image from 'next/image';
import './HomeNavigation.css';
import logoImage from '@/public/Logo.png';

function HomeNavigation() {
  return (
    <div className='home-navigation'>
      <Image src={logoImage} onClick={() => window.location.href = '/'} alt="Register" className='logo-home'></Image>

      <div className='options'>
        <div onClick={() => window.location.href = "/about"}><span>About</span></div>
        <div onClick={() => window.location.href = "/terms"}><span>Terms</span></div>
        <div onClick={() => window.location.href = "/login"} className='get-started'><span>Get Started</span></div>
      </div>
    </div>
  );
}

export default HomeNavigation;
