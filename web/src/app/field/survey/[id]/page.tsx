"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Circle } from "lucide-react";
import { FieldShell } from "@/components/FieldShell";
import { DemoFlowNav } from "@/components/DemoFlowNav";
import {
  fieldSurveySteps,
  getFarm,
  getProducer,
  getSurvey,
  getValidations,
} from "@/data/mock";
import { saveOfflineDemo } from "@/lib/demo";
import { useDemoToast } from "@/components/DemoToast";

export default function FieldSurveyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const survey = getSurvey(id);
  const farm = survey ? getFarm(survey.farmId) : undefined;
  const producer = survey ? getProducer(survey.producerId) : undefined;
  const [steps, setSteps] = useState(fieldSurveySteps);
  const [practice, setPractice] = useState({
    variety: "Heirloom",
    fertilizer: "",
    shade: "",
  });
  const validations = getValidations(id);
  const { toast, node } = useDemoToast();

  function markDone(key: string) {
    setSteps((prev) =>
      prev.map((s) => {
        if (s.key !== key) return s;
        return { ...s, status: "완료" as const };
      }).map((s, i, arr) => {
        if (s.status === "대기" && arr[i - 1]?.status === "완료") {
          return { ...s, status: "진행" as const };
        }
        return s;
      }),
    );
  }

  function saveOffline() {
    const ok = saveOfflineDemo(`kijanify-survey-${id}`, {
      surveyId: id,
      steps,
      practice,
    });
    toast(
      ok
        ? "오프라인 캐시에 저장했습니다 · 네트워크 복구 시 동기화 (시연)"
        : "저장 공간을 사용할 수 없습니다",
    );
  }

  if (!survey || !farm) {
    return (
      <FieldShell title="조사 없음" backHref="/field">
        <p className="text-sm text-muted">조사를 찾을 수 없습니다.</p>
      </FieldShell>
    );
  }

  const active = steps.find((s) => s.status === "진행") ?? steps[steps.length - 1];

  return (
    <div>
      {node}
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <DemoFlowNav current="field-survey" />
      </div>
      <FieldShell
        title={survey.type}
        subtitle={`${producer?.name} · ${farm.name}`}
        backHref="/field"
        footer={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveOffline}
              className="flex-1 rounded-lg border border-line py-2.5 text-sm"
            >
              오프라인 저장
            </button>
            <Link
              href="/surveys"
              className="flex-1 rounded-lg bg-brand py-2.5 text-center text-sm font-medium text-white"
            >
              제출 · 검수로
            </Link>
          </div>
        }
      >
        <ol className="mb-4 space-y-2">
          {steps.map((s) => (
            <li
              key={s.key}
              className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
                s.status === "진행"
                  ? "border-brand bg-brand-soft"
                  : "border-line bg-surface"
              }`}
            >
              {s.status === "완료" ? (
                <Check size={16} className="mt-0.5 shrink-0 text-ok" />
              ) : (
                <Circle
                  size={16}
                  className={`mt-0.5 shrink-0 ${
                    s.status === "진행" ? "text-brand" : "text-muted"
                  }`}
                />
              )}
              <div>
                <p className="font-medium">
                  {s.n}. {s.title}
                </p>
                <p className="text-xs text-muted">{s.hint}</p>
              </div>
            </li>
          ))}
        </ol>

        {active?.key === "boundary" ? (
          <section className="rounded-xl border border-line bg-surface p-4">
            <p className="text-sm font-semibold">필지 경계 수집 중</p>
            <p className="mt-1 text-xs text-muted">
              GPS 화면에서 꼭짓점을 찍은 뒤 여기로 돌아와 완료 처리합니다.
            </p>
            <div className="mt-3 flex gap-2">
              <Link
                href="/field/gps"
                className="rounded-lg bg-brand px-3 py-2 text-xs font-medium text-white"
              >
                GPS 맵 열기
              </Link>
              <button
                type="button"
                onClick={() => markDone("boundary")}
                className="rounded-lg border border-line px-3 py-2 text-xs"
              >
                경계 수집 완료
              </button>
            </div>
          </section>
        ) : null}

        {active?.key === "practice" ? (
          <section className="space-y-3 rounded-xl border border-line bg-surface p-4">
            <p className="text-sm font-semibold">재배 관행 입력</p>
            <label className="block text-xs">
              <span className="text-muted">품종</span>
              <input
                className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
                value={practice.variety}
                onChange={(e) =>
                  setPractice((p) => ({ ...p, variety: e.target.value }))
                }
              />
            </label>
            <label className="block text-xs">
              <span className="text-muted">비료 사용량 (kg/ha) *</span>
              <input
                className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
                placeholder="필수"
                value={practice.fertilizer}
                onChange={(e) =>
                  setPractice((p) => ({ ...p, fertilizer: e.target.value }))
                }
              />
            </label>
            <label className="block text-xs">
              <span className="text-muted">차광 여부 *</span>
              <select
                className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
                value={practice.shade}
                onChange={(e) =>
                  setPractice((p) => ({ ...p, shade: e.target.value }))
                }
              >
                <option value="">선택</option>
                <option value="yes">있음</option>
                <option value="no">없음</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() => markDone("practice")}
              className="w-full rounded-lg bg-brand py-2 text-sm font-medium text-white"
            >
              저장하고 다음
            </button>
          </section>
        ) : null}

        {active?.key === "photos" ? (
          <section className="space-y-3 rounded-xl border border-line bg-surface p-4">
            <p className="text-sm font-semibold">현장 증빙 사진</p>
            <div className="relative h-40 overflow-hidden rounded-lg border border-line">
              <Image
                src="/evidence/farm-001/ground.jpg"
                alt="필지 전경"
                fill
                className="object-cover"
                sizes="400px"
                unoptimized
              />
            </div>
            <p className="text-xs text-muted">
              1/3 · 전경 촬영됨 · 경계·작물 사진 추가 필요
            </p>
            <button
              type="button"
              onClick={() => markDone("photos")}
              className="w-full rounded-lg bg-brand py-2 text-sm font-medium text-white"
            >
              사진 단계 완료
            </button>
          </section>
        ) : null}

        {active?.key === "review" ? (
          <section className="rounded-xl border border-line bg-surface p-4">
            <p className="text-sm font-semibold">제출 전 검증</p>
            <ul className="mt-2 space-y-2">
              {validations.map((v) => (
                <li
                  key={v.id}
                  className={`rounded-md border px-3 py-2 text-xs ${
                    v.ok
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-amber-200 bg-amber-50"
                  }`}
                >
                  <p className="font-medium">
                    [{v.kind}] {v.label} · {v.ok ? "통과" : "보완"}
                  </p>
                  <p className="mt-0.5 text-muted">{v.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {active?.key === "arrive" ? (
          <button
            type="button"
            onClick={() => markDone("arrive")}
            className="mt-2 w-full rounded-lg bg-brand py-2 text-sm font-medium text-white"
          >
            도착 확인 완료
          </button>
        ) : null}
      </FieldShell>
    </div>
  );
}
