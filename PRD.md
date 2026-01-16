# PRD: Index Fund DCA Simulator
## 지수 투자 적립식 투자 시뮬레이터

**Version:** 1.0
**Date:** 2026-01-16
**Status:** Draft

---

## 1. 개요 (Overview)

### 1.1 목적
투자자들이 S&P 500, NASDAQ 100 등 주요 지수에 대한 적립식 투자(Dollar Cost Averaging, DCA) 전략을 시뮬레이션하고, 포트폴리오 비중에 따른 과거 성과를 분석할 수 있는 웹 기반 시뮬레이터를 제공합니다.

### 1.2 목표
- 과거 데이터 기반 DCA 투자 시뮬레이션
- 여러 지수의 비중 조합 테스트
- 투자 결과를 시각적으로 표현
- 투자 전략 비교 및 분석

---

## 2. 핵심 기능 (Core Features)

### 2.1 지수 선택 및 비중 설정
- **지원 지수:**
  - S&P 500 (^GSPC)
  - NASDAQ 100 (^NDX)
  - Dow Jones Industrial Average (^DJI)
  - 추가 확장 가능

- **기능:**
  - 각 지수별 투자 비중 설정 (0-100%, 합계 100%)
  - 슬라이더 또는 입력 필드로 비중 조정
  - 실시간 비중 합계 검증

### 2.2 투자 파라미터 설정
- **투자 기간:**
  - 시작 날짜 선택
  - 종료 날짜 선택 (기본: 현재)
  - 최소 1년, 최대 30년

- **투자 금액:**
  - 월 투자 금액 설정 (예: $100 ~ $10,000)
  - 초기 투자 금액 (선택사항)

- **투자 주기:**
  - 월별 (기본)
  - 주별 (선택사항)

### 2.3 시뮬레이션 계산
- **DCA 계산 로직:**
  - 설정된 주기마다 정해진 금액 투자
  - 각 지수별 비중에 따라 금액 분배
  - 해당 시점의 지수 가격으로 주식 수 계산
  - 누적 주식 수 및 평가액 계산

- **성과 지표:**
  - 총 투자 금액
  - 현재 평가액
  - 총 수익률 (%)
  - 연평균 수익률 (CAGR)
  - 최대 낙폭 (MDD - Maximum Drawdown)
  - 투자 원금 대비 수익

### 2.4 결과 시각화
- **차트:**
  - 시간에 따른 포트폴리오 가치 변화 (라인 차트)
  - 투자 원금 vs 평가액 비교
  - 각 지수별 기여도 (누적 영역 차트)

- **테이블:**
  - 월별/연도별 투자 내역
  - 각 시점의 평가액 및 수익률

- **요약 카드:**
  - 핵심 성과 지표를 카드 형태로 표시

---

## 3. 기술 스택 (Tech Stack)

### 3.1 프론트엔드
- **Framework:** React.js with TypeScript
- **UI Library:** Tailwind CSS
- **Charts:** Recharts or Chart.js
- **State Management:** React Hooks (useState, useEffect)
- **Date Picker:** react-datepicker

### 3.2 백엔드
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Data Source:** Yahoo Finance API (via node-fetch)

### 3.3 데이터
- **Historical Data:** Yahoo Finance
- **Caching:** 메모리 캐싱 (선택적으로 Redis)

---

## 4. 사용자 시나리오 (User Scenarios)

### 4.1 기본 시나리오
1. 사용자가 웹사이트 접속
2. S&P 500 70%, NASDAQ 100 30% 비중 설정
3. 2015-01-01부터 2025-01-01까지 기간 선택
4. 월 $500 투자 금액 입력
5. "시뮬레이션 실행" 버튼 클릭
6. 결과 확인:
   - 총 투자: $60,000
   - 평가액: $120,000 (예시)
   - 수익률: 100%
   - 차트로 성장 추이 확인

### 4.2 비교 시나리오
1. 여러 포트폴리오 조합을 저장
2. 동일 조건에서 다른 비중 테스트
3. 결과를 나란히 비교

---

## 5. API 설계 (API Design)

### 5.1 엔드포인트

#### GET /api/indices
지원하는 지수 목록 조회
```json
{
  "indices": [
    {
      "symbol": "^GSPC",
      "name": "S&P 500",
      "description": "미국 대형주 500개 기업"
    },
    {
      "symbol": "^NDX",
      "name": "NASDAQ 100",
      "description": "나스닥 상위 100개 기업"
    }
  ]
}
```

#### POST /api/simulate
DCA 시뮬레이션 실행

**Request:**
```json
{
  "allocations": [
    { "symbol": "^GSPC", "percentage": 70 },
    { "symbol": "^NDX", "percentage": 30 }
  ],
  "startDate": "2015-01-01",
  "endDate": "2025-01-01",
  "monthlyInvestment": 500,
  "initialInvestment": 0
}
```

**Response:**
```json
{
  "summary": {
    "totalInvested": 60000,
    "finalValue": 120000,
    "totalReturn": 100.0,
    "cagr": 7.2,
    "maxDrawdown": -15.5
  },
  "timeline": [
    {
      "date": "2015-01-01",
      "invested": 500,
      "value": 500,
      "return": 0
    },
    ...
  ],
  "byIndex": {
    "^GSPC": {
      "invested": 42000,
      "value": 84000,
      "shares": 150.5
    },
    "^NDX": {
      "invested": 18000,
      "value": 36000,
      "shares": 45.2
    }
  }
}
```

---

## 6. 데이터 모델 (Data Models)

### 6.1 Index
```typescript
interface Index {
  symbol: string;        // "^GSPC"
  name: string;          // "S&P 500"
  description: string;   // "미국 대형주 500개 기업"
}
```

### 6.2 Allocation
```typescript
interface Allocation {
  symbol: string;        // 지수 심볼
  percentage: number;    // 0-100
}
```

### 6.3 SimulationRequest
```typescript
interface SimulationRequest {
  allocations: Allocation[];
  startDate: string;           // ISO 8601
  endDate: string;             // ISO 8601
  monthlyInvestment: number;   // USD
  initialInvestment?: number;  // USD (optional)
}
```

### 6.4 SimulationResult
```typescript
interface SimulationResult {
  summary: {
    totalInvested: number;
    finalValue: number;
    totalReturn: number;      // %
    cagr: number;             // %
    maxDrawdown: number;      // %
  };
  timeline: TimelinePoint[];
  byIndex: Record<string, IndexPerformance>;
}
```

---

## 7. UI/UX 설계 (UI/UX Design)

### 7.1 레이아웃
```
┌─────────────────────────────────────────────┐
│            Header / Title                    │
├─────────────────────────────────────────────┤
│  [설정 패널]              │  [결과 패널]    │
│  - 지수 선택 및 비중       │  - 요약 카드    │
│  - 기간 선택              │  - 차트         │
│  - 투자 금액              │  - 테이블       │
│  [시뮬레이션 실행 버튼]    │                 │
└─────────────────────────────────────────────┘
```

### 7.2 반응형 디자인
- Desktop: 2열 레이아웃 (설정 | 결과)
- Mobile: 1열 레이아웃 (설정 → 결과)

---

## 8. 구현 단계 (Implementation Phases)

### Phase 1: 기본 인프라
- [ ] 프로젝트 초기 설정
- [ ] TypeScript, Express 설정
- [ ] React 프로젝트 생성
- [ ] 기본 폴더 구조

### Phase 2: 백엔드 API
- [ ] Yahoo Finance 데이터 수집 모듈
- [ ] DCA 계산 엔진
- [ ] REST API 엔드포인트
- [ ] 데이터 캐싱

### Phase 3: 프론트엔드 UI
- [ ] 입력 폼 컴포넌트
- [ ] 결과 표시 컴포넌트
- [ ] API 통합
- [ ] 상태 관리

### Phase 4: 시각화
- [ ] 차트 라이브러리 통합
- [ ] 포트폴리오 가치 차트
- [ ] 비중별 성과 차트
- [ ] 반응형 차트

### Phase 5: 테스트 및 배포
- [ ] 단위 테스트
- [ ] 통합 테스트
- [ ] 성능 최적화
- [ ] 문서화

---

## 9. 비기능적 요구사항 (Non-functional Requirements)

### 9.1 성능
- API 응답 시간: < 2초 (10년 데이터 기준)
- 프론트엔드 초기 로딩: < 3초

### 9.2 확장성
- 새로운 지수 추가 용이
- 다양한 투자 주기 지원 가능

### 9.3 사용성
- 직관적인 UI
- 명확한 에러 메시지
- 입력 값 검증

### 9.4 보안
- API Rate Limiting
- 입력 값 sanitization

---

## 10. 제약사항 및 고려사항

### 10.1 제약사항
- 과거 데이터만 사용 (미래 예측 없음)
- 거래 수수료 미고려 (추후 옵션 추가 가능)
- 세금 미고려
- 배당금 재투자 미고려 (추후 추가 가능)

### 10.2 데이터 제한
- Yahoo Finance API 무료 버전 사용
- 일일 데이터만 사용 (실시간 데이터 없음)

### 10.3 면책 조항
- 교육 목적의 시뮬레이터
- 실제 투자 조언 아님
- 과거 성과가 미래 수익을 보장하지 않음

---

## 11. 향후 개선 사항 (Future Enhancements)

- [ ] 더 많은 지수 추가 (국제 지수, 섹터 ETF 등)
- [ ] 배당금 재투자 옵션
- [ ] 리밸런싱 전략
- [ ] 포트폴리오 저장 및 비교
- [ ] 다양한 투자 전략 (일시불 vs DCA)
- [ ] 인플레이션 조정 수익률
- [ ] PDF 리포트 생성
- [ ] 모바일 앱

---

## 12. 성공 지표 (Success Metrics)

- 사용자가 3분 이내에 첫 시뮬레이션 완료
- 정확한 계산 결과 (실제 데이터와 비교)
- 버그 없는 안정적인 서비스
- 긍정적인 사용자 피드백
