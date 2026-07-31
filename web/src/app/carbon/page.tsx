import Image from "next/image";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DemoFlowNav } from "@/components/DemoFlowNav";
import { SatelliteTimeline } from "@/components/SatelliteTimeline";
import {
  carbonResults,
  emissionFactors,
  featuredLotId,
  getCarbonResult,
  getLandUseByLot,
  getProducer,
} from "@/data/mock";

export default function CarbonPage() {
  const featured = getCarbonResult(featuredLotId);
  const landUse = featured ? getLandUseByLot(featured.lotId) : undefined;

  return (
    <AppShell title="탄소" subtitle="운영 배출 + 5년 LUC · 배출계수">
      <DemoFlowNav current="carbon" />

      {featured ? (
        <section className="mb-6 rounded-xl border border-brand/30 bg-brand-soft p-5">
          <p className="text-xs font-medium text-brand">시연 로트</p>
          <h2 className="mt-1 text-lg font-semibold">{featured.lotId}</h2>
          <p className="mt-1 text-sm text-muted">
            {getProducer(featured.producerId)?.name} · {featured.harvestYear}{" "}
            harvest · {featured.quantityKg.toLocaleString()} kg
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-muted">총 CO₂e</p>
              <p className="text-xl font-semibold tabular-nums">
                {featured.totalCo2eKg.toLocaleString()} kg
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">운영 배출</p>
              <p className="text-xl font-semibold tabular-nums">
                {featured.opsCo2eKg.toLocaleString()} kg
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">LUC (5년 배분)</p>
              <p className="text-xl font-semibold tabular-nums text-brand">
                {featured.lucCo2eKg.toLocaleString()} kg
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">집약도</p>
              <p className="text-xl font-semibold tabular-nums">
                {featured.intensityKgCo2ePerKg} kg CO₂e/kg
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted">{featured.methodologyNote}</p>
          <Link
            href="/land-use"
            className="mt-2 inline-block text-xs font-medium text-brand hover:underline"
          >
            토지이용·5년 위성 분석 보기 →
          </Link>
        </section>
      ) : null}

      {featured && landUse ? (
        <section className="mb-6 rounded-xl border border-line bg-surface p-5">
          <h3 className="mb-3 text-sm font-semibold">
            LUC 근거 · 위성 5년 ({landUse.periodLabel})
          </h3>
          <SatelliteTimeline analysis={landUse} compact />
          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
            <div className="rounded-lg bg-bg px-3 py-2">
              <p className="text-muted">산림감소</p>
              <p className="font-semibold tabular-nums">
                {landUse.deforestationAfterCutoffHa.toFixed(2)} ha
              </p>
            </div>
            <div className="rounded-lg bg-bg px-3 py-2">
              <p className="text-muted">황폐화 Δ</p>
              <p className="font-semibold tabular-nums">
                {landUse.degradationDeltaHa > 0 ? "+" : ""}
                {landUse.degradationDeltaHa.toFixed(2)} ha
              </p>
            </div>
            <div className="rounded-lg bg-bg px-3 py-2">
              <p className="text-muted">연배분 LUC</p>
              <p className="font-semibold tabular-nums">
                {landUse.lucAnnualCo2eKg.toLocaleString()} kg
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {featured ? (
        <section className="mb-6 overflow-hidden rounded-xl border border-line bg-surface">
          <div className="border-b border-line px-4 py-3">
            <h3 className="text-sm font-semibold">
              {featured.lotId} · 단계별 배출 (운영 + LUC)
            </h3>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-bg text-xs text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">단계</th>
                <th className="px-4 py-2 font-medium">CO₂e (kg)</th>
                <th className="px-4 py-2 font-medium">비중</th>
              </tr>
            </thead>
            <tbody>
              {featured.breakdown.map((row) => {
                const isLuc = row.stage.includes("LUC");
                return (
                  <tr
                    key={row.stage}
                    className={`border-t border-line ${
                      isLuc ? "bg-brand-soft/30" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      {row.stage}
                      {isLuc ? (
                        <span className="ml-2 text-[10px] text-brand">
                          위성 5년
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {row.co2eKg.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg">
                          <div
                            className={`h-full rounded-full ${
                              isLuc ? "bg-amber-600" : "bg-brand"
                            }`}
                            style={{
                              width: `${Math.min(100, Math.abs(row.sharePct))}%`,
                            }}
                          />
                        </div>
                        <span className="w-10 text-right text-xs tabular-nums text-muted">
                          {row.sharePct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="border-b border-line px-4 py-3">
          <h3 className="text-sm font-semibold">탄소 산출 로트</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-bg text-xs text-muted">
            <tr>
              <th className="px-4 py-2 font-medium">로트</th>
              <th className="px-4 py-2 font-medium">작물</th>
              <th className="px-4 py-2 font-medium">운영</th>
              <th className="px-4 py-2 font-medium">LUC</th>
              <th className="px-4 py-2 font-medium">총 CO₂e</th>
              <th className="px-4 py-2 font-medium">집약도</th>
            </tr>
          </thead>
          <tbody>
            {carbonResults.map((c) => (
              <tr
                key={c.lotId}
                className={`border-t border-line ${
                  c.lotId === featuredLotId ? "bg-brand-soft/40" : ""
                }`}
              >
                <td className="px-4 py-3 font-medium">{c.lotId}</td>
                <td className="px-4 py-3 capitalize">{c.crop}</td>
                <td className="px-4 py-3 tabular-nums">
                  {c.opsCo2eKg.toLocaleString()}
                </td>
                <td className="px-4 py-3 tabular-nums font-medium text-brand">
                  {c.lucCo2eKg.toLocaleString()}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {c.totalCo2eKg.toLocaleString()}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {c.intensityKgCo2ePerKg} kg/kg
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-6 overflow-hidden rounded-xl border border-line bg-surface">
        <div className="border-b border-line px-4 py-3">
          <h3 className="text-sm font-semibold">배출계수</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-bg text-xs text-muted">
            <tr>
              <th className="px-4 py-2 font-medium">카테고리</th>
              <th className="px-4 py-2 font-medium">항목</th>
              <th className="px-4 py-2 font-medium">값</th>
              <th className="px-4 py-2 font-medium">단위</th>
              <th className="px-4 py-2 font-medium">출처</th>
            </tr>
          </thead>
          <tbody>
            {emissionFactors.map((ef) => (
              <tr
                key={ef.id}
                className={`border-t border-line ${
                  ef.category === "LUC" ? "bg-amber-50/50" : ""
                }`}
              >
                <td className="px-4 py-3 text-muted">{ef.category}</td>
                <td className="px-4 py-3">{ef.item}</td>
                <td className="px-4 py-3 font-mono text-xs tabular-nums">
                  {ef.value}
                </td>
                <td className="px-4 py-3 text-xs text-muted">{ef.unit}</td>
                <td className="px-4 py-3 text-xs text-muted">{ef.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {landUse?.groundImageSrc ? (
        <section className="mt-6 overflow-hidden rounded-xl border border-line">
          <div className="relative h-40 w-full sm:h-52">
            <Image
              src={landUse.groundImageSrc}
              alt="재배지 현장"
              fill
              className="object-cover"
              sizes="100vw"
              unoptimized
            />
          </div>
          <p className="bg-surface px-4 py-2 text-xs text-muted">
            현장 증빙 이미지 · 탄소 활동데이터와 함께 보관 (시연)
          </p>
        </section>
      ) : null}
    </AppShell>
  );
}
