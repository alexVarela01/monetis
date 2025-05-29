import React, { useState } from 'react';
import Image from 'next/image';
import './HomeNavigation.css';
import logoImage from '@/public/Logo.png';
import { MdMenu } from 'react-icons/md';

function HomeNavigation() {
  const [open, setOpen] = useState(false);
  return (
    <div className='home-navigation'>
      <Image src={logoImage} onClick={() => window.location.href = '/'} alt="Register" className='logo-home'></Image>
      <MdMenu className='menu' onClick={() => setOpen(!open)}/>

      <div className={'options ' + (!open ? 'mobile-close' : '')}>
        {/* TO BREAK: Currently changed redirects */}
        {/* <div onClick={() => window.location.href = "/about"}><span>About</span></div>
        <div onClick={() => window.location.href = "/documentation"}><span>Documentation</span></div>
        <div onClick={() => window.location.href = "/terms"}><span>Terms</span></div> */}
        <div onClick={() => window.location.href = "/documentation"}><span>About</span></div>
        <div onClick={() => window.location.href = "/terms"}><span>Documentation</span></div>
        <div onClick={() => window.location.href = "/about"}><span>Terms</span></div>
        <div onClick={() => window.location.href = "/login"} className='get-started'><span>Get Started</span></div>
      </div>
    </div>
  );
}

export default HomeNavigation;
