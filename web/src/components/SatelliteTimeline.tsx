import type { LandUseAnalysis } from "@/data/mock";
import { AnnotatedSatImage } from "@/components/DegradationOverlay";

export function SatelliteTimeline({
  analysis,
  compact,
}: {
  analysis: LandUseAnalysis;
  compact?: boolean;
}) {
  const keyYears = analysis.series.filter((s) =>
    [2021, 2023, 2025].includes(s.year),
  );
  const shots = keyYears.length >= 2 ? keyYears : analysis.series;
  const hasHotspots = Boolean(analysis.hotspotsByYear);

  return (
    <div className="space-y-3">
      <div
        className={`grid gap-2 ${
          shots.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
        }`}
      >
        {shots.map((s) =>
          hasHotspots ? (
            <AnnotatedSatImage
              key={`${analysis.farmId}-${s.year}`}
              src={s.imageSrc}
              year={s.year}
              alt={`${analysis.farmId} 위성 ${s.year}`}
              hotspots={analysis.hotspotsByYear?.[s.year] ?? []}
              plotOutline={analysis.plotOutlinePct}
              compactCaption
            />
          ) : (
            <AnnotatedSatImage
              key={`${analysis.farmId}-${s.year}`}
              src={s.imageSrc}
              year={s.year}
              alt={`${analysis.farmId} 위성 ${s.year}`}
              hotspots={[]}
              compactCaption
            />
          ),
        )}
      </div>
      {!compact ? (
        <p className="text-xs text-muted">{analysis.summary}</p>
      ) : null}
    </div>
  );
}

export function LandUseMetrics({ analysis }: { analysis: LandUseAnalysis }) {
  const riskClass =
    analysis.riskLevel === "low"
      ? "text-ok"
      : analysis.riskLevel === "medium"
        ? "text-warn"
        : "text-danger";

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Metric
        label="컷오프 이후 산림감소"
        value={`${analysis.deforestationAfterCutoffHa.toFixed(2)} ha`}
        tone={analysis.deforestationAfterCutoffHa > 0 ? "danger" : "ok"}
      />
      <Metric
        label="5년 황폐화 Δ"
        value={`${analysis.degradationDeltaHa > 0 ? "+" : ""}${analysis.degradationDeltaHa.toFixed(2)} ha`}
        tone={analysis.degradationDeltaHa > 0 ? "warn" : "ok"}
      />
      <Metric
        label="캐노피 Δ"
        value={`${analysis.canopyDeltaPp > 0 ? "+" : ""}${analysis.canopyDeltaPp}%p`}
        tone={analysis.canopyDeltaPp >= 0 ? "ok" : "danger"}
      />
      <Metric
        label="LUC 연배분"
        value={`${(analysis.lucAnnualCo2eKg / 1000).toFixed(2)} t CO₂e`}
        tone={analysis.lucAnnualCo2eKg > 5000 ? "danger" : "muted"}
      />
      <div className="sm:col-span-2 lg:col-span-4 rounded-lg border border-line bg-bg px-3 py-2 text-xs">
        <span className="text-muted">EUDR 삼림전용 자유 · </span>
        <span
          className={`font-medium ${
            analysis.eudrDeforestationFree ? "text-ok" : "text-danger"
          }`}
        >
          {analysis.eudrDeforestationFree ? "적합 (감소 0ha)" : "부적합 · 추가 검증"}
        </span>
        <span className="mx-2 text-muted">·</span>
        <span className="text-muted">리스크 </span>
        <span className={`font-medium capitalize ${riskClass}`}>
          {analysis.riskLevel}
        </span>
        <span className="mx-2 text-muted">·</span>
        <span className="text-muted">
          총 LUC {(analysis.lucGrossCo2eKg / 1000).toFixed(1)} t ÷{" "}
          {analysis.amortYears}년
        </span>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ok" | "warn" | "danger" | "muted";
}) {
  const cls =
    tone === "ok"
      ? "text-ok"
      : tone === "warn"
        ? "text-warn"
        : tone === "danger"
          ? "text-danger"
          : "text-ink";
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2.5">
      <p className="text-[11px] text-muted">{label}</p>
      <p className={`mt-0.5 text-sm font-semibold tabular-nums ${cls}`}>
        {value}
      </p>
    </div>
  );
}
