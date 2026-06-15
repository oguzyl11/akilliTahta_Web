'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { cn } from '@/utils/helpers';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface BaseChartProps {
  data: ChartData<any>;
  title?: string;
  className?: string;
  height?: number;
}

const commonOptions: ChartOptions<any> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#94a3b8', // text-slate-400
        usePointStyle: true,
        boxWidth: 8,
        padding: 20,
        font: {
          family: "'Inter', sans-serif",
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)', // bg-slate-900
      titleColor: '#f1f5f9', // text-slate-100
      bodyColor: '#cbd5e1', // text-slate-300
      borderColor: 'rgba(99, 102, 241, 0.2)', // border-indigo-500/20
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      boxPadding: 4,
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(51, 65, 85, 0.3)', // border-slate-700/30
        display: false,
      },
      ticks: {
        color: '#64748b', // text-slate-500
        font: {
          family: "'Inter', sans-serif",
          size: 11,
        },
      },
      border: {
        display: false,
      },
    },
    y: {
      grid: {
        color: 'rgba(51, 65, 85, 0.3)', // border-slate-700/30
      },
      ticks: {
        color: '#64748b', // text-slate-500
        font: {
          family: "'Inter', sans-serif",
          size: 11,
        },
      },
      border: {
        display: false,
      },
    },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
};

export function AreaChart({ data, title, className, height = 300 }: BaseChartProps) {
  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: !!title,
        text: title,
        color: '#e2e8f0', // text-slate-200
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: '500' as const,
        },
        padding: { bottom: 20 },
      },
    },
    elements: {
      line: {
        tension: 0.4, // Smooth curves
        borderWidth: 2,
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 2,
      },
    },
  };

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <Line data={data} options={options} />
    </div>
  );
}

export function BarChart({ data, title, className, height = 300 }: BaseChartProps) {
  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: !!title,
        text: title,
        color: '#e2e8f0',
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: '500' as const,
        },
        padding: { bottom: 20 },
      },
    },
    elements: {
      bar: {
        borderRadius: 4,
        borderWidth: 0,
      },
    },
  };

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <Bar data={data} options={options} />
    </div>
  );
}
