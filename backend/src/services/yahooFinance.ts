import fetch from 'node-fetch';
import { HistoricalDataPoint } from '../types';

interface YahooFinanceResponse {
  chart: {
    result: Array<{
      timestamp: number[];
      indicators: {
        quote: Array<{
          close: number[];
        }>;
      };
    }>;
    error: any;
  };
}

/**
 * Yahoo Finance에서 과거 주가 데이터를 가져옵니다
 */
export class YahooFinanceService {
  private cache: Map<string, HistoricalDataPoint[]> = new Map();

  /**
   * 지정된 기간의 일별 종가 데이터를 가져옵니다
   */
  async getHistoricalData(
    symbol: string,
    startDate: Date,
    endDate: Date
  ): Promise<HistoricalDataPoint[]> {
    const cacheKey = `${symbol}_${startDate.getTime()}_${endDate.getTime()}`;

    // 캐시 확인
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const period1 = Math.floor(startDate.getTime() / 1000);
    const period2 = Math.floor(endDate.getTime() / 1000);

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=1d`;

    try {
      const response = await fetch(url);
      const data = (await response.json()) as YahooFinanceResponse;

      if (data.chart.error) {
        throw new Error(`Yahoo Finance API Error: ${data.chart.error}`);
      }

      const result = data.chart.result[0];
      if (!result || !result.timestamp || !result.indicators.quote[0].close) {
        throw new Error('Invalid data format from Yahoo Finance');
      }

      const timestamps = result.timestamp;
      const closes = result.indicators.quote[0].close;

      const historicalData: HistoricalDataPoint[] = timestamps
        .map((timestamp, index) => {
          const close = closes[index];
          // null 값 필터링
          if (close === null || close === undefined) {
            return null;
          }
          return {
            date: new Date(timestamp * 1000),
            close: close,
          };
        })
        .filter((point): point is HistoricalDataPoint => point !== null);

      // 캐시에 저장
      this.cache.set(cacheKey, historicalData);

      return historicalData;
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      throw new Error(`Failed to fetch historical data for ${symbol}`);
    }
  }

  /**
   * 특정 날짜의 종가를 가져옵니다 (가장 가까운 거래일 기준)
   */
  getClosestPrice(data: HistoricalDataPoint[], targetDate: Date): number | null {
    if (data.length === 0) return null;

    // 이진 탐색으로 가장 가까운 날짜 찾기
    let closest = data[0];
    let minDiff = Math.abs(targetDate.getTime() - data[0].date.getTime());

    for (const point of data) {
      const diff = Math.abs(targetDate.getTime() - point.date.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closest = point;
      }
    }

    return closest.close;
  }

  /**
   * 캐시 클리어
   */
  clearCache(): void {
    this.cache.clear();
  }
}
