"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FieldShell } from "@/components/FieldShell";
import { DemoFlowNav } from "@/components/DemoFlowNav";
import { GpsMap } from "@/components/GpsMap";
import {
  getFarm,
  getProducer,
  gpsMapBounds,
  gpsTrack,
  gpsWaypointPlan,
} from "@/data/mock";

export default function FieldGpsPage() {
  const farm = getFarm("farm-004");
  const producer = farm ? getProducer(farm.producerId) : undefined;
  const [points, setPoints] = useState(gpsTrack);
  const current = points[points.length - 1];

  const areaHa = useMemo(() => {
    if (points.length < 4) return null;
    // 평면 근사 shoelace (시연용)
    const R = 111320;
    const lat0 = points[0].lat * (Math.PI / 180);
    const xy = points.map((p) => ({
      x: p.lng * R * Math.cos(lat0),
      y: p.lat * R,
    }));
    let sum = 0;
    for (let i = 0; i < xy.length; i++) {
      const j = (i + 1) % xy.length;
      sum += xy[i].x * xy[j].y - xy[j].x * xy[i].y;
    }
    return Math.abs(sum) / 2 / 10000;
  }, [points]);

  function capturePoint() {
    const nextIdx = points.length;
    const planned = gpsWaypointPlan[nextIdx];
    if (planned) {
      setPoints((prev) => [
        ...prev,
        {
          ...planned,
          capturedAt: new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }),
        },
      ]);
      return;
    }
    // 계획 포인트 소진 후: 기존 변을 따라 들쭉날쭉하게 보강
    const a = points[points.length % points.length];
    const b = points[(points.length + 1) % points.length];
    const t = 0.35 + Math.random() * 0.3;
    setPoints((prev) => [
      ...prev,
      {
        lat: a.lat + (b.lat - a.lat) * t + (Math.random() - 0.5) * 0.00008,
        lng: a.lng + (b.lng - a.lng) * t + (Math.random() - 0.5) * 0.00008,
        accuracyM: 3.5 + Math.random() * 1.5,
        capturedAt: new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
        label: `P${prev.length + 1}`,
      },
    ]);
  }

  function resetPolygon() {
    setPoints(gpsTrack);
  }

  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <DemoFlowNav current="gps" />
      </div>
      <FieldShell
        title="GPS 필지 경계"
        subtitle="EUDR geolocation · 폴리곤 수집"
        backHref="/field"
        footer={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={capturePoint}
              className="flex-1 rounded-lg bg-brand py-2.5 text-sm font-medium text-white"
            >
              현재 위치 찍기
            </button>
            <Link
              href="/field/survey/srv-004"
              className="flex-1 rounded-lg border border-line py-2.5 text-center text-sm font-medium"
            >
              조사서 계속
            </Link>
          </div>
        }
      >
        <div className="mb-3 rounded-lg border border-line bg-surface px-3 py-2 text-xs">
          <p className="font-medium">{farm?.name ?? "재배지"}</p>
          <p className="mt-0.5 text-muted">
            {producer?.name} · 중심{" "}
            <span className="font-mono">
              {farm?.gps.lat.toFixed(4)}, {farm?.gps.lng.toFixed(4)}
            </span>
          </p>
        </div>

        <GpsMap
          points={points.map((p) => ({
            lat: p.lat,
            lng: p.lng,
            label: p.label,
          }))}
          current={current}
          basemapSrc="/evidence/field/gps-ortho.png"
          bounds={gpsMapBounds}
        />

        <div className="mt-3 grid grid-cols-2 gap-2">
          <figure className="relative h-16 overflow-hidden rounded-lg border border-line">
            <Image
              src="/evidence/field/gps-sat-ref.png"
              alt="위성 참조"
              fill
              className="object-cover"
              sizes="160px"
              unoptimized
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-black/55 px-1.5 py-0.5 text-[10px] text-white">
              위성 참조 2025
            </figcaption>
          </figure>
          <figure className="relative h-16 overflow-hidden rounded-lg border border-line">
            <Image
              src="/evidence/field/surveyor.jpg"
              alt="현장"
              fill
              className="object-cover"
              sizes="160px"
              unoptimized
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-black/55 px-1.5 py-0.5 text-[10px] text-white">
              현장 동기화
            </figcaption>
          </figure>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
          <div className="rounded-lg border border-line bg-surface p-2">
            <p className="text-muted">수집점</p>
            <p className="font-semibold tabular-nums">{points.length}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-2">
            <p className="text-muted">정확도</p>
            <p className="font-semibold tabular-nums">
              ±
              {(
                points.reduce((s, p) => s + p.accuracyM, 0) / points.length
              ).toFixed(1)}
              m
            </p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-2">
            <p className="text-muted">면적</p>
            <p className="font-semibold tabular-nums">
              {areaHa ? `${areaHa.toFixed(2)}ha` : "—"}
            </p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-2">
            <p className="text-muted">폐합</p>
            <p
              className={`font-semibold ${
                points.length >= 4 ? "text-ok" : "text-warn"
              }`}
            >
              {points.length >= 4 ? "완료" : "부족"}
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px]">
          <p className="text-muted">
            신고 {farm?.areaHa}ha · 편차{" "}
            {areaHa
              ? `${(((areaHa - (farm?.areaHa ?? areaHa)) / (farm?.areaHa ?? 1)) * 100).toFixed(1)}%`
              : "—"}
          </p>
          <button
            type="button"
            onClick={resetPolygon}
            className="text-brand hover:underline"
          >
            폴리곤 초기화
          </button>
        </div>

        <ul className="mt-3 max-h-36 space-y-1.5 overflow-y-auto text-xs">
          {points.map((p) => (
            <li
              key={`${p.label}-${p.capturedAt}`}
              className="flex justify-between rounded-md border border-line bg-surface px-2.5 py-1.5"
            >
              <span className="font-medium text-brand">{p.label}</span>
              <span className="font-mono text-muted">
                {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
              </span>
              <span className="text-muted">±{p.accuracyM.toFixed(1)}m</span>
            </li>
          ))}
        </ul>
      </FieldShell>
    </div>
  );
}
