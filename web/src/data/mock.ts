export type SurveyStatus = "신청" | "진행" | "검수" | "승인";
export type ComplianceStatus = "준비중" | "검토중" | "준비완료" | "제출완료";
export type SupplyStageStatus = "완료" | "진행중" | "대기";

export interface Producer {
  id: string;
  name: string;
  country: string;
  region: string;
  cooperativeId: string;
  crop: "coffee" | "cocoa";
  certification: string[];
  registeredAt: string;
  contactRole: string;
}

export interface Farm {
  id: string;
  producerId: string;
  name: string;
  areaHa: number;
  crop: "coffee" | "cocoa";
  gps: { lat: number; lng: number };
  elevationM: number;
  polygonVerified: boolean;
}

export interface Cooperative {
  id: string;
  name: string;
  country: string;
  memberCount: number;
  crops: string[];
}

export interface Survey {
  id: string;
  farmId: string;
  producerId: string;
  type: string;
  status: SurveyStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  inspectorRole: string;
}

export interface CarbonResult {
  lotId: string;
  crop: "coffee" | "cocoa";
  producerId: string;
  farmId: string;
  harvestYear: number;
  quantityKg: number;
  /** 운영 배출 (재배·가공·물류 등) */
  opsCo2eKg: number;
  /** 5년 토지이용변화(LUC) 배분분 */
  lucCo2eKg: number;
  totalCo2eKg: number;
  intensityKgCo2ePerKg: number;
  breakdown: { stage: string; co2eKg: number; sharePct: number }[];
  calculatedAt: string;
  methodologyNote: string;
}

/** 연도별 토지피복·황폐화 스냅샷 (위성 시계열) */
export interface LandUseSnapshot {
  year: number;
  imageSrc: string;
  canopyPct: number;
  forestHa: number;
  agriHa: number;
  degradedHa: number;
  ndvi: number;
}

/** 위성 이미지 위 % 좌표 (좌상단 기준 0–100) */
export interface ImagePctPoint {
  x: number;
  y: number;
}

export interface DegradationHotspot {
  id: string;
  kind: "deforestation" | "degradation";
  label: string;
  areaHa: number;
  /** 이미지상 폴리곤 (% 좌표) */
  points: ImagePctPoint[];
  note: string;
}

export interface LandUseAnalysis {
  farmId: string;
  lotId: string | null;
  areaHa: number;
  cutoffDate: string;
  periodLabel: string;
  series: LandUseSnapshot[];
  /** 컷오프 이후 산림 면적 감소 (ha) — EUDR 핵심 */
  deforestationAfterCutoffHa: number;
  /** 5년 황폐화 면적 변화 (ha, +면 악화) */
  degradationDeltaHa: number;
  canopyDeltaPp: number;
  /** IPCC AFOLU 스타일 시연 산출: ΔC × 44/12 */
  lucGrossCo2eKg: number;
  /** 감가상각 연수 (시연 20년) */
  amortYears: number;
  /** 해당 수확연도 배분 LUC */
  lucAnnualCo2eKg: number;
  eudrDeforestationFree: boolean;
  riskLevel: "low" | "medium" | "high";
  groundImageSrc?: string;
  summary: string;
  /** 필지 경계 (이미지 % 좌표) */
  plotOutlinePct?: ImagePctPoint[];
  /** 연도별 황폐화·산림전용 핫스팟 (이미지 오버레이) */
  hotspotsByYear?: Partial<Record<number, DegradationHotspot[]>>;
}

export interface EmissionFactor {
  id: string;
  category: string;
  item: string;
  unit: string;
  value: number;
  source: string;
}

export interface DdsDocument {
  id: string;
  lotId: string;
  referenceNumber: string;
  status: ComplianceStatus;
  deforestationRisk: "low" | "medium" | "high";
  geolocationVerified: boolean;
  dueDate: string;
  preparedAt: string | null;
}

export interface EudrCompliance {
  lotId: string;
  commodity: string;
  originCountry: string;
  operatorRole: string;
  traceabilityComplete: boolean;
  ddsReady: boolean;
  riskAssessment: "pass" | "review" | "fail";
  checklist: { item: string; done: boolean }[];
}

export interface SupplyChainStage {
  id: string;
  lotId: string;
  order: number;
  name: string;
  location: string;
  actorRole: string;
  status: SupplyStageStatus;
  completedAt: string | null;
  co2eKg: number | null;
}

export interface OpsKpi {
  label: string;
  value: number | string;
  unit?: string;
  trend?: "up" | "down" | "flat";
}

export interface Alert {
  id: string;
  severity: "info" | "warn" | "danger";
  title: string;
  message: string;
  relatedLotId?: string;
  createdAt: string;
}

export const cooperatives: Cooperative[] = [
  {
    id: "coop-eth-01",
    name: "Yirgacheffe Farmers Cooperative Union",
    country: "Ethiopia",
    memberCount: 2840,
    crops: ["Arabica coffee"],
  },
  {
    id: "coop-gha-01",
    name: "Ashanti Cocoa Collective",
    country: "Ghana",
    memberCount: 1120,
    crops: ["Cocoa"],
  },
];

export const producers: Producer[] = [
  {
    id: "prod-001",
    name: "Abebe Tadesse",
    country: "Ethiopia",
    region: "Sidama · Yirgacheffe",
    cooperativeId: "coop-eth-01",
    crop: "coffee",
    certification: ["Organic", "Rainforest Alliance"],
    registeredAt: "2024-03-12",
    contactRole: "생산자 대표",
  },
  {
    id: "prod-002",
    name: "Kofi Mensah",
    country: "Ghana",
    region: "Ashanti",
    cooperativeId: "coop-gha-01",
    crop: "cocoa",
    certification: ["Fair Trade"],
    registeredAt: "2024-06-08",
    contactRole: "농장 관리자",
  },
  {
    id: "prod-003",
    name: "Helen Worku",
    country: "Ethiopia",
    region: "Guji",
    cooperativeId: "coop-eth-01",
    crop: "coffee",
    certification: [],
    registeredAt: "2025-01-20",
    contactRole: "생산자",
  },
];

export const farms: Farm[] = [
  {
    id: "farm-001",
    producerId: "prod-001",
    name: "Gedeo Highland Plot A",
    areaHa: 2.4,
    crop: "coffee",
    gps: { lat: 6.1622, lng: 38.2058 },
    elevationM: 1920,
    polygonVerified: true,
  },
  {
    id: "farm-002",
    producerId: "prod-001",
    name: "Gedeo Highland Plot B",
    areaHa: 1.1,
    crop: "coffee",
    gps: { lat: 6.1589, lng: 38.2091 },
    elevationM: 1895,
    polygonVerified: true,
  },
  {
    id: "farm-003",
    producerId: "prod-002",
    name: "Kumasi Fringe Farm",
    areaHa: 3.8,
    crop: "cocoa",
    gps: { lat: 6.6885, lng: -1.6244 },
    elevationM: 280,
    polygonVerified: false,
  },
  {
    id: "farm-004",
    producerId: "prod-003",
    name: "Guji Forest Edge",
    areaHa: 1.6,
    crop: "coffee",
    gps: { lat: 5.8, lng: 38.95 },
    elevationM: 1750,
    polygonVerified: true,
  },
];

export const surveys: Survey[] = [
  {
    id: "srv-001",
    farmId: "farm-001",
    producerId: "prod-001",
    type: "현장 조사 · 재배 관행",
    status: "승인",
    submittedAt: "2026-01-18",
    reviewedAt: "2026-01-22",
    inspectorRole: "현장 조사원",
  },
  {
    id: "srv-002",
    farmId: "farm-002",
    producerId: "prod-001",
    type: "위성·GPS 경계 검증",
    status: "승인",
    submittedAt: "2026-01-20",
    reviewedAt: "2026-01-23",
    inspectorRole: "GIS 분석 담당",
  },
  {
    id: "srv-003",
    farmId: "farm-003",
    producerId: "prod-002",
    type: "현장 조사 · 재배 관행",
    status: "검수",
    submittedAt: "2026-02-10",
    reviewedAt: null,
    inspectorRole: "현장 조사원",
  },
  {
    id: "srv-004",
    farmId: "farm-004",
    producerId: "prod-003",
    type: "신규 등록 조사",
    status: "진행",
    submittedAt: null,
    reviewedAt: null,
    inspectorRole: "현장 조사원",
  },
  {
    id: "srv-005",
    farmId: "farm-003",
    producerId: "prod-002",
    type: "GPS 경계 보완",
    status: "신청",
    submittedAt: null,
    reviewedAt: null,
    inspectorRole: "GIS 분석 담당",
  },
];

export const carbonResults: CarbonResult[] = [
  {
    lotId: "LOT-2026-041",
    crop: "coffee",
    producerId: "prod-001",
    farmId: "farm-001",
    harvestYear: 2025,
    quantityKg: 18000,
    opsCo2eKg: 42480,
    lucCo2eKg: 720,
    totalCo2eKg: 43200,
    intensityKgCo2ePerKg: 2.4,
    breakdown: [
      { stage: "재배·관리", co2eKg: 15552, sharePct: 36.0 },
      { stage: "가공·건조", co2eKg: 10800, sharePct: 25.0 },
      { stage: "운반·물류", co2eKg: 8640, sharePct: 20.0 },
      { stage: "포장·저장", co2eKg: 4320, sharePct: 10.0 },
      { stage: "토지이용변화(LUC·5년)", co2eKg: 720, sharePct: 1.7 },
      { stage: "기타·손실", co2eKg: 3168, sharePct: 7.3 },
    ],
    calculatedAt: "2026-02-01",
    methodologyNote:
      "운영 배출(활동데이터×배출계수) + 위성 5년 토지피복 ΔC 기반 LUC를 20년 균등 배분 후 수확 로트에 할당",
  },
  {
    lotId: "LOT-2026-018",
    crop: "cocoa",
    producerId: "prod-002",
    farmId: "farm-003",
    harvestYear: 2025,
    quantityKg: 24000,
    opsCo2eKg: 45750,
    lucCo2eKg: 21450,
    totalCo2eKg: 67200,
    intensityKgCo2ePerKg: 2.8,
    breakdown: [
      { stage: "재배·관리", co2eKg: 18000, sharePct: 26.8 },
      { stage: "발효·건조", co2eKg: 13440, sharePct: 20.0 },
      { stage: "운반·물류", co2eKg: 10080, sharePct: 15.0 },
      { stage: "포장·저장", co2eKg: 4032, sharePct: 6.0 },
      { stage: "토지이용변화(LUC·5년)", co2eKg: 21450, sharePct: 31.9 },
      { stage: "기타·손실", co2eKg: 198, sharePct: 0.3 },
    ],
    calculatedAt: "2026-01-28",
    methodologyNote:
      "컷오프 이후 산림면적 감소 0.65ha × 바이오매스 탄소밀도(시연 180 tC/ha) × 44/12 → 20년 배분",
  },
];

export const emissionFactors: EmissionFactor[] = [
  {
    id: "ef-001",
    category: "비료",
    item: "NPK 복합비료",
    unit: "kg CO₂e / kg",
    value: 6.2,
    source: "IPCC 2019 · Tier 2",
  },
  {
    id: "ef-002",
    category: "에너지",
    item: "건조용 연료 (LPG)",
    unit: "kg CO₂e / kWh",
    value: 0.214,
    source: "IEA 2024",
  },
  {
    id: "ef-003",
    category: "물류",
    item: "해상 운송 (컨테이너)",
    unit: "kg CO₂e / t·km",
    value: 0.012,
    source: "GLEC Framework v3",
  },
  {
    id: "ef-004",
    category: "토지",
    item: "관개 전력",
    unit: "kg CO₂e / kWh",
    value: 0.48,
    source: "Ethiopia grid mix 2025",
  },
  {
    id: "ef-005",
    category: "가공",
    item: "Wet 밀링",
    unit: "kg CO₂e / kg green bean",
    value: 0.35,
    source: "Coffee LCA Benchmark 2024",
  },
  {
    id: "ef-006",
    category: "LUC",
    item: "열대 산림→농경 전환 (시연)",
    unit: "tC / ha",
    value: 180,
    source: "IPCC AFOLU · 지역 기본값(시연)",
  },
  {
    id: "ef-007",
    category: "LUC",
    item: "황폐화(캐노피 손실) 보정",
    unit: "tC / ha degraded",
    value: 45,
    source: "시연 Tier-1 보정계수",
  },
];

/** EUDR 컷오프 2020-12-31 이후 · 5년 위성 시계열 */
export const landUseAnalyses: LandUseAnalysis[] = [
  {
    farmId: "farm-001",
    lotId: "LOT-2026-041",
    areaHa: 2.4,
    cutoffDate: "2020-12-31",
    periodLabel: "2021–2025 (5년)",
    series: [
      {
        year: 2021,
        imageSrc: "/evidence/farm-001/sat-2021.png",
        canopyPct: 68,
        forestHa: 0.85,
        agriHa: 1.45,
        degradedHa: 0.1,
        ndvi: 0.71,
      },
      {
        year: 2022,
        imageSrc: "/evidence/farm-001/sat-2023.png",
        canopyPct: 69,
        forestHa: 0.86,
        agriHa: 1.44,
        degradedHa: 0.1,
        ndvi: 0.72,
      },
      {
        year: 2023,
        imageSrc: "/evidence/farm-001/sat-2023.png",
        canopyPct: 70,
        forestHa: 0.88,
        agriHa: 1.43,
        degradedHa: 0.09,
        ndvi: 0.73,
      },
      {
        year: 2024,
        imageSrc: "/evidence/farm-001/sat-2025.png",
        canopyPct: 71,
        forestHa: 0.9,
        agriHa: 1.42,
        degradedHa: 0.08,
        ndvi: 0.74,
      },
      {
        year: 2025,
        imageSrc: "/evidence/farm-001/sat-2025.png",
        canopyPct: 72,
        forestHa: 0.92,
        agriHa: 1.41,
        degradedHa: 0.07,
        ndvi: 0.75,
      },
    ],
    deforestationAfterCutoffHa: 0,
    degradationDeltaHa: -0.03,
    canopyDeltaPp: 4,
    lucGrossCo2eKg: 14400,
    amortYears: 20,
    lucAnnualCo2eKg: 720,
    eudrDeforestationFree: true,
    riskLevel: "low",
    groundImageSrc: "/evidence/farm-001/ground.jpg",
    summary:
      "컷오프 이후 산림 면적 감소 없음. 차광·혼농임업 캐노피 +4%p, 황폐화 −0.03ha. LUC는 토양·바이오매스 미세 변동분만 로트에 배분.",
    plotOutlinePct: [
      { x: 16, y: 20 },
      { x: 40, y: 12 },
      { x: 68, y: 14 },
      { x: 86, y: 28 },
      { x: 90, y: 52 },
      { x: 82, y: 78 },
      { x: 58, y: 88 },
      { x: 28, y: 84 },
      { x: 12, y: 62 },
      { x: 14, y: 38 },
    ],
  },
  {
    farmId: "farm-003",
    lotId: "LOT-2026-018",
    areaHa: 3.8,
    cutoffDate: "2020-12-31",
    periodLabel: "2021–2025 (5년)",
    series: [
      {
        year: 2021,
        imageSrc: "/evidence/farm-003/sat-2021.png",
        canopyPct: 62,
        forestHa: 1.2,
        agriHa: 2.4,
        degradedHa: 0.2,
        ndvi: 0.68,
      },
      {
        year: 2022,
        imageSrc: "/evidence/farm-003/sat-2021.png",
        canopyPct: 58,
        forestHa: 1.05,
        agriHa: 2.45,
        degradedHa: 0.3,
        ndvi: 0.63,
      },
      {
        year: 2023,
        imageSrc: "/evidence/farm-003/sat-2025.png",
        canopyPct: 52,
        forestHa: 0.88,
        agriHa: 2.5,
        degradedHa: 0.42,
        ndvi: 0.57,
      },
      {
        year: 2024,
        imageSrc: "/evidence/farm-003/sat-2025.png",
        canopyPct: 48,
        forestHa: 0.72,
        agriHa: 2.55,
        degradedHa: 0.53,
        ndvi: 0.52,
      },
      {
        year: 2025,
        imageSrc: "/evidence/farm-003/sat-2025.png",
        canopyPct: 44,
        forestHa: 0.55,
        agriHa: 2.6,
        degradedHa: 0.65,
        ndvi: 0.48,
      },
    ],
    deforestationAfterCutoffHa: 0.65,
    degradationDeltaHa: 0.45,
    canopyDeltaPp: -18,
    // 0.65ha × 180 tC/ha × 44/12 ≈ 429 tCO₂e → kg
    lucGrossCo2eKg: 429000,
    amortYears: 20,
    lucAnnualCo2eKg: 21450,
    eudrDeforestationFree: false,
    riskLevel: "high",
    summary:
      "컷오프 이후 산림 −0.65ha · 황폐화 +0.45ha · 캐노피 −18%p. EUDR 삼림전용 리스크 높음. LUC가 로트 배출의 약 32%를 차지.",
    /**
     * 2025 위성 기준: 좌측=잔존 산림, 우측=개간·나출
     * 핫스팟은 수관선·나출 경계를 따라 들쭉날쭉하게 맞춤
     */
    plotOutlinePct: [
      { x: 40, y: 6 },
      { x: 58, y: 4 },
      { x: 78, y: 8 },
      { x: 94, y: 18 },
      { x: 97, y: 42 },
      { x: 95, y: 68 },
      { x: 88, y: 88 },
      { x: 68, y: 96 },
      { x: 48, y: 92 },
      { x: 38, y: 78 },
      { x: 36, y: 52 },
      { x: 38, y: 28 },
    ],
    hotspotsByYear: {
      2021: [
        {
          id: "d1-21",
          kind: "deforestation",
          label: "D1 산림전용 초기",
          areaHa: 0.18,
          // 우측 소규모 개간 패치 (모자이크 농경)
          points: [
            { x: 56, y: 30 },
            { x: 64, y: 27 },
            { x: 73, y: 29 },
            { x: 78, y: 36 },
            { x: 76, y: 46 },
            { x: 70, y: 52 },
            { x: 61, y: 51 },
            { x: 55, y: 44 },
            { x: 54, y: 36 },
          ],
          note: "동측 소규모 개간 패치 출현",
        },
        {
          id: "g1-21",
          kind: "degradation",
          label: "G1 캐노피 희박",
          areaHa: 0.12,
          // 중앙 수관 희박 구간
          points: [
            { x: 34, y: 38 },
            { x: 42, y: 34 },
            { x: 50, y: 36 },
            { x: 54, y: 46 },
            { x: 52, y: 58 },
            { x: 44, y: 66 },
            { x: 34, y: 64 },
            { x: 28, y: 54 },
            { x: 30, y: 44 },
          ],
          note: "중앙 전이대 수관 희박화 시작",
        },
      ],
      2023: [
        {
          id: "d1-23",
          kind: "deforestation",
          label: "D1 산림전용 확대",
          areaHa: 0.35,
          points: [
            { x: 50, y: 14 },
            { x: 62, y: 10 },
            { x: 78, y: 14 },
            { x: 90, y: 24 },
            { x: 92, y: 42 },
            { x: 86, y: 58 },
            { x: 74, y: 64 },
            { x: 60, y: 58 },
            { x: 52, y: 44 },
            { x: 48, y: 28 },
          ],
          note: "동측 개간면이 수관선을 따라 확대",
        },
        {
          id: "g1-23",
          kind: "degradation",
          label: "G1 황폐화 진행",
          areaHa: 0.28,
          points: [
            { x: 36, y: 18 },
            { x: 46, y: 16 },
            { x: 50, y: 30 },
            { x: 52, y: 48 },
            { x: 56, y: 66 },
            { x: 52, y: 82 },
            { x: 42, y: 86 },
            { x: 34, y: 74 },
            { x: 32, y: 52 },
            { x: 34, y: 32 },
          ],
          note: "산림–농경 전이대 캐노피 손실",
        },
      ],
      2025: [
        {
          id: "d1-25",
          kind: "deforestation",
          label: "D1 산림전용 확정",
          areaHa: 0.42,
          // 우측 완전 개간·나출·작물필지 (수관선 따라 들쭉날쭉)
          points: [
            { x: 47, y: 5 },
            { x: 60, y: 3 },
            { x: 76, y: 6 },
            { x: 90, y: 12 },
            { x: 97, y: 24 },
            { x: 96, y: 40 },
            { x: 93, y: 56 },
            { x: 88, y: 70 },
            { x: 80, y: 78 },
            { x: 70, y: 72 },
            { x: 64, y: 58 },
            { x: 58, y: 46 },
            { x: 52, y: 34 },
            { x: 48, y: 22 },
            { x: 46, y: 12 },
          ],
          note: "우측 개간지 · 컷오프 이후 산림전용 핵심",
        },
        {
          id: "g1-25",
          kind: "degradation",
          label: "G1 전이대 황폐화",
          areaHa: 0.28,
          // 좌측 밀림과 우측 개간 사이 톱니 수관선
          points: [
            { x: 36, y: 6 },
            { x: 44, y: 8 },
            { x: 48, y: 18 },
            { x: 50, y: 32 },
            { x: 52, y: 48 },
            { x: 54, y: 64 },
            { x: 58, y: 78 },
            { x: 54, y: 90 },
            { x: 44, y: 92 },
            { x: 38, y: 82 },
            { x: 34, y: 66 },
            { x: 32, y: 48 },
            { x: 34, y: 28 },
            { x: 36, y: 14 },
          ],
          note: "밀림–개간 사이 수관 희박·잔존목 구간",
        },
        {
          id: "g2-25",
          kind: "degradation",
          label: "G2 남동 잔존목 희박",
          areaHa: 0.17,
          points: [
            { x: 66, y: 68 },
            { x: 78, y: 62 },
            { x: 88, y: 68 },
            { x: 92, y: 80 },
            { x: 86, y: 92 },
            { x: 72, y: 96 },
            { x: 60, y: 90 },
            { x: 58, y: 78 },
          ],
          note: "남동 나출·잔존목 산재 구간",
        },
      ],
    },
  },
];

export const ddsDocuments: DdsDocument[] = [
  {
    id: "dds-001",
    lotId: "LOT-2026-041",
    referenceNumber: "DDS-ETH-2026-0041",
    status: "준비완료",
    deforestationRisk: "low",
    geolocationVerified: true,
    dueDate: "2026-03-15",
    preparedAt: "2026-02-20",
  },
  {
    id: "dds-002",
    lotId: "LOT-2026-018",
    referenceNumber: "DDS-GHA-2026-0018",
    status: "검토중",
    deforestationRisk: "medium",
    geolocationVerified: false,
    dueDate: "2026-04-01",
    preparedAt: null,
  },
];

export const eudrCompliance: EudrCompliance = {
  lotId: "LOT-2026-041",
  commodity: "Coffee · Arabica",
  originCountry: "Ethiopia",
  operatorRole: "EU 수입업체",
  traceabilityComplete: true,
  ddsReady: true,
  riskAssessment: "pass",
  checklist: [
    { item: "생산지 GPS 좌표 및 폴리곤 등록", done: true },
    { item: "2020-12-31 이후 산림전용 무관 증빙", done: true },
    { item: "공급망 추적성 (농장→로트)", done: true },
    { item: "DDS 참조번호 발급", done: true },
    { item: "EU TRACES 제출", done: false },
  ],
};

export const supplyChainStages: SupplyChainStage[] = [
  {
    id: "sc-01",
    lotId: "LOT-2026-041",
    order: 1,
    name: "농장 수확",
    location: "Sidama, Ethiopia",
    actorRole: "생산자",
    status: "완료",
    completedAt: "2025-11-20",
    co2eKg: 15552,
  },
  {
    id: "sc-02",
    lotId: "LOT-2026-041",
    order: 2,
    name: "협동조합 집하",
    location: "Yirgacheffe Washing Station",
    actorRole: "협동조합",
    status: "완료",
    completedAt: "2025-11-28",
    co2eKg: 3888,
  },
  {
    id: "sc-03",
    lotId: "LOT-2026-041",
    order: 3,
    name: "건조·가공",
    location: "Addis Ababa Processing Hub",
    actorRole: "가공업체",
    status: "완료",
    completedAt: "2025-12-15",
    co2eKg: 10800,
  },
  {
    id: "sc-04",
    lotId: "LOT-2026-041",
    order: 4,
    name: "수출 통관",
    location: "Djibouti Port",
    actorRole: "물류·통관",
    status: "완료",
    completedAt: "2026-01-10",
    co2eKg: 4320,
  },
  {
    id: "sc-05",
    lotId: "LOT-2026-041",
    order: 5,
    name: "해상 운송",
    location: "Djibouti → Rotterdam",
    actorRole: "선사",
    status: "진행중",
    completedAt: null,
    co2eKg: 4320,
  },
  {
    id: "sc-06",
    lotId: "LOT-2026-041",
    order: 6,
    name: "EU 입고·로스팅",
    location: "Hamburg, Germany",
    actorRole: "로스터",
    status: "대기",
    completedAt: null,
    co2eKg: null,
  },
];

export const opsKpis: OpsKpi[] = [
  { label: "등록 생산자", value: 128, unit: "명", trend: "up" },
  { label: "검증 재배지", value: 214, unit: "필지", trend: "up" },
  { label: "승인 조사", value: 89, unit: "건", trend: "flat" },
  { label: "탄소 산출 로트", value: 34, unit: "건", trend: "up" },
  { label: "DDS 준비완료", value: 12, unit: "건", trend: "up" },
  { label: "EUDR 준수율", value: "94%", trend: "up" },
];

export const alerts: Alert[] = [
  {
    id: "alert-001",
    severity: "info",
    title: "LOT-2026-041 DDS 준비완료",
    message:
      "Abebe Tadesse · Yirgacheffe 커피 로트의 Due Diligence Statement가 EUDR 제출 준비 상태입니다.",
    relatedLotId: "LOT-2026-041",
    createdAt: "2026-02-20",
  },
  {
    id: "alert-002",
    severity: "warn",
    title: "GPS 경계 미검증",
    message:
      "Kumasi Fringe Farm (farm-003) 폴리곤 검증이 필요합니다. EUDR 지리정보 요건 미충족.",
    createdAt: "2026-02-18",
  },
  {
    id: "alert-004",
    severity: "danger",
    title: "5년 토지이용 · 산림감소 감지",
    message:
      "farm-003 위성 시계열(2021–2025)에서 컷오프 이후 산림 −0.65ha. LUC CO₂e 연배분 21.45 t이 탄소 산출에 반영되었습니다.",
    relatedLotId: "LOT-2026-018",
    createdAt: "2026-02-19",
  },
  {
    id: "alert-003",
    severity: "info",
    title: "조사 승인 완료",
    message:
      "Gedeo Highland Plot A 현장 조사가 승인되었습니다. 탄소 산출 계산에 반영됩니다.",
    relatedLotId: "LOT-2026-041",
    createdAt: "2026-01-22",
  },
];

export const featuredLotId = "LOT-2026-041";
export const featuredProducerId = "prod-001";

export function getProducer(id: string) {
  return producers.find((p) => p.id === id);
}

export function getFarm(id: string) {
  return farms.find((f) => f.id === id);
}

export function getCooperative(id: string) {
  return cooperatives.find((c) => c.id === id);
}

export function getCarbonResult(lotId: string) {
  return carbonResults.find((c) => c.lotId === lotId);
}

export function getLandUseAnalysis(farmId: string) {
  return landUseAnalyses.find((a) => a.farmId === farmId);
}

export function getLandUseByLot(lotId: string) {
  return landUseAnalyses.find((a) => a.lotId === lotId);
}

export function getDdsForLot(lotId: string) {
  return ddsDocuments.find((d) => d.lotId === lotId);
}

export function getSupplyChainForLot(lotId: string) {
  return supplyChainStages
    .filter((s) => s.lotId === lotId)
    .sort((a, b) => a.order - b.order);
}

export const surveyStatusOrder: SurveyStatus[] = [
  "신청",
  "진행",
  "검수",
  "승인",
];

/** 조사원 현장 조사 단계 (모바일) */
export type FieldStepStatus = "완료" | "진행" | "대기";

export interface FieldSurveyStep {
  n: number;
  key: string;
  title: string;
  hint: string;
  status: FieldStepStatus;
  required: boolean;
}

export interface GpsSample {
  lat: number;
  lng: number;
  accuracyM: number;
  capturedAt: string;
  label: string;
}

export interface PlotPolygon {
  farmId: string;
  points: { lat: number; lng: number }[];
  areaHaCalc: number;
  gpsAccuracyAvgM: number;
  deforestationBufferOk: boolean;
  validated: boolean;
}

export interface ValidationItem {
  id: string;
  surveyId: string;
  kind: "필수값" | "GPS" | "면적" | "사진";
  label: string;
  ok: boolean;
  detail: string;
}

export const fieldAssignments = [
  {
    surveyId: "srv-004",
    farmId: "farm-004",
    producerId: "prod-003",
    title: "신규 등록 조사",
    priority: "높음" as const,
    distanceKm: 1.2,
    offlineCached: true,
  },
  {
    surveyId: "srv-005",
    farmId: "farm-003",
    producerId: "prod-002",
    title: "GPS 경계 보완",
    priority: "보통" as const,
    distanceKm: 4.8,
    offlineCached: false,
  },
];

export const fieldSurveySteps: FieldSurveyStep[] = [
  {
    n: 1,
    key: "arrive",
    title: "현장 도착 · GPS 확인",
    hint: "현재 위치가 재배지 반경 50m 이내인지 확인",
    status: "완료",
    required: true,
  },
  {
    n: 2,
    key: "boundary",
    title: "필지 경계 좌표 수집",
    hint: "폴리곤 꼭짓점 4점 이상 수집 (EUDR geolocation)",
    status: "진행",
    required: true,
  },
  {
    n: 3,
    key: "practice",
    title: "재배 관행 입력",
    hint: "품종·비료·관개·차광 등 활동데이터",
    status: "대기",
    required: true,
  },
  {
    n: 4,
    key: "photos",
    title: "현장 사진 · 증빙",
    hint: "필지 전경·경계·작물 사진 최소 3장",
    status: "대기",
    required: true,
  },
  {
    n: 5,
    key: "review",
    title: "필수값 점검 · 제출",
    hint: "오프라인 저장 후 온라인 동기화·제출",
    status: "대기",
    required: true,
  },
];

/**
 * Guji Forest Edge · 불규칙 소농 필지
 * (계곡·숲 가장자리·보행로를 따라간 들쭉날쭉한 경계, ~1.55ha)
 */
export const gpsMapBounds = {
  minLat: 5.79875,
  maxLat: 5.80105,
  minLng: 38.94885,
  maxLng: 38.95125,
};

/** 현장 수집 순서(시계 방향) · 직선·직각 없음 */
export const gpsWaypointPlan: Omit<GpsSample, "capturedAt">[] = [
  { lat: 5.79918, lng: 38.94952, accuracyM: 3.8, label: "P1" },
  { lat: 5.79908, lng: 38.95002, accuracyM: 4.1, label: "P2" },
  { lat: 5.79922, lng: 38.95048, accuracyM: 3.6, label: "P3" },
  { lat: 5.79948, lng: 38.95088, accuracyM: 4.0, label: "P4" },
  { lat: 5.79995, lng: 38.95102, accuracyM: 3.5, label: "P5" },
  { lat: 5.80042, lng: 38.95078, accuracyM: 3.9, label: "P6" },
  { lat: 5.80068, lng: 38.95022, accuracyM: 4.2, label: "P7" },
  { lat: 5.80055, lng: 38.94962, accuracyM: 3.7, label: "P8" },
  { lat: 5.80012, lng: 38.94928, accuracyM: 4.0, label: "P9" },
  { lat: 5.79962, lng: 38.94935, accuracyM: 3.8, label: "P10" },
];

const gpsCaptureTimes = [
  "10:12:04",
  "10:13:41",
  "10:15:08",
  "10:16:33",
  "10:18:02",
  "10:19:27",
  "10:21:05",
];

/** 시연 기본: 7점 수집 완료(폐합 가능) */
export const gpsTrack: GpsSample[] = gpsWaypointPlan
  .slice(0, 7)
  .map((p, i) => ({
    ...p,
    capturedAt: gpsCaptureTimes[i]!,
  }));

export const plotPolygons: PlotPolygon[] = [
  {
    farmId: "farm-001",
    // Gedeo Highland · 능선·그늘나무 경계를 따른 불규칙 필지
    points: [
      { lat: 6.16152, lng: 38.20508 },
      { lat: 6.16142, lng: 38.20548 },
      { lat: 6.16158, lng: 38.20592 },
      { lat: 6.16178, lng: 38.20638 },
      { lat: 6.16212, lng: 38.20668 },
      { lat: 6.16252, lng: 38.20678 },
      { lat: 6.16288, lng: 38.20648 },
      { lat: 6.16302, lng: 38.20595 },
      { lat: 6.16292, lng: 38.20542 },
      { lat: 6.16258, lng: 38.20505 },
      { lat: 6.16218, lng: 38.20488 },
      { lat: 6.16178, lng: 38.20495 },
    ],
    areaHaCalc: 2.41,
    gpsAccuracyAvgM: 3.6,
    deforestationBufferOk: true,
    validated: true,
  },
  {
    farmId: "farm-004",
    points: gpsTrack.map((g) => ({ lat: g.lat, lng: g.lng })),
    areaHaCalc: 1.55,
    gpsAccuracyAvgM: 3.9,
    deforestationBufferOk: true,
    validated: false,
  },
  {
    farmId: "farm-003",
    // 미완료: 일부 경계만 찍힘 (직선 아님)
    points: [
      { lat: 6.6878, lng: -1.6254 },
      { lat: 6.6881, lng: -1.6249 },
      { lat: 6.6886, lng: -1.6245 },
      { lat: 6.6891, lng: -1.6242 },
    ],
    areaHaCalc: 0,
    gpsAccuracyAvgM: 12.4,
    deforestationBufferOk: false,
    validated: false,
  },
];

export const validationItems: ValidationItem[] = [
  {
    id: "v1",
    surveyId: "srv-004",
    kind: "GPS",
    label: "경계점 4점 이상",
    ok: true,
    detail: "P1~P7 수집 완료 · 평균 정확도 3.9m · 불규칙 경계",
  },
  {
    id: "v2",
    surveyId: "srv-004",
    kind: "면적",
    label: "폴리곤 면적 vs 신고 면적",
    ok: true,
    detail: "산출 1.55ha / 신고 1.6ha (편차 3%)",
  },
  {
    id: "v3",
    surveyId: "srv-004",
    kind: "필수값",
    label: "재배 관행 필수 항목",
    ok: false,
    detail: "비료 사용량·차광 여부 미입력",
  },
  {
    id: "v4",
    surveyId: "srv-004",
    kind: "사진",
    label: "현장 증빙 사진",
    ok: false,
    detail: "2/3장 · 경계 사진 추가 필요",
  },
  {
    id: "v5",
    surveyId: "srv-003",
    kind: "GPS",
    label: "폴리곤 폐합",
    ok: false,
    detail: "경계 4점만 등록 · 폐합 미완료 · 보완 조사 필요",
  },
];

export function getSurvey(id: string) {
  return surveys.find((s) => s.id === id);
}

export function getPlotPolygon(farmId: string) {
  return plotPolygons.find((p) => p.farmId === farmId);
}

export function getValidations(surveyId: string) {
  return validationItems.filter((v) => v.surveyId === surveyId);
}
