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
        color: '#64748b', // text-slate-500
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
      backgroundColor: 'rgba(255, 255, 255, 0.95)', // bg-white
      titleColor: '#1e293b', // text-slate-800
      bodyColor: '#475569', // text-slate-600
      borderColor: 'rgba(203, 213, 225, 0.5)', // border-slate-300
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
        color: 'rgba(226, 232, 240, 0.8)', // border-slate-200
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
        color: 'rgba(226, 232, 240, 0.8)', // border-slate-200
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
        color: '#1e293b', // text-slate-800
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: '600' as const,
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
        color: '#1e293b',
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: '600' as const,
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
