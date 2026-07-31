import Link from "next/link";
import { ArrowRight, AlertTriangle, Info } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DemoFlowNav } from "@/components/DemoFlowNav";
import {
  alerts,
  featuredLotId,
  getProducer,
  opsKpis,
} from "@/data/mock";

const severityStyles = {
  info: "border-brand/20 bg-brand-soft text-brand",
  warn: "border-amber-200 bg-amber-50 text-warn",
  danger: "border-red-200 bg-red-50 text-danger",
};

const severityIcon = {
  info: Info,
  warn: AlertTriangle,
  danger: AlertTriangle,
};

export default function HomePage() {
  const featured = getProducer("prod-001");

  return (
    <AppShell
      title="공급망·탄소 현황"
      subtitle="커피·코코아 · ESG/EUDR · 탄소 데이터"
    >
      <DemoFlowNav current="home" />

      <section className="rounded-xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              {featuredLotId} · {featured?.name} · Yirgacheffe Arabica
            </h2>
            <p className="mt-1 text-sm text-muted">
              조사원 현장(GPS·조사서) → 검수 → 토지이용·5년(LUC) → 탄소 →
              EUDR·DDS → 공급망 순으로 시연합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/field"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white"
            >
              시연 시작 · 조사원 현장
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/producers"
              className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm"
            >
              마스터 데이터
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {opsKpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-line bg-surface p-4"
          >
            <p className="text-xs text-muted">{kpi.label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {kpi.value}
              {kpi.unit ? (
                <span className="ml-1 text-sm font-normal text-muted">
                  {kpi.unit}
                </span>
              ) : null}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-6">
        <h3 className="mb-3 text-sm font-semibold">알림</h3>
        <div className="space-y-2">
          {alerts.map((alert) => {
            const Icon = severityIcon[alert.severity];
            return (
              <div
                key={alert.id}
                className={`flex gap-3 rounded-xl border p-4 ${severityStyles[alert.severity]}`}
              >
                <Icon size={18} className="mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{alert.title}</p>
                  <p className="mt-0.5 text-xs opacity-90">{alert.message}</p>
                  <p className="mt-1 text-[10px] opacity-70">{alert.createdAt}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
