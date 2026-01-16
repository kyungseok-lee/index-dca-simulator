import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Index, Allocation } from '../types';
import { fetchIndices } from '../services/api';

interface SimulationFormProps {
  onSubmit: (params: {
    allocations: Allocation[];
    startDate: string;
    endDate: string;
    monthlyInvestment: number;
    initialInvestment: number;
  }) => void;
  loading: boolean;
}

export const SimulationForm: React.FC<SimulationFormProps> = ({
  onSubmit,
  loading,
}) => {
  const [indices, setIndices] = useState<Index[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([
    { symbol: '^GSPC', percentage: 60 },
    { symbol: '^NDX', percentage: 40 },
  ]);
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear() - 10, 0, 1)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(500);
  const [initialInvestment, setInitialInvestment] = useState<number>(0);

  useEffect(() => {
    fetchIndices()
      .then(setIndices)
      .catch((err) => console.error('Failed to fetch indices:', err));
  }, []);

  const handleAllocationChange = (index: number, field: 'symbol' | 'percentage', value: string | number) => {
    const newAllocations = [...allocations];
    if (field === 'symbol') {
      newAllocations[index].symbol = value as string;
    } else {
      newAllocations[index].percentage = Number(value);
    }
    setAllocations(newAllocations);
  };

  const addAllocation = () => {
    setAllocations([...allocations, { symbol: '^GSPC', percentage: 0 }]);
  };

  const removeAllocation = (index: number) => {
    if (allocations.length > 1) {
      setAllocations(allocations.filter((_, i) => i !== index));
    }
  };

  const getTotalPercentage = () => {
    return allocations.reduce((sum, alloc) => sum + alloc.percentage, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const total = getTotalPercentage();
    if (Math.abs(total - 100) > 0.01) {
      alert('비중의 합계는 100%여야 합니다.');
      return;
    }

    onSubmit({
      allocations,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      monthlyInvestment,
      initialInvestment,
    });
  };

  const totalPercentage = getTotalPercentage();
  const isValidPercentage = Math.abs(totalPercentage - 100) < 0.01;

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        투자 설정
      </h2>

      {/* 지수 선택 및 비중 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          포트폴리오 구성
        </label>
        {allocations.map((allocation, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <select
              value={allocation.symbol}
              onChange={(e) => handleAllocationChange(index, 'symbol', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {indices.map((idx) => (
                <option key={idx.symbol} value={idx.symbol}>
                  {idx.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={allocation.percentage}
              onChange={(e) => handleAllocationChange(index, 'percentage', e.target.value)}
              min="0"
              max="100"
              step="1"
              className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="%"
            />
            <button
              type="button"
              onClick={() => removeAllocation(index)}
              disabled={allocations.length === 1}
              className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              삭제
            </button>
          </div>
        ))}
        <div className="flex justify-between items-center mt-3">
          <button
            type="button"
            onClick={addAllocation}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            + 지수 추가
          </button>
          <span
            className={`text-sm font-medium ${
              isValidPercentage ? 'text-green-600' : 'text-red-600'
            }`}
          >
            합계: {totalPercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 투자 기간 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            시작일
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => date && setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            종료일
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => date && setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* 투자 금액 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          월 투자 금액 (USD)
        </label>
        <input
          type="number"
          value={monthlyInvestment}
          onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
          min="1"
          step="1"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          초기 투자 금액 (USD, 선택)
        </label>
        <input
          type="number"
          value={initialInvestment}
          onChange={(e) => setInitialInvestment(Number(e.target.value))}
          min="0"
          step="1"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={loading || !isValidPercentage}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '계산 중...' : '시뮬레이션 실행'}
      </button>
    </form>
  );
};
