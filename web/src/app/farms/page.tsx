import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DemoFlowNav } from "@/components/DemoFlowNav";
import { GpsMap } from "@/components/GpsMap";
import {
  farms,
  featuredProducerId,
  getPlotPolygon,
  getProducer,
} from "@/data/mock";

export default function FarmsPage() {
  const featuredFarm = farms.find((f) => f.id === "farm-001");
  const poly = featuredFarm ? getPlotPolygon(featuredFarm.id) : undefined;

  return (
    <AppShell title="재배지·지도" subtitle="GPS · 폴리곤 · EUDR 지리정보">
      <DemoFlowNav />

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-line bg-surface p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-brand">검증 완료 필지</p>
              <h2 className="text-lg font-semibold">{featuredFarm?.name}</h2>
            </div>
            <Link
              href="/farms/farm-001"
              className="text-xs font-medium text-brand hover:underline"
            >
              상세
            </Link>
          </div>
          {poly ? (
            <GpsMap
              points={poly.points.map((p, i) => ({
                ...p,
                label: `P${i + 1}`,
              }))}
              basemapSrc="/evidence/farm-001/sat-2025.png"
            />
          ) : null}
          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md bg-bg px-2 py-1.5">
              <dt className="text-muted">신고 면적</dt>
              <dd className="font-semibold">{featuredFarm?.areaHa} ha</dd>
            </div>
            <div className="rounded-md bg-bg px-2 py-1.5">
              <dt className="text-muted">폴리곤 면적</dt>
              <dd className="font-semibold">{poly?.areaHaCalc} ha</dd>
            </div>
            <div className="rounded-md bg-bg px-2 py-1.5">
              <dt className="text-muted">GPS 정확도</dt>
              <dd className="font-semibold">±{poly?.gpsAccuracyAvgM}m</dd>
            </div>
            <div className="rounded-md bg-bg px-2 py-1.5">
              <dt className="text-muted">삼림훼손 버퍼</dt>
              <dd className="font-semibold text-ok">
                {poly?.deforestationBufferOk ? "적합" : "주의"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-xs font-medium text-warn">보완 필요</p>
          <h2 className="mt-1 text-lg font-semibold">Kumasi Fringe Farm</h2>
          <p className="mt-1 text-sm text-muted">
            폴리곤 미폐합 · GPS 정확도 부족 · 조사원 GPS 경계 보완 배정
          </p>
          <Link
            href="/field/gps"
            className="mt-4 inline-flex rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white"
          >
            조사원 GPS 수집으로
          </Link>
        </section>
      </div>

      <section className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="border-b border-line px-4 py-3">
          <h3 className="text-sm font-semibold">재배지 목록</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-bg text-xs text-muted">
            <tr>
              <th className="px-4 py-2 font-medium">재배지</th>
              <th className="px-4 py-2 font-medium">생산자</th>
              <th className="px-4 py-2 font-medium">면적</th>
              <th className="px-4 py-2 font-medium">GPS</th>
              <th className="px-4 py-2 font-medium">폴리곤</th>
              <th className="px-4 py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {farms.map((f) => {
              const producer = getProducer(f.producerId);
              return (
                <tr
                  key={f.id}
                  className={`border-t border-line ${
                    f.producerId === featuredProducerId && f.id === "farm-001"
                      ? "bg-brand-soft/40"
                      : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium">{f.name}</td>
                  <td className="px-4 py-3 text-muted">{producer?.name}</td>
                  <td className="px-4 py-3 tabular-nums">{f.areaHa} ha</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {f.gps.lat.toFixed(4)}, {f.gps.lng.toFixed(4)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                        f.polygonVerified
                          ? "bg-emerald-50 text-ok"
                          : "bg-amber-50 text-warn"
                      }`}
                    >
                      {f.polygonVerified ? "검증" : "미검증"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/farms/${f.id}`}
                      className="text-xs text-brand hover:underline"
                    >
                      지도
                    </Link>
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
