import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import './OverallPanel.css';


interface OverallPanelProps {
  type: string;
  category: string;
  amount: number;
  count?: number;
}

function OverallPanel({ data, loading}: { data: OverallPanelProps[], loading: boolean }) {
  const chartExpensesRef = useRef<HTMLCanvasElement | null>(null);
  const chartExpensesInstance = useRef<Chart | null>(null);
  const chartIncomeRef = useRef<HTMLCanvasElement | null>(null);
  const chartIncomeInstance = useRef<Chart | null>(null);
  const [totalExpensesCount, setTotalExpensesCount] = useState<number>(0);

  useEffect(() => {
    setTotalExpensesCount(data.filter((item) => item.type === 'payment').reduce((acc, item) => acc + item.count!, 0));

    if (chartExpensesRef.current) {
      if (chartExpensesInstance.current) {
        chartExpensesInstance.current.destroy(); // Destroy existing chart to prevent duplicates
      }

      chartExpensesInstance.current = new Chart(chartExpensesRef.current, {
        type: 'doughnut',
        data: {
          labels: data.filter((item) => item.type === 'payment').map((item) => item.category ),
          datasets: [
            {
              data: data.filter((item) => item.type === 'payment').map((item) => item.amount),
              borderWidth: 0,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) { 
                  return String(tooltipItem.raw).replace("-", " ")  + '€'; 
                }
              }
            },
          },
        },
      });
    }

    if (chartIncomeRef.current) {
      if (chartIncomeInstance.current) {
        chartIncomeInstance.current.destroy(); // Destroy existing chart to prevent duplicates
      }

      chartIncomeInstance.current = new Chart(chartIncomeRef.current, {
        type: 'doughnut',
        data: {
          labels: data.filter((item) => item.type === 'transfer').map((item) => item.category),
          datasets: [
            {
              data: data.filter((item) => item.type === 'transfer' && item.amount > 0).map((item) => item.amount),
              borderWidth: 0,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) { 
                  return tooltipItem.raw + '€'; 
                }
              }
            },
          },
        },
      });
    }

    return () => {
      chartExpensesInstance.current?.destroy();
      chartIncomeInstance.current?.destroy();
    };
  }, [data]);

  return (
    <div className='overall-panel'>
      <div className='container overview'>
        <h2>Expenses Overview</h2>

        {!loading && 
          <div className='overview-list'>
            {data.filter((item) => item.type === 'payment').toSorted((a, b) => b.count! - a.count!).slice(0, 4).map((item, index) => (
              <div className='overview-item' key={index}>
                <div className='progress'>
                  <div className='progress-bar' style={{ width: `${((item.count ? item.count : 0) / totalExpensesCount) * 100}%` }}>
                    <span className='percentage'>{(((item.count ? item.count : 0) / totalExpensesCount) * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <span className='category'>{item.category}</span>
              </div>
            ))}

            {data.filter((item) => item.type === 'payment').length === 0 &&
             <p className='no-data'>Nothing to display at the moment. <br />We&apos;ll track your expenses here!</p>
            }
          </div>
        }
        
      </div>

      <div className='container chart-container'>
        <h2>Expenses</h2>
        <div className='chart'>
          <canvas ref={chartExpensesRef}></canvas>

          {data.filter((item) => item.type === 'payment').length === 0 &&
            <p className='no-data'>Nothing to display at the moment. <br />We&apos;ll track your expenses here!</p>
          }
        </div>
      </div>

      <div className='container chart-container'>
        <h2>Income</h2>
        <div className='chart'>
          <canvas ref={chartIncomeRef}></canvas>

          {data.filter((item) => item.type === 'transfer').filter((item) => item.amount > 0).length === 0 &&
            <p className='no-data'>Nothing to display at the moment. <br />We&apos;ll track your income here!</p>
          }
        </div>
      </div>
    </div>
  );
}

export default OverallPanel;
