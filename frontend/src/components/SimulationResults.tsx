import React from 'react';
import { SimulationResult } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface SimulationResultsProps {
  result: SimulationResult;
}

export const SimulationResults: React.FC<SimulationResultsProps> = ({
  result,
}) => {
  const { summary, byIndex } = result;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        시뮬레이션 결과
      </h2>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            총 투자 금액
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(summary.totalInvested)}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            최종 평가액
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(summary.finalValue)}
          </p>
        </div>

        <div
          className={`rounded-lg p-4 ${
            summary.totalReturn >= 0
              ? 'bg-green-50 dark:bg-green-900/20'
              : 'bg-red-50 dark:bg-red-900/20'
          }`}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            총 수익률
          </p>
          <p
            className={`text-2xl font-bold ${
              summary.totalReturn >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {formatPercentage(summary.totalReturn)}
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            연평균 수익률 (CAGR)
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatPercentage(summary.cagr)}
          </p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            최대 낙폭 (MDD)
          </p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            -{formatPercentage(summary.maxDrawdown)}
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            총 수익 금액
          </p>
          <p
            className={`text-2xl font-bold ${
              summary.finalValue - summary.totalInvested >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {formatCurrency(summary.finalValue - summary.totalInvested)}
          </p>
        </div>
      </div>

      {/* 지수별 성과 */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          지수별 성과
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  지수
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  투자 금액
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  평가액
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  수익률
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  보유 주식 수
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(byIndex).map(([symbol, performance]) => {
                const returnPct =
                  performance.invested > 0
                    ? ((performance.value - performance.invested) /
                        performance.invested) *
                      100
                    : 0;

                return (
                  <tr key={symbol}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                      {formatCurrency(performance.invested)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                      {formatCurrency(performance.value)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                        returnPct >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {formatPercentage(returnPct)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                      {performance.shares.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
