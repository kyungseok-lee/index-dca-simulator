# 📊 Index Fund DCA Simulator

지수 투자 적립식 투자(Dollar Cost Averaging) 시뮬레이터

## 개요

S&P 500, NASDAQ 100 등 주요 지수에 대한 적립식 투자 전략을 시뮬레이션하고, 포트폴리오 비중에 따른 과거 성과를 분석할 수 있는 웹 기반 도구입니다.

## 주요 기능

- ✅ 다양한 지수 선택 및 비중 설정 (S&P 500, NASDAQ 100, Dow Jones, etc.)
- ✅ 과거 데이터 기반 DCA 투자 시뮬레이션
- ✅ 투자 성과 지표 계산 (총 수익률, CAGR, MDD)
- ✅ 시각적 차트로 포트폴리오 가치 추이 확인
- ✅ 지수별 성과 분석

## 기술 스택

### 백엔드
- Node.js + Express.js
- TypeScript
- Yahoo Finance API (실시간 주가 데이터)
- date-fns (날짜 처리)

### 프론트엔드
- React 18 + TypeScript
- Vite (빌드 도구)
- Tailwind CSS (스타일링)
- Recharts (차트 라이브러리)
- react-datepicker (날짜 선택)

## 설치 및 실행

### 필수 요구사항
- Node.js 18 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd index-dca-simulator

# 의존성 설치
npm install
```

### 개발 모드 실행

```bash
# 백엔드와 프론트엔드를 동시에 실행
npm run dev

# 또는 개별 실행
npm run dev:backend  # 백엔드만 실행 (포트 5000)
npm run dev:frontend # 프론트엔드만 실행 (포트 3000)
```

### 프로덕션 빌드

```bash
# 빌드
npm run build

# 실행
npm start
```

## 프로젝트 구조

```
index-dca-simulator/
├── backend/                 # Express.js 백엔드
│   ├── src/
│   │   ├── routes/         # API 라우트
│   │   ├── services/       # 비즈니스 로직
│   │   │   ├── yahooFinance.ts  # 주가 데이터 수집
│   │   │   └── dcaCalculator.ts # DCA 계산 엔진
│   │   ├── types/          # TypeScript 타입 정의
│   │   └── index.ts        # 서버 진입점
│   └── package.json
│
├── frontend/               # React 프론트엔드
│   ├── src/
│   │   ├── components/    # React 컴포넌트
│   │   │   ├── SimulationForm.tsx
│   │   │   ├── SimulationResults.tsx
│   │   │   └── PortfolioChart.tsx
│   │   ├── services/      # API 클라이언트
│   │   ├── types/         # TypeScript 타입
│   │   ├── utils/         # 유틸리티 함수
│   │   ├── App.tsx        # 메인 앱 컴포넌트
│   │   └── main.tsx       # 앱 진입점
│   └── package.json
│
├── PRD.md                 # 제품 요구사항 문서
├── package.json           # 루트 package.json
└── README.md
```

## API 엔드포인트

### GET /api/indices
지원하는 지수 목록 조회

**응답 예시:**
```json
{
  "indices": [
    {
      "symbol": "^GSPC",
      "name": "S&P 500",
      "description": "미국 대형주 500개 기업"
    }
  ]
}
```

### POST /api/simulate
DCA 시뮬레이션 실행

**요청 예시:**
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

**응답 예시:**
```json
{
  "summary": {
    "totalInvested": 60000,
    "finalValue": 120000,
    "totalReturn": 100.0,
    "cagr": 7.2,
    "maxDrawdown": 15.5
  },
  "timeline": [...],
  "byIndex": {...}
}
```

### GET /api/health
헬스체크

## 사용 방법

1. **포트폴리오 구성**: 투자할 지수와 비중을 설정합니다 (합계 100%)
2. **투자 기간 설정**: 시작 날짜와 종료 날짜를 선택합니다
3. **투자 금액 입력**: 월 투자 금액과 초기 투자 금액(선택)을 입력합니다
4. **시뮬레이션 실행**: "시뮬레이션 실행" 버튼을 클릭합니다
5. **결과 확인**: 투자 성과 지표, 차트, 지수별 성과를 확인합니다

## 성과 지표 설명

- **총 투자 금액**: 기간 동안 투자한 총 금액
- **최종 평가액**: 시뮬레이션 종료 시점의 포트폴리오 가치
- **총 수익률**: (최종 평가액 - 총 투자 금액) / 총 투자 금액 × 100
- **CAGR** (연평균 복리 수익률): 복리 기준 연평균 수익률
- **MDD** (최대 낙폭): 최고점 대비 최대 하락폭

## 제약사항

- 과거 데이터만 사용 (미래 예측 없음)
- 거래 수수료 미고려
- 세금 미고려
- 배당금 재투자 미고려

## 면책 조항

⚠️ 이 시뮬레이터는 **교육 목적**으로만 제공됩니다. 과거 성과가 미래 수익을 보장하지 않으며, 실제 투자 조언이 아닙니다. 투자 결정 전 전문가와 상담하시기 바랍니다.

## 라이선스

MIT License

## 기여

이슈와 풀 리퀘스트를 환영합니다!

## 향후 개선 사항

- [ ] 더 많은 지수 추가 (국제 지수, 섹터 ETF)
- [ ] 배당금 재투자 옵션
- [ ] 리밸런싱 전략
- [ ] 포트폴리오 저장 및 비교
- [ ] PDF 리포트 생성
