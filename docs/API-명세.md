# API 명세 (프로토타입)

UI는 클라이언트 mock 사용. 실연동 시 개념 API:

| Method | Path | 설명 |
|--------|------|------|
| GET | `/producers` | 생산자 목록 |
| GET | `/farms?producerId=` | 재배지·GPS |
| GET | `/surveys` | 조사 목록·상태 |
| POST | `/surveys/{id}/approve` | 승인 |
| POST | `/carbon/calculate` | 배출량 산정 |
| GET | `/carbon/lots/{id}` | LOT 결과 |
| POST | `/dds/generate` | DDS 생성 |
| GET | `/eudr/checklist/{lotId}` | EUDR 체크 |
| GET | `/supply-chain/{lotId}` | 공급망 단계 |
| GET | `/ops/summary` | 대시보드 KPI |
