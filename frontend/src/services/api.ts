import { Index, SimulationRequest, SimulationResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * 지원하는 지수 목록 조회
 */
export async function fetchIndices(): Promise<Index[]> {
  const response = await fetch(`${API_BASE_URL}/indices`);
  if (!response.ok) {
    throw new Error('Failed to fetch indices');
  }
  const data = await response.json();
  return data.indices;
}

/**
 * DCA 시뮬레이션 실행
 */
export async function runSimulation(
  request: SimulationRequest
): Promise<SimulationResult> {
  const response = await fetch(`${API_BASE_URL}/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Simulation failed');
  }

  return response.json();
}
