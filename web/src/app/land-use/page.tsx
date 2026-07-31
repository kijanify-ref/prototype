import Image from "next/image";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DemoFlowNav } from "@/components/DemoFlowNav";
import { DegradationHotspotCompare } from "@/components/DegradationOverlay";
import {
  LandUseMetrics,
  SatelliteTimeline,
} from "@/components/SatelliteTimeline";
import {
  featuredLotId,
  getFarm,
  getLandUseAnalysis,
  getLandUseByLot,
  getProducer,
  landUseAnalyses,
} from "@/data/mock";

export default function LandUsePage() {
  const featured =
    getLandUseByLot(featuredLotId) ?? getLandUseAnalysis("farm-001");
  const contrast = getLandUseAnalysis("farm-003");

  return (
    <AppShell
      title="토지이용 · 5년"
      subtitle="위성 시계열 · 황폐화 · LUC → 탄소"
    >
      <DemoFlowNav current="land-use" />

      <section className="mb-6 rounded-xl border border-brand/30 bg-brand-soft p-5">
        <p className="text-xs font-medium text-brand">
          산정 로직 · EUDR 컷오프 {featured?.cutoffDate}
        </p>
        <h2 className="mt-1 text-lg font-semibold">
          {featured ? getFarm(featured.farmId)?.name : "—"} ·{" "}
          {featured?.periodLabel}
        </h2>
        <p className="mt-1 text-sm text-muted">
          위성 피복 분류로 산림·농경·황폐화 면적을 연도별로 비교한 뒤, ΔC × 44/12
          로 LUC CO₂e를 산출하고 수확 로트 탄소에 배분합니다.
        </p>
      </section>

      {featured ? (
        <>
          <section className="mb-6 rounded-xl border border-line bg-surface p-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold">
                  적합 사례 · {getFarm(featured.farmId)?.name}
                </h3>
                <p className="text-xs text-muted">
                  {getProducer(getFarm(featured.farmId)?.producerId ?? "")
                    ?.name}{" "}
                  · {featured.lotId} · {featured.areaHa} ha
                </p>
              </div>
              <Link
                href="/carbon"
                className="text-xs font-medium text-brand hover:underline"
              >
                탄소 산출 반영 →
              </Link>
            </div>
            <LandUseMetrics analysis={featured} />
            <div className="mt-4">
              <SatelliteTimeline analysis={featured} />
            </div>
            {featured.groundImageSrc ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <figure className="overflow-hidden rounded-lg border border-line">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={featured.groundImageSrc}
                      alt="현장 전경"
                      fill
                      className="object-cover"
                      sizes="50vw"
                      unoptimized
                    />
                  </div>
                  <figcaption className="px-2.5 py-1.5 text-xs text-muted">
                    현장 전경 (조사원 촬영 · 시연)
                  </figcaption>
                </figure>
                <div className="rounded-lg border border-line bg-bg p-4 text-xs leading-relaxed text-muted">
                  <p className="font-medium text-ink">LUC 계산식 (시연)</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-4">
                    <li>연도별 산림·황폐화 ha 추출 (위성)</li>
                    <li>
                      Δforest × 180 tC/ha × 44/12 = 총 LUC CO₂e
                    </li>
                    <li>20년 균등 배분 → 연간 LUC</li>
                    <li>해당 수확 로트 탄소 intensity에 합산</li>
                  </ol>
                  <p className="mt-3 tabular-nums text-ink">
                    본 필지: 총 {(featured.lucGrossCo2eKg / 1000).toFixed(1)} t ÷{" "}
                    {featured.amortYears}년 ={" "}
                    <span className="font-semibold text-brand">
                      {(featured.lucAnnualCo2eKg / 1000).toFixed(2)} t/년
                    </span>
                  </p>
                </div>
              </div>
            ) : null}
          </section>

          <section className="mb-6 overflow-hidden rounded-xl border border-line bg-surface">
            <div className="border-b border-line px-4 py-3">
              <h3 className="text-sm font-semibold">
                연도별 면적 · 황폐화 시계열
              </h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-bg text-xs text-muted">
                <tr>
                  <th className="px-4 py-2 font-medium">연도</th>
                  <th className="px-4 py-2 font-medium">캐노피</th>
                  <th className="px-4 py-2 font-medium">산림 ha</th>
                  <th className="px-4 py-2 font-medium">농경 ha</th>
                  <th className="px-4 py-2 font-medium">황폐화 ha</th>
                  <th className="px-4 py-2 font-medium">NDVI</th>
                </tr>
              </thead>
              <tbody>
                {featured.series.map((row) => (
                  <tr key={row.year} className="border-t border-line">
                    <td className="px-4 py-2.5 font-medium">{row.year}</td>
                    <td className="px-4 py-2.5 tabular-nums">{row.canopyPct}%</td>
                    <td className="px-4 py-2.5 tabular-nums">{row.forestHa}</td>
                    <td className="px-4 py-2.5 tabular-nums">{row.agriHa}</td>
                    <td className="px-4 py-2.5 tabular-nums">
                      {row.degradedHa}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums">
                      {row.ndvi.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-line px-4 py-3">
              <div className="flex h-24 items-end gap-1.5">
                {featured.series.map((row) => (
                  <div
                    key={`bar-${row.year}`}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <div
                      className="w-full rounded-t bg-amber-600/80"
                      style={{
                        height: `${Math.max(8, row.degradedHa * 200)}px`,
                      }}
                      title={`황폐화 ${row.degradedHa}ha`}
                    />
                    <div
                      className="w-full rounded-t bg-emerald-700/70"
                      style={{
                        height: `${Math.max(12, row.forestHa * 40)}px`,
                      }}
                      title={`산림 ${row.forestHa}ha`}
                    />
                    <span className="text-[10px] text-muted">{row.year}</span>
                  </div>
                ))}
              </div>
              <p className="mt-1 text-[10px] text-muted">
                막대: 녹=산림 ha · 갈=황폐화 ha (상대 스케일)
              </p>
            </div>
          </section>
        </>
      ) : null}

      {contrast ? (
        <section className="mb-6 rounded-xl border border-danger/30 bg-red-50/40 p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-danger">
              대비 · 황폐화 감지 · {getFarm(contrast.farmId)?.name}
            </h3>
            <p className="text-xs text-muted">
              {contrast.lotId} · GPS 미검증 · EUDR 리스크 high
            </p>
          </div>
          <LandUseMetrics analysis={contrast} />
          <div className="mt-5">
            <h4 className="mb-2 text-sm font-semibold text-ink">
              어디서 황폐화됐나 · 위성 핫스팟
            </h4>
            <DegradationHotspotCompare analysis={contrast} />
          </div>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="border-b border-line px-4 py-3">
          <h3 className="text-sm font-semibold">분석 대상 필지</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-bg text-xs text-muted">
            <tr>
              <th className="px-4 py-2 font-medium">필지</th>
              <th className="px-4 py-2 font-medium">로트</th>
              <th className="px-4 py-2 font-medium">산림Δ</th>
              <th className="px-4 py-2 font-medium">황폐화Δ</th>
              <th className="px-4 py-2 font-medium">LUC/년</th>
              <th className="px-4 py-2 font-medium">EUDR</th>
            </tr>
          </thead>
          <tbody>
            {landUseAnalyses.map((a) => {
              const farm = getFarm(a.farmId);
              return (
                <tr
                  key={a.farmId}
                  className={`border-t border-line ${
                    a.lotId === featuredLotId ? "bg-brand-soft/40" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/farms/${a.farmId}`}
                      className="font-medium hover:text-brand"
                    >
                      {farm?.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {a.lotId ?? "—"}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {a.deforestationAfterCutoffHa.toFixed(2)} ha
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {a.degradationDeltaHa > 0 ? "+" : ""}
                    {a.degradationDeltaHa.toFixed(2)} ha
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {(a.lucAnnualCo2eKg / 1000).toFixed(2)} t
                  </td>
                  <td className="px-4 py-3">
                    {a.eudrDeforestationFree ? (
                      <span className="text-ok">적합</span>
                    ) : (
                      <span className="text-danger">부적합</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}
