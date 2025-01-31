import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import accountBackground from '@/public/account_background.svg';
import { TbExternalLink } from "react-icons/tb";
import Chart from 'chart.js/auto';
import './AccountCard.css';
import { FaArrowRight, FaCopy } from "react-icons/fa";
import { formatBalance } from '@/app/utils/helpers';
import { AiOutlineBank , AiOutlineUser, AiOutlineInfoCircle, AiOutlineDollar  } from "react-icons/ai";

interface AccountCardProps {
  accountName: string;
  balance: number;
  colorKey: number;
  fillPercent: number;
  accountId: number;

  iban?: string;
  accountHolder?: string;
  handleToast?: (message: string) => void;
  cardDetails?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const accountColors = [
  '33, 110, 247',  // Blue
  '51, 206, 139',  // Green
  '254, 192, 102', // Yellow-Orange
  '241, 103, 93',  // Red
  '153, 102, 255', // Purple
  '255, 153, 204', // Pink
  '102, 217, 239', // Cyan
  '255, 128, 0',   // Deep Orange
];


function AccountCard({ accountName, balance, colorKey, fillPercent, iban, accountHolder, handleToast, accountId, cardDetails, createdAt, updatedAt }: AccountCardProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Destroy existing chart to prevent duplicates
      }

      chartInstance.current = new Chart(chartRef.current, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: [100 - fillPercent, fillPercent],
              backgroundColor: ['rgba(255,255,255,0.2)', `rgba(${accountColors[colorKey]}, 1)`],
              borderWidth: 0,
            },
          ],
        },
      });
    }

    return () => {
      chartInstance.current?.destroy();
    };
  }, [balance, fillPercent, colorKey]);

  function formatIban(iban: string) {
    return "PT50 " + iban.slice(0, 4) + ' ' + iban.slice(4, 8) + ' ' + iban.slice(8, 12) + ' ' + iban.slice(12, 16) + ' ' + iban.slice(16, 20) + ' ' + iban.slice(20, 21);
  }

  function formatDate(date: string) {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}.${month}.${year}`;
  }

  function copyToClipboard(iban: string) {
    navigator.clipboard.writeText(iban)

    if (handleToast){
      handleToast("IBAN copied to clipboard!");
    }
  }

  return (
    <>
      <div className='account' onClick={iban ? undefined : () => window.location.href = `/accounts/${accountId}`}>
        <h2>{accountName}</h2>
        <p>{formatBalance(balance)} €</p>

        <div className='backgroundGradient' style={{ "--background-color": accountColors[colorKey] } as React.CSSProperties}>
          <div className='background'>
            <Image src={accountBackground} alt='Account background' />
          </div>
        </div>

        <div className='chart'>
          <canvas ref={chartRef}></canvas>
          <div className='fillPercent'>

            {fillPercent >= 0 &&
              <span style={{ "--background-color": accountColors[colorKey] } as React.CSSProperties}>{fillPercent.toFixed(0)}%</span>
            }

            {cardDetails &&
              <div className='balanceDistribution' style={{ "--background-color": accountColors[colorKey] } as React.CSSProperties}>Balance <br />Distribution</div>
            }
          </div>
        </div>

        {iban && accountHolder && !cardDetails ? (
            <>
              <div className='seeAccoutDetails' onClick={() => window.location.href = `/accounts/${accountId}`}>
                <p>See details</p>
                <FaArrowRight />
              </div>
              {iban && <p className='iban'>{formatIban(iban)} <button className='copyButton' onClick={() => copyToClipboard(iban)}><FaCopy /></button></p>}
              {accountHolder && <p className='accountHolder'>{accountHolder}</p>}
            </>
          ) : (
            <>
              {!cardDetails &&
                <TbExternalLink className='hyperlink' />
              }
            </>
          )}
      </div>

      {cardDetails &&
        <div className='info'>
          <div className='info-item' style={{ "--background-color": accountColors[colorKey] } as React.CSSProperties}><AiOutlineBank /><span>Account holder</span> {accountHolder}</div>
          <div className='info-item' style={{ "--background-color": accountColors[colorKey] } as React.CSSProperties}><AiOutlineUser/><span>IBAN</span> <div>{formatIban(iban as string)} <button className='copyButton' onClick={() => copyToClipboard(iban as string)}><FaCopy /></button></div></div>
          <div className='info-item' style={{ "--background-color": accountColors[colorKey] } as React.CSSProperties}><AiOutlineInfoCircle/><span>Created at</span> {formatDate(createdAt as string)}</div>
          <div className='info-item' style={{ "--background-color": accountColors[colorKey] } as React.CSSProperties}><AiOutlineDollar/><span>Last transaction</span> {formatDate(updatedAt as string)}</div>
        </div>
      }
    </>
  );
}

export default AccountCard;
