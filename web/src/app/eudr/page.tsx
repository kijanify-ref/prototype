import Image from "next/image";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DemoFlowNav } from "@/components/DemoFlowNav";
import { DegradationHotspotCompare } from "@/components/DegradationOverlay";
import {
  ddsDocuments,
  eudrCompliance,
  featuredLotId,
  getDdsForLot,
  getFarm,
  getLandUseAnalysis,
  getLandUseByLot,
} from "@/data/mock";

const statusStyles: Record<string, string> = {
  준비중: "bg-bg text-muted",
  검토중: "bg-amber-50 text-warn",
  준비완료: "bg-emerald-50 text-ok",
  제출완료: "bg-brand-soft text-brand",
};

const riskStyles: Record<string, string> = {
  low: "text-ok",
  medium: "text-warn",
  high: "text-danger",
};

export default function EudrPage() {
  const featuredDds = getDdsForLot(featuredLotId);
  const landUse = getLandUseByLot(featuredLotId);
  const riskFarm = getLandUseAnalysis("farm-003");
  const before = landUse?.series.find((s) => s.year === 2021);
  const after = landUse?.series.find((s) => s.year === 2025);

  return (
    <AppShell title="EUDR·DDS" subtitle="Due Diligence Statement · EU 규정 준수">
      <DemoFlowNav current="eudr" />

      <section className="mb-6 rounded-xl border border-brand/30 bg-brand-soft p-5">
        <p className="text-xs font-medium text-brand">
          EUDR 준수 · {featuredLotId}
        </p>
        <h2 className="mt-1 text-lg font-semibold">
          {eudrCompliance.commodity}
        </h2>
        <p className="mt-1 text-sm text-muted">
          원산지 {eudrCompliance.originCountry} · {eudrCompliance.operatorRole}{" "}
          · 컷오프 2020-12-31
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              eudrCompliance.ddsReady
                ? "bg-emerald-50 text-ok"
                : "bg-amber-50 text-warn"
            }`}
          >
            DDS {eudrCompliance.ddsReady ? "준비완료" : "준비중"}
          </span>
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              eudrCompliance.riskAssessment === "pass"
                ? "bg-emerald-50 text-ok"
                : "bg-amber-50 text-warn"
            }`}
          >
            리스크 {eudrCompliance.riskAssessment}
          </span>
          {landUse ? (
            <span
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                landUse.eudrDeforestationFree
                  ? "bg-emerald-50 text-ok"
                  : "bg-red-50 text-danger"
              }`}
            >
              5년 산림전용{" "}
              {landUse.eudrDeforestationFree ? "없음" : "감지됨"}
            </span>
          ) : null}
        </div>
      </section>

      {before && after && landUse ? (
        <section className="mb-6 rounded-xl border border-line bg-surface p-5">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">
                위성 비교 · 컷오프 이후 5년
              </h3>
              <p className="text-xs text-muted">
                {getFarm(landUse.farmId)?.name} · 2021 vs 2025 · 산림 Δ{" "}
                {landUse.deforestationAfterCutoffHa.toFixed(2)} ha
              </p>
            </div>
            <Link
              href="/land-use"
              className="text-xs font-medium text-brand hover:underline"
            >
              전체 시계열 →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[before, after].map((s) => (
              <figure
                key={s.year}
                className="overflow-hidden rounded-lg border border-line"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={s.imageSrc}
                    alt={`위성 ${s.year}`}
                    fill
                    className="object-cover"
                    sizes="50vw"
                    unoptimized
                  />
                </div>
                <figcaption className="flex justify-between px-2.5 py-1.5 text-xs">
                  <span className="font-medium">{s.year}</span>
                  <span className="tabular-nums text-muted">
                    산림 {s.forestHa}ha · 황폐화 {s.degradedHa}ha
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">{landUse.summary}</p>
        </section>
      ) : null}

      {riskFarm ? (
        <section className="mb-6 rounded-xl border border-danger/25 bg-red-50/30 p-4">
          <p className="text-xs font-medium text-danger">
            대비 필지 · {getFarm(riskFarm.farmId)?.name}
          </p>
          <p className="mt-1 text-sm">
            컷오프 이후 산림 −{riskFarm.deforestationAfterCutoffHa.toFixed(2)}
            ha · 황폐화 +{riskFarm.degradationDeltaHa.toFixed(2)}ha → DDS{" "}
            <span className="font-medium">검토중</span>
          </p>
          <div className="mt-4">
            <DegradationHotspotCompare analysis={riskFarm} />
          </div>
        </section>
      ) : null}

      {featuredDds ? (
        <section className="mb-6 overflow-hidden rounded-xl border border-line bg-surface">
          <div className="border-b border-line px-4 py-3">
            <h3 className="text-sm font-semibold">DDS 보고서</h3>
          </div>
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs text-muted">참조번호</p>
              <p className="mt-1 font-mono text-sm font-medium">
                {featuredDds.referenceNumber}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">상태</p>
              <p className="mt-1">
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusStyles[featuredDds.status]}`}
                >
                  {featuredDds.status}
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">삼림전용 리스크</p>
              <p
                className={`mt-1 text-sm font-medium capitalize ${riskStyles[featuredDds.deforestationRisk]}`}
              >
                {featuredDds.deforestationRisk}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">지리정보 검증</p>
              <p className="mt-1 text-sm">
                {featuredDds.geolocationVerified ? "완료" : "미완료"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">제출 기한</p>
              <p className="mt-1 font-mono text-sm">{featuredDds.dueDate}</p>
            </div>
            <div>
              <p className="text-xs text-muted">준비 완료일</p>
              <p className="mt-1 font-mono text-sm">
                {featuredDds.preparedAt ?? "—"}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mb-6 rounded-xl border border-line bg-surface p-5">
        <h3 className="text-sm font-semibold">EUDR 체크리스트</h3>
        <ul className="mt-3 space-y-2">
          {eudrCompliance.checklist.map((item) => (
            <li key={item.item} className="flex items-start gap-2 text-sm">
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  item.done
                    ? "bg-emerald-100 text-ok"
                    : "border border-line bg-bg text-muted"
                }`}
              >
                {item.done ? "✓" : ""}
              </span>
              <span className={item.done ? "text-ink" : "text-muted"}>
                {item.item}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="border-b border-line px-4 py-3">
          <h3 className="text-sm font-semibold">DDS 문서 목록</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-bg text-xs text-muted">
            <tr>
              <th className="px-4 py-2 font-medium">로트</th>
              <th className="px-4 py-2 font-medium">참조번호</th>
              <th className="px-4 py-2 font-medium">상태</th>
              <th className="px-4 py-2 font-medium">리스크</th>
              <th className="px-4 py-2 font-medium">GPS</th>
            </tr>
          </thead>
          <tbody>
            {ddsDocuments.map((d) => (
              <tr
                key={d.id}
                className={`border-t border-line ${
                  d.lotId === featuredLotId ? "bg-brand-soft/40" : ""
                }`}
              >
                <td className="px-4 py-3 font-medium">{d.lotId}</td>
                <td className="px-4 py-3 font-mono text-xs">
                  {d.referenceNumber}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusStyles[d.status]}`}
                  >
                    {d.status}
                  </span>
                </td>
                <td
                  className={`px-4 py-3 capitalize ${riskStyles[d.deforestationRisk]}`}
                >
                  {d.deforestationRisk}
                </td>
                <td className="px-4 py-3">
                  {d.geolocationVerified ? "검증완료" : "미검증"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}
