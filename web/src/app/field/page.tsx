import Image from "next/image";
import Link from "next/link";
import { CloudOff, MapPin, Radio } from "lucide-react";
import { FieldShell } from "@/components/FieldShell";
import { DemoFlowNav } from "@/components/DemoFlowNav";
import {
  fieldAssignments,
  getFarm,
  getProducer,
} from "@/data/mock";

export default function FieldHomePage() {
  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <DemoFlowNav current="field" />
      </div>
      <FieldShell
        title="오늘의 현장 조사"
        subtitle="조사원 · 오프라인 동기화"
        backHref="/"
        footer={
          <div className="flex gap-2">
            <Link
              href="/field/gps"
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-brand py-2.5 text-sm font-medium text-white"
            >
              <MapPin size={16} />
              GPS 필지 수집
            </Link>
            <Link
              href="/field/survey/srv-004"
              className="flex flex-1 items-center justify-center rounded-lg border border-line py-2.5 text-sm font-medium"
            >
              조사서 열기
            </Link>
          </div>
        }
      >
        <div className="relative mb-4 h-36 overflow-hidden rounded-xl border border-line">
          <Image
            src="/evidence/field/surveyor.jpg"
            alt="현장 조사"
            fill
            className="object-cover"
            sizes="400px"
            unoptimized
            priority
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-3 py-2">
            <p className="text-xs font-medium text-white">
              현장 GPS · 폴리곤 · 증빙 사진
            </p>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-xs">
          <Radio size={14} className="text-ok" />
          <span>GPS 수신 양호 · 정확도 ±4m</span>
          <span className="ml-auto inline-flex items-center gap-1 text-muted">
            <CloudOff size={12} />
            오프라인 캐시 1건
          </span>
        </div>

        <p className="mb-2 text-xs font-medium text-muted">배정 조사</p>
        <ul className="space-y-3">
          {fieldAssignments.map((a) => {
            const farm = getFarm(a.farmId);
            const producer = getProducer(a.producerId);
            return (
              <li key={a.surveyId}>
                <Link
                  href={
                    a.surveyId === "srv-004"
                      ? "/field/survey/srv-004"
                      : "/field/gps"
                  }
                  className="block rounded-xl border border-line bg-surface p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{a.title}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {producer?.name} · {farm?.name}
                      </p>
                    </div>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                        a.priority === "높음"
                          ? "bg-red-50 text-danger"
                          : "bg-amber-50 text-warn"
                      }`}
                    >
                      {a.priority}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted">
                    <span className="rounded-md bg-bg px-2 py-1">
                      {a.distanceKm} km
                    </span>
                    <span className="rounded-md bg-bg px-2 py-1">
                      {a.offlineCached ? "오프라인 가능" : "온라인 필요"}
                    </span>
                    <span className="rounded-md bg-bg px-2 py-1 font-mono">
                      {farm?.gps.lat.toFixed(4)}, {farm?.gps.lng.toFixed(4)}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </FieldShell>
    </div>
  );
}
