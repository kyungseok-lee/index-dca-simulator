import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { SimulationResult } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface PortfolioChartProps {
  result: SimulationResult;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ result }) => {
  // 차트 데이터 준비 - 매월 데이터는 너무 많으므로 샘플링
  const sampleData = (data: typeof result.timeline, maxPoints: number = 100) => {
    if (data.length <= maxPoints) return data;

    const step = Math.ceil(data.length / maxPoints);
    const sampled = [];

    for (let i = 0; i < data.length; i += step) {
      sampled.push(data[i]);
    }

    // 마지막 포인트는 항상 포함
    if (sampled[sampled.length - 1] !== data[data.length - 1]) {
      sampled.push(data[data.length - 1]);
    }

    return sampled;
  };

  const chartData = sampleData(result.timeline).map((point) => ({
    date: formatDate(point.date),
    투자금: point.invested,
    평가액: point.value,
    수익: point.value - point.invested,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        포트폴리오 가치 추이
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'currentColor' }}
            className="text-gray-600 dark:text-gray-400"
          />
          <YAxis
            tick={{ fill: 'currentColor' }}
            className="text-gray-600 dark:text-gray-400"
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
            }}
            formatter={(value: number) => formatCurrency(value)}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="투자금"
            stroke="#9333ea"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="평가액"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
