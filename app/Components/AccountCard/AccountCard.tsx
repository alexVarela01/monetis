import React from 'react';
import './AccountCard.css';
import Image from 'next/image';
import accountBackground from '@/public/account_background.svg';
import { TbExternalLink } from "react-icons/tb";

interface AccountCardProps {
  accountName: string;
  balance: number;
  color: string;
}

function AccountCard({ accountName, balance, color }: AccountCardProps) {

  return (
    <div className='account'>
      <TbExternalLink className='hyperlink'/>
      <h2>{accountName}</h2>
      <p>€ {balance}</p>

      <div className='backgroundGradient' style={{ "--background-color": color } as React.CSSProperties}>
        <div className='background'>
          <Image src={accountBackground} alt='Account background' />
        </div>
      </div>
    </div>
  );
}

export default AccountCard;
