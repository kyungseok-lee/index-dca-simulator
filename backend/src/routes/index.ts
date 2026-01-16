import { Router, Request, Response } from 'express';
import { Index, SimulationRequest } from '../types';
import { DCACalculator } from '../services/dcaCalculator';

const router = Router();
const dcaCalculator = new DCACalculator();

// 지원하는 지수 목록
const SUPPORTED_INDICES: Index[] = [
  {
    symbol: '^GSPC',
    name: 'S&P 500',
    description: '미국 대형주 500개 기업',
  },
  {
    symbol: '^NDX',
    name: 'NASDAQ 100',
    description: '나스닥 상위 100개 기업',
  },
  {
    symbol: '^DJI',
    name: 'Dow Jones Industrial Average',
    description: '다우존스 산업평균지수 30개 기업',
  },
  {
    symbol: '^IXIC',
    name: 'NASDAQ Composite',
    description: '나스닥 종합지수',
  },
  {
    symbol: '^RUT',
    name: 'Russell 2000',
    description: '미국 소형주 2000개 기업',
  },
];

/**
 * GET /api/indices
 * 지원하는 지수 목록 조회
 */
router.get('/indices', (req: Request, res: Response) => {
  res.json({
    indices: SUPPORTED_INDICES,
  });
});

/**
 * POST /api/simulate
 * DCA 시뮬레이션 실행
 */
router.post('/simulate', async (req: Request, res: Response) => {
  try {
    const simulationRequest: SimulationRequest = req.body;

    // 요청 검증
    if (!simulationRequest.allocations || simulationRequest.allocations.length === 0) {
      return res.status(400).json({
        error: 'Allocations are required',
      });
    }

    if (!simulationRequest.startDate || !simulationRequest.endDate) {
      return res.status(400).json({
        error: 'Start date and end date are required',
      });
    }

    if (!simulationRequest.monthlyInvestment || simulationRequest.monthlyInvestment <= 0) {
      return res.status(400).json({
        error: 'Monthly investment must be greater than 0',
      });
    }

    // 시뮬레이션 실행
    const result = await dcaCalculator.simulate(simulationRequest);

    res.json(result);
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

/**
 * GET /api/health
 * 헬스체크
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
