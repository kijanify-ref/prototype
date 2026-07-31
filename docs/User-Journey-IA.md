# User Journey · IA

## 역할

| 역할 | 주요 디바이스 | 핵심 업무 |
|------|---------------|-----------|
| **현장 조사원** | 모바일 | GPS 필지 수집 · 단계별 조사 입력 · 사진 · 오프라인 저장 |
| **검수 관리자** | 웹 | 필수값/GPS/사진 검증 · 승인·반려 |
| **ESG/탄소 담당** | 웹 | 토지이용·탄소 산정 · DDS/EUDR · 공급망 추적 |
| **운영 관리자** | 웹 | 현황 KPI · 마스터(생산자·재배지) |

---

## 시연 여정 (현장 → 규제)

```text
[1] 현황              관리자 KPI·알림                 (/)
[2] 조사원 현장        배정 조사·오프라인 상태         (/field)
[3] GPS 필지           불규칙 폴리곤 수집              (/field/gps)
[4] 현장 조사서        단계 입력·검증                  (/field/survey/…)
[5] 검수·승인          필수값·GPS·사진 검수            (/surveys)
[6] 토지이용·5년       위성·황폐화·LUC                 (/land-use)
[7] 탄소               운영+LUC 로트·계수              (/carbon)
[8] EUDR·DDS           컷오프·위성 비교·체크리스트     (/eudr)
[9] 공급망             생산–가공–운송 추적             (/supply-chain)
```

마스터(병행): `/producers` · `/farms` · `/farms/[id]`

---

## 화면 맵

```text
관리자 Web
 ├─ / 현황
 ├─ /surveys 검수·승인
 ├─ /land-use 토지이용·5년
 ├─ /carbon · /eudr · /supply-chain
 └─ /producers · /farms · /farms/[id]

조사원 Mobile (시연 프레임)
 ├─ /field
 ├─ /field/gps
 └─ /field/survey/[id]
```

화면별 UI 표: [UI-현황-전달서.md](./UI-현황-전달서.md)

---

## GPS · 토지이용 · EUDR 데이터 흐름

```text
현장 도착 GPS 확인
  → 경계점 P1…Pn 수집 (정확도·폐합)
  → 폴리곤 면적 산출 vs 신고 면적
  → 위성 5년(2021–2025) 피복·캐노피·황폐화 ha
  → 컷오프(2020-12-31) 이후 Δforest를 핵심 위험지표로 확인
  → LUC CO₂e (시연 산식) → 탄소 로트에 합산
  → DDS geolocation · 삼림전용 증빙·체크리스트 연계
```

시연용 위험 상태 표시이며, 법규 준수 확정이 아닙니다.  
산정 상세: [탄소-LUC-산정.md](./탄소-LUC-산정.md)  
시연 이미지: `web/public/evidence/`
