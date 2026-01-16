// 지수 정보
export interface Index {
  symbol: string;
  name: string;
  description: string;
}

// 포트폴리오 비중
export interface Allocation {
  symbol: string;
  percentage: number;
}

// 시뮬레이션 요청
export interface SimulationRequest {
  allocations: Allocation[];
  startDate: string; // ISO 8601 format
  endDate: string;
  monthlyInvestment: number;
  initialInvestment?: number;
}

// 타임라인 포인트
export interface TimelinePoint {
  date: string;
  invested: number;
  value: number;
  return: number;
}

// 지수별 성과
export interface IndexPerformance {
  invested: number;
  value: number;
  shares: number;
}

// 시뮬레이션 결과
export interface SimulationResult {
  summary: {
    totalInvested: number;
    finalValue: number;
    totalReturn: number;
    cagr: number;
    maxDrawdown: number;
  };
  timeline: TimelinePoint[];
  byIndex: Record<string, IndexPerformance>;
}

// Yahoo Finance 데이터 포인트
export interface HistoricalDataPoint {
  date: Date;
  close: number;
}

// DCA 투자 기록
export interface InvestmentRecord {
  date: Date;
  amount: number;
  pricePerShare: number;
  shares: number;
}
