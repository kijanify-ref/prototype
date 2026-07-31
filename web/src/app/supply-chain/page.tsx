import { AppShell } from "@/components/AppShell";
import { DemoFlowNav } from "@/components/DemoFlowNav";
import { featuredLotId, getSupplyChainForLot } from "@/data/mock";

const stageStyles: Record<string, string> = {
  완료: "border-ok bg-emerald-50",
  진행중: "border-brand bg-brand-soft",
  대기: "border-line bg-surface",
};

const dotStyles: Record<string, string> = {
  완료: "bg-ok",
  진행중: "bg-brand ring-4 ring-brand/20",
  대기: "bg-line",
};

export default function SupplyChainPage() {
  const stages = getSupplyChainForLot(featuredLotId);

  return (
    <AppShell title="공급망" subtitle="농장 → 협동조합 → 가공 → 수출 → EU">
      <DemoFlowNav current="supply-chain" />

      <section className="mb-6 rounded-xl border border-brand/30 bg-brand-soft p-5">
        <p className="text-xs font-medium text-brand">시연 로트</p>
        <h2 className="mt-1 text-lg font-semibold">{featuredLotId}</h2>
        <p className="mt-1 text-sm text-muted">
          Ethiopia Yirgacheffe · Abebe Tadesse · 6단계 공급망 추적
        </p>
      </section>

      <section className="relative">
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-line" />
        <div className="space-y-4">
          {stages.map((stage) => (
            <div key={stage.id} className="relative flex gap-4 pl-0">
              <div
                className={`relative z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${dotStyles[stage.status]}`}
              />
              <div
                className={`flex-1 rounded-xl border p-4 ${stageStyles[stage.status]}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted">Stage {stage.order}</p>
                    <h3 className="font-semibold">{stage.name}</h3>
                    <p className="mt-0.5 text-sm text-muted">{stage.location}</p>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                      stage.status === "완료"
                        ? "bg-emerald-100 text-ok"
                        : stage.status === "진행중"
                          ? "bg-brand/10 text-brand"
                          : "bg-bg text-muted"
                    }`}
                  >
                    {stage.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
                  <span>담당: {stage.actorRole}</span>
                  {stage.completedAt ? (
                    <span className="font-mono">완료: {stage.completedAt}</span>
                  ) : null}
                  {stage.co2eKg != null ? (
                    <span className="tabular-nums">
                      CO₂e: {stage.co2eKg.toLocaleString()} kg
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
