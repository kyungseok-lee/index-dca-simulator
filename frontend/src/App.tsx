import { useState } from 'react';
import { SimulationForm } from './components/SimulationForm';
import { SimulationResults } from './components/SimulationResults';
import { PortfolioChart } from './components/PortfolioChart';
import { SimulationResult } from './types';
import { runSimulation } from './services/api';

function App() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulation = async (params: {
    allocations: { symbol: string; percentage: number }[];
    startDate: string;
    endDate: string;
    monthlyInvestment: number;
    initialInvestment: number;
  }) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const simulationResult = await runSimulation(params);
      setResult(simulationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : '시뮬레이션 실패');
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              📊 Index Fund DCA Simulator
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              지수 투자 적립식 투자 시뮬레이터
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-1">
            <SimulationForm onSubmit={handleSimulation} loading={loading} />
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-2">
            {loading && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  시뮬레이션 계산 중...
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
                  오류 발생
                </h3>
                <p className="text-red-600 dark:text-red-300">{error}</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6">
                <SimulationResults result={result} />
                <PortfolioChart result={result} />
              </div>
            )}

            {!result && !loading && !error && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  시뮬레이션을 시작하세요
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  왼쪽 패널에서 포트폴리오 구성과 투자 조건을 설정한 후
                  <br />
                  시뮬레이션을 실행해보세요.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            ⚠️ <strong>면책 조항:</strong> 이 시뮬레이터는 교육 목적으로만
            제공됩니다. 과거 성과가 미래 수익을 보장하지 않으며, 실제 투자
            조언이 아닙니다. 투자 결정 전 전문가와 상담하시기 바랍니다.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Index Fund DCA Simulator - Built with React, TypeScript, and Express
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
