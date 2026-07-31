import { AppShell } from "@/components/AppShell";
import { DemoFlowNav } from "@/components/DemoFlowNav";
import {
  farms,
  featuredProducerId,
  getCooperative,
  producers,
} from "@/data/mock";

export default function ProducersPage() {
  const featured = producers.find((p) => p.id === featuredProducerId);

  return (
    <AppShell title="생산자" subtitle="등록 생산자 · 협동조합 · 인증">
      <DemoFlowNav />

      {featured ? (
        <section className="mb-6 rounded-xl border border-brand/30 bg-brand-soft p-5">
          <p className="text-xs font-medium text-brand">시연 주요 생산자</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">
            {featured.name}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {featured.region}, {featured.country} ·{" "}
            {getCooperative(featured.cooperativeId)?.name}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featured.certification.length > 0 ? (
              featured.certification.map((c) => (
                <span
                  key={c}
                  className="rounded-md bg-surface px-2 py-0.5 text-xs text-brand"
                >
                  {c}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted">인증 없음</span>
            )}
          </div>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="border-b border-line px-4 py-3">
          <h3 className="text-sm font-semibold">생산자 목록</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-bg text-xs text-muted">
            <tr>
              <th className="px-4 py-2 font-medium">생산자</th>
              <th className="px-4 py-2 font-medium">지역</th>
              <th className="px-4 py-2 font-medium">작물</th>
              <th className="px-4 py-2 font-medium">협동조합</th>
              <th className="px-4 py-2 font-medium">등록일</th>
              <th className="px-4 py-2 font-medium">재배지</th>
            </tr>
          </thead>
          <tbody>
            {producers.map((p) => {
              const coop = getCooperative(p.cooperativeId);
              const farmCount = farms.filter((f) => f.producerId === p.id).length;
              return (
                <tr
                  key={p.id}
                  className={`border-t border-line ${
                    p.id === featuredProducerId ? "bg-brand-soft/40" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted">{p.contactRole}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {p.region}
                    <br />
                    <span className="text-xs">{p.country}</span>
                  </td>
                  <td className="px-4 py-3 capitalize">{p.crop}</td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {coop?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{p.registeredAt}</td>
                  <td className="px-4 py-3 tabular-nums">{farmCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}
