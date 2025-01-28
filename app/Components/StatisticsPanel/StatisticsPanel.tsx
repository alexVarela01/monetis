import React, { useEffect, useMemo, useRef } from 'react';
import Chart from 'chart.js/auto';
import './StatisticsPanel.css';


interface StatisticsPanelProps {
  data : { income: number[]; expenses: number[] }
  loading: boolean
}

function StatisticsPanel({ data, loading }: StatisticsPanelProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Memoize labels to avoid re-computation on every render
  const labels = useMemo(() => {
    const days = [] as string[];
    for (let i = 9; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('en-GB')); // Format: day/month/year
    }
    return days;
  }, []); // Dependencies are empty because labels depend only on static dates

  useEffect(() => {
    if (!loading && chartRef.current) {
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
            },
          ],
        },
        options: {
          responsive: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#fff',
              },
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return tooltipItem.raw + '€';
                },
              },
            },
          },
          scales: {
            y: {
              ticks: {
                color: '#fff',
                callback: function (value) {
                  return value + '€';
                },
              },
            },
            x: {
              ticks: {
                color: '#fff',
              },
            },
          },
        },
      });
    }

    // Cleanup on unmount or data change
    return () => {
      chartInstance.current?.destroy();
    };
  }, [loading, data, labels]); // Include only relevant dependencies

  return (
    <div className='statistics'>
      <div className='chart'>
        <h2>Statistics (10 last days)</h2>

        {!loading &&
          <canvas ref={chartRef} height={300}></canvas>
        }
      </div>
    </div>
  );
}

export default StatisticsPanel;
