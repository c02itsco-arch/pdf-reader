import React, { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register the necessary components for a bar chart
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface AssetChartProps {
  data: { [key: string]: number };
}

const AssetChart: React.FC<AssetChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current && data) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;
      
      const labels = Object.keys(data);
      const values = Object.values(data);

      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.6)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'จำนวนทรัพย์สิน',
            data: values,
            backgroundColor: gradient,
            borderColor: 'rgba(96, 165, 250, 1)',
            borderWidth: 1,
            borderRadius: 4,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: '#94a3b8', // slate-400
                precision: 0,
              },
              grid: {
                color: '#334155' // slate-700
              }
            },
            x: {
              ticks: {
                color: '#cbd5e1' // slate-300
              },
              grid: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
                backgroundColor: '#1e293b', // slate-800
                titleFont: { size: 14 },
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 4,
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data]);

  return (
    <div className="bg-slate-900/50 p-4 md:p-6 rounded-lg border border-slate-700 shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-slate-300">สรุปจำนวนทรัพย์สินตามหมวดหมู่</h3>
      <div className="relative h-64 md:h-80">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default AssetChart;
