"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DemoFlowNav } from "@/components/DemoFlowNav";
import { useDemoToast } from "@/components/DemoToast";
import {
  getFarm,
  getProducer,
  getValidations,
  surveyStatusOrder,
  surveys,
  validationItems,
} from "@/data/mock";

const statusStyles: Record<string, string> = {
  신청: "bg-bg text-muted",
  진행: "bg-blue-50 text-blue-700",
  검수: "bg-amber-50 text-warn",
  승인: "bg-emerald-50 text-ok",
  반려: "bg-red-50 text-danger",
};

type ReviewDecision = "대기" | "승인" | "반려";

export default function SurveysPage() {
  const reviewTarget = surveys.find((s) => s.id === "srv-004")!;
  const vals = getValidations(reviewTarget.id);
  const [decision, setDecision] = useState<ReviewDecision>("대기");
  const { toast, node } = useDemoToast();
  const allPassed = vals.every((v) => v.ok);

  function approve() {
    setDecision("승인");
    toast(
      allPassed
        ? "조사 승인 완료 · 탄소·EUDR 산출에 반영됩니다 (시연)"
        : "보완 항목을 시연상 통과 처리하고 승인했습니다 · 토지이용으로 이어가세요",
    );
  }

  function reject() {
    setDecision("반려");
    toast("반려 · 재조사 요청을 조사원에게 전달했습니다 (시연)");
  }

  return (
    <AppShell
      title="검수·승인"
      subtitle="필수값 · GPS · 사진 검증 후 승인/반려"
    >
      <DemoFlowNav current="surveys" />
      {node}

      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-5">
          <p className="text-xs font-medium text-brand">검수 대기 · 시연</p>
          <h2 className="mt-1 text-lg font-semibold">{reviewTarget.type}</h2>
          <p className="mt-1 text-sm text-muted">
            {getProducer(reviewTarget.producerId)?.name} ·{" "}
            {getFarm(reviewTarget.farmId)?.name}
          </p>
          {decision !== "대기" ? (
            <p
              className={`mt-3 rounded-md px-3 py-2 text-sm font-medium ${
                decision === "승인"
                  ? "bg-emerald-50 text-ok"
                  : "bg-red-50 text-danger"
              }`}
            >
              검수 결과: {decision}
              {decision === "승인"
                ? " · 탄소 산출·DDS에 반영"
                : " · 현장 재조사 필요"}
            </p>
          ) : null}
          <ul className="mt-4 space-y-2">
            {vals.map((v) => (
              <li
                key={v.id}
                className={`rounded-md border px-3 py-2 text-sm ${
                  v.ok
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <p className="font-medium">
                  [{v.kind}] {v.label} — {v.ok ? "통과" : "보완"}
                </p>
                <p className="text-xs text-muted">{v.detail}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={approve}
              disabled={decision === "승인"}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              승인
            </button>
            <button
              type="button"
              onClick={reject}
              disabled={decision === "반려"}
              className="rounded-lg border border-line px-4 py-2 text-sm disabled:opacity-50"
            >
              반려 · 재조사
            </button>
            <Link
              href="/field/survey/srv-004"
              className="rounded-lg border border-line px-4 py-2 text-sm"
            >
              조사원 화면
            </Link>
            {decision === "승인" ? (
              <Link
                href="/land-use"
                className="rounded-lg border border-brand/30 bg-brand-soft px-4 py-2 text-sm font-medium text-brand"
              >
                토지이용·5년 →
              </Link>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5">
          <h3 className="text-sm font-semibold">검증 요약</h3>
          <p className="mt-2 text-sm text-muted">
            전체 검증 항목 {validationItems.length} · 실패{" "}
            {validationItems.filter((v) => !v.ok).length}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {surveyStatusOrder.map((status, i) => {
              const count = surveys.filter((s) => s.status === status).length;
              return (
                <span key={status} className="flex items-center gap-2">
                  {i > 0 ? (
                    <span className="text-muted/40" aria-hidden>
                      →
                    </span>
                  ) : null}
                  <span
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${statusStyles[status]}`}
                  >
                    {status} · {count}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="border-b border-line px-4 py-3">
          <h3 className="text-sm font-semibold">조사 목록</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-bg text-xs text-muted">
            <tr>
              <th className="px-4 py-2 font-medium">조사</th>
              <th className="px-4 py-2 font-medium">재배지</th>
              <th className="px-4 py-2 font-medium">상태</th>
              <th className="px-4 py-2 font-medium">담당</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((s) => {
              const status =
                s.id === "srv-004" && decision !== "대기"
                  ? decision === "승인"
                    ? "승인"
                    : "검수"
                  : s.status;
              return (
                <tr key={s.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium">{s.type}</td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {getFarm(s.farmId)?.name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusStyles[status]}`}
                    >
                      {s.id === "srv-004" && decision === "반려"
                        ? "반려"
                        : status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {s.inspectorRole}
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
