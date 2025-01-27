import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './StatisticsPanel.css';


interface StatisticsPanelProps {
  data : { income: number[]; expenses: number[] }
}

function StatisticsPanel({ data }: StatisticsPanelProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  // labels from last 10 days
  let labels = [];
  for (let i = 9; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    // in day/month/year format
    labels.push(date.toLocaleDateString('en-GB'));
  }

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Destroy existing chart to prevent duplicates
      }

      chartInstance.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Income',
              data: data.income,
              backgroundColor: 'rgba(51, 206, 139, 0.8)',
            },
            {
              label: 'Expenses',
              data: data.expenses,
              backgroundColor: 'rgba(241, 103, 93, 0.8)',
            }
          ]
        },
        options: {
          responsive: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#fff'
              },
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) { 
                  return tooltipItem.raw + '€'; 
                }
              }
            },
          },
          scales: {
            y: {
              ticks: {
                color: '#fff',
                callback: function(value) { return value + '€'; }
              }
            },
            x: {
              ticks: {
                color: '#fff',
              }
            },
          },
        
        },
      });
    }

    return () => {
      chartInstance.current?.destroy();
    };
  }, []);

  return (
    <div className='statistics'>
      <div className='chart'>
        <h2>Statistics (10 last days)</h2>
        <canvas ref={chartRef} height={300}></canvas>
      </div>
    </div>
  );
}

export default StatisticsPanel;
