import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import accountBackground from '@/public/account_background.svg';
import { TbExternalLink } from "react-icons/tb";
import Chart from 'chart.js/auto';
import './AccountCard.css';

interface AccountCardProps {
  accountName: string;
  balance: number;
  colorKey: number;
  fillPercent: number;
}

const accountColors = [
  '33, 110, 247',
  '51, 206, 139',
  '254, 192, 102',
  '241, 103, 93'
]

function AccountCard({ accountName, balance, colorKey, fillPercent }: AccountCardProps) {
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

  return (
    <div className='account'>
      <TbExternalLink className='hyperlink' />
      <h2>{accountName}</h2>
      <p>{balance.toFixed(2)} €</p>

      <div className='backgroundGradient' style={{ "--background-color": accountColors[colorKey] } as React.CSSProperties}>
        <div className='background'>
          <Image src={accountBackground} alt='Account background' />
        </div>
      </div>

      <div className='chart'>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

export default AccountCard;
