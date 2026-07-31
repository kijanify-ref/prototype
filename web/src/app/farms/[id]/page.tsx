import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { GpsMap } from "@/components/GpsMap";
import { SatelliteTimeline } from "@/components/SatelliteTimeline";
import {
  farms,
  getFarm,
  getLandUseAnalysis,
  getPlotPolygon,
  getProducer,
} from "@/data/mock";

export function generateStaticParams() {
  return farms.map((f) => ({ id: f.id }));
}

export default async function FarmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const farm = getFarm(id);
  if (!farm) notFound();
  const producer = getProducer(farm.producerId);
  const poly = getPlotPolygon(farm.id);
  const landUse = getLandUseAnalysis(farm.id);

  return (
    <AppShell
      title={farm.name}
      subtitle={`${producer?.name} · GPS · 위성 5년`}
      actions={
        <div className="flex gap-2">
          {landUse ? (
            <Link
              href="/land-use"
              className="rounded-lg border border-line px-3 py-2 text-sm font-medium"
            >
              토지이용 분석
            </Link>
          ) : null}
          <Link
            href="/field/gps"
            className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white"
          >
            조사원 GPS
          </Link>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {poly ? (
            <GpsMap
              points={poly.points.map((p, i) => ({
                ...p,
                label: `P${i + 1}`,
              }))}
              basemapSrc={
                landUse?.series.find((s) => s.year === 2025)?.imageSrc ??
                "/evidence/field/gps-ortho.png"
              }
            />
          ) : (
            <div className="rounded-xl border border-dashed border-line p-10 text-center text-sm text-muted">
              폴리곤 데이터 없음
            </div>
          )}
        </div>
        <dl className="space-y-3 rounded-xl border border-line bg-surface p-5 text-sm lg:col-span-2">
          <div>
            <dt className="text-xs text-muted">중심 좌표</dt>
            <dd className="font-mono">
              {farm.gps.lat}, {farm.gps.lng}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">면적 / 고도</dt>
            <dd>
              {farm.areaHa} ha · {farm.elevationM} m
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">폴리곤 검증</dt>
            <dd>{farm.polygonVerified ? "완료" : "미완료"}</dd>
          </div>
          {poly ? (
            <>
              <div>
                <dt className="text-xs text-muted">산출 면적</dt>
                <dd>{poly.areaHaCalc} ha</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">평균 GPS 정확도</dt>
                <dd>±{poly.gpsAccuracyAvgM} m</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">삼림훼손 버퍼(시연)</dt>
                <dd>
                  {poly.deforestationBufferOk ? "적합" : "추가 검증 필요"}
                </dd>
              </div>
            </>
          ) : null}
          {landUse ? (
            <div>
              <dt className="text-xs text-muted">5년 산림감소</dt>
              <dd
                className={
                  landUse.deforestationAfterCutoffHa > 0
                    ? "text-danger"
                    : "text-ok"
                }
              >
                {landUse.deforestationAfterCutoffHa.toFixed(2)} ha
              </dd>
            </div>
          ) : null}
          <p className="text-xs text-muted">
            EUDR geolocation + 컷오프 이후 위성 5년 피복 변화를 함께 보관합니다.
          </p>
        </dl>
      </div>

      {landUse ? (
        <section className="mt-6 rounded-xl border border-line bg-surface p-5">
          <h3 className="mb-3 text-sm font-semibold">위성 시계열 · 5년</h3>
          <SatelliteTimeline analysis={landUse} />
        </section>
      ) : null}

      {landUse?.groundImageSrc ? (
        <section className="mt-4 overflow-hidden rounded-xl border border-line">
          <div className="relative h-44 w-full sm:h-56">
            <Image
              src={landUse.groundImageSrc}
              alt="현장 전경"
              fill
              className="object-cover"
              sizes="100vw"
              unoptimized
            />
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}
