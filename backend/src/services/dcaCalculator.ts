import { addMonths, isAfter, isBefore, startOfMonth } from 'date-fns';
import {
  SimulationRequest,
  SimulationResult,
  TimelinePoint,
  IndexPerformance,
  HistoricalDataPoint,
} from '../types';
import { YahooFinanceService } from './yahooFinance';

export class DCACalculator {
  private yahooFinance: YahooFinanceService;

  constructor() {
    this.yahooFinance = new YahooFinanceService();
  }

  /**
   * DCA 시뮬레이션 실행
   */
  async simulate(request: SimulationRequest): Promise<SimulationResult> {
    // 입력 검증
    this.validateRequest(request);

    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);

    // 각 지수의 과거 데이터 가져오기
    const historicalDataMap = new Map<string, HistoricalDataPoint[]>();
    for (const allocation of request.allocations) {
      const data = await this.yahooFinance.getHistoricalData(
        allocation.symbol,
        startDate,
        endDate
      );
      historicalDataMap.set(allocation.symbol, data);
    }

    // 월별 투자 시뮬레이션
    const timeline: TimelinePoint[] = [];
    const indexHoldings = new Map<
      string,
      { shares: number; invested: number }
    >();

    // 각 지수 초기화
    for (const allocation of request.allocations) {
      indexHoldings.set(allocation.symbol, { shares: 0, invested: 0 });
    }

    let totalInvested = request.initialInvestment || 0;
    let currentDate = startOfMonth(startDate);

    // 초기 투자 처리
    if (request.initialInvestment && request.initialInvestment > 0) {
      for (const allocation of request.allocations) {
        const investmentAmount =
          (request.initialInvestment * allocation.percentage) / 100;
        const data = historicalDataMap.get(allocation.symbol)!;
        const price = this.yahooFinance.getClosestPrice(data, currentDate);

        if (price) {
          const holding = indexHoldings.get(allocation.symbol)!;
          holding.shares += investmentAmount / price;
          holding.invested += investmentAmount;
        }
      }
    }

    // 월별 투자
    while (isBefore(currentDate, endDate) || currentDate.getTime() === endDate.getTime()) {
      // 월별 투자 실행
      for (const allocation of request.allocations) {
        const investmentAmount =
          (request.monthlyInvestment * allocation.percentage) / 100;
        const data = historicalDataMap.get(allocation.symbol)!;
        const price = this.yahooFinance.getClosestPrice(data, currentDate);

        if (price) {
          const holding = indexHoldings.get(allocation.symbol)!;
          holding.shares += investmentAmount / price;
          holding.invested += investmentAmount;
        }
      }

      totalInvested += request.monthlyInvestment;

      // 현재 포트폴리오 가치 계산
      let currentValue = 0;
      for (const allocation of request.allocations) {
        const data = historicalDataMap.get(allocation.symbol)!;
        const price = this.yahooFinance.getClosestPrice(data, currentDate);
        const holding = indexHoldings.get(allocation.symbol)!;

        if (price) {
          currentValue += holding.shares * price;
        }
      }

      // 타임라인 포인트 추가
      const returnValue = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0;
      timeline.push({
        date: currentDate.toISOString(),
        invested: totalInvested,
        value: currentValue,
        return: returnValue,
      });

      // 다음 달로
      currentDate = addMonths(currentDate, 1);
    }

    // 최종 값 계산
    const finalValue = timeline[timeline.length - 1]?.value || 0;
    const totalReturn = totalInvested > 0 ? ((finalValue - totalInvested) / totalInvested) * 100 : 0;

    // CAGR 계산 (연평균 복리 수익률)
    const years =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    const cagr = years > 0 ? (Math.pow(finalValue / totalInvested, 1 / years) - 1) * 100 : 0;

    // MDD 계산 (최대 낙폭)
    const maxDrawdown = this.calculateMaxDrawdown(timeline);

    // 지수별 성과
    const byIndex: Record<string, IndexPerformance> = {};
    for (const allocation of request.allocations) {
      const holding = indexHoldings.get(allocation.symbol)!;
      const data = historicalDataMap.get(allocation.symbol)!;
      const finalPrice = this.yahooFinance.getClosestPrice(data, endDate);

      byIndex[allocation.symbol] = {
        invested: holding.invested,
        value: finalPrice ? holding.shares * finalPrice : 0,
        shares: holding.shares,
      };
    }

    return {
      summary: {
        totalInvested,
        finalValue,
        totalReturn,
        cagr,
        maxDrawdown,
      },
      timeline,
      byIndex,
    };
  }

  /**
   * 최대 낙폭(MDD) 계산
   */
  private calculateMaxDrawdown(timeline: TimelinePoint[]): number {
    let maxDrawdown = 0;
    let peak = 0;

    for (const point of timeline) {
      if (point.value > peak) {
        peak = point.value;
      }

      const drawdown = peak > 0 ? ((peak - point.value) / peak) * 100 : 0;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return maxDrawdown;
  }

  /**
   * 요청 검증
   */
  private validateRequest(request: SimulationRequest): void {
    // 비중 합계 검증
    const totalPercentage = request.allocations.reduce(
      (sum, alloc) => sum + alloc.percentage,
      0
    );

    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new Error('Total allocation percentage must equal 100%');
    }

    // 날짜 검증
    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);

    if (isAfter(startDate, endDate)) {
      throw new Error('Start date must be before end date');
    }

    // 투자 금액 검증
    if (request.monthlyInvestment <= 0) {
      throw new Error('Monthly investment must be greater than 0');
    }
  }
}
