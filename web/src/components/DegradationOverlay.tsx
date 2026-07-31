import Image from "next/image";
import type {
  DegradationHotspot,
  ImagePctPoint,
  LandUseAnalysis,
} from "@/data/mock";

const kindStyle = {
  deforestation: {
    fill: "rgba(220, 38, 38, 0.40)",
    stroke: "#fecaca",
    badge: "bg-red-600 text-white",
    chip: "border-red-300 bg-red-50 text-danger",
  },
  degradation: {
    fill: "rgba(217, 119, 6, 0.42)",
    stroke: "#fde68a",
    badge: "bg-amber-600 text-white",
    chip: "border-amber-300 bg-amber-50 text-warn",
  },
} as const;

/** 들쭉날쭉한 감지 경계를 부드럽게 보이도록 Catmull-Rom ≈ cubic 근사 */
function toOrganicPath(points: ImagePctPoint[]) {
  if (points.length < 3) return "";
  const pts = [...points, points[0], points[1], points[2]];
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length; i++) {
    const p0 = pts[i]!;
    const p1 = pts[i + 1]!;
    const p2 = pts[i + 2]!;
    const p3 = pts[i + 3]!;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return `${d} Z`;
}

function centroid(points: ImagePctPoint[]) {
  const n = points.length || 1;
  return {
    x: points.reduce((s, p) => s + p.x, 0) / n,
    y: points.reduce((s, p) => s + p.y, 0) / n,
  };
}

/** 위성 이미지 + 황폐화/산림전용 핫스팟 오버레이 */
export function AnnotatedSatImage({
  src,
  year,
  alt,
  hotspots = [],
  plotOutline,
  showLabels = true,
  compactCaption = false,
}: {
  src: string;
  year: number;
  alt?: string;
  hotspots?: DegradationHotspot[];
  plotOutline?: ImagePctPoint[];
  showLabels?: boolean;
  compactCaption?: boolean;
}) {
  return (
    <figure className="overflow-hidden rounded-lg border border-line bg-bg">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={src}
          alt={alt ?? `위성 ${year}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized
        />
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          {plotOutline && plotOutline.length >= 3 ? (
            <path
              d={toOrganicPath(plotOutline)}
              fill="rgba(255,255,255,0.03)"
              stroke="#e2e8f0"
              strokeWidth="0.7"
              strokeDasharray="2.4 1.8"
            />
          ) : null}
          {hotspots.map((h) => {
            const style = kindStyle[h.kind];
            return (
              <path
                key={h.id}
                d={toOrganicPath(h.points)}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth="0.9"
                strokeLinejoin="round"
              />
            );
          })}
        </svg>

        {showLabels
          ? hotspots.map((h) => {
              const c = centroid(h.points);
              const code = h.id.split("-")[0]?.toUpperCase() ?? "Z";
              return (
                <span
                  key={`lbl-${h.id}`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded px-1.5 py-0.5 text-[10px] font-bold shadow ${kindStyle[h.kind].badge}`}
                  style={{ left: `${c.x}%`, top: `${c.y}%` }}
                >
                  {code}
                </span>
              );
            })
          : null}

        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          <span className="rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
            {year}
          </span>
          {hotspots.length > 0 ? (
            <span className="rounded bg-red-700/90 px-1.5 py-0.5 text-[10px] font-medium text-white">
              감지 {hotspots.length}구역
            </span>
          ) : (
            <span className="rounded bg-emerald-700/90 px-1.5 py-0.5 text-[10px] font-medium text-white">
              이상 없음
            </span>
          )}
        </div>
      </div>

      {hotspots.length > 0 ? (
        <figcaption
          className={`space-y-1 border-t border-line bg-surface px-2.5 ${
            compactCaption ? "py-1.5" : "py-2"
          }`}
        >
          {hotspots.map((h) => (
            <div
              key={h.id}
              className={`flex items-start justify-between gap-2 rounded-md border px-2 py-1 text-[11px] ${kindStyle[h.kind].chip}`}
            >
              <div>
                <p className="font-semibold">
                  {h.label} · {h.areaHa.toFixed(2)} ha
                </p>
                {!compactCaption ? (
                  <p className="opacity-80">{h.note}</p>
                ) : null}
              </div>
              <span
                className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${kindStyle[h.kind].badge}`}
              >
                {h.kind === "deforestation" ? "전용" : "황폐"}
              </span>
            </div>
          ))}
        </figcaption>
      ) : (
        <figcaption className="border-t border-line px-2.5 py-1.5 text-[11px] text-muted">
          {year} · 핫스팟 없음
        </figcaption>
      )}
    </figure>
  );
}

/** 2021 vs 2025 황폐화 위치 비교 + 범례 */
export function DegradationHotspotCompare({
  analysis,
}: {
  analysis: LandUseAnalysis;
}) {
  const before = analysis.series.find((s) => s.year === 2021);
  const after = analysis.series.find((s) => s.year === 2025);
  if (!before || !after) return null;

  const hotBefore = analysis.hotspotsByYear?.[2021] ?? [];
  const hotAfter = analysis.hotspotsByYear?.[2025] ?? [];
  const totalHa = hotAfter.reduce((s, h) => s + h.areaHa, 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 text-[11px]">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-4 rounded-sm bg-red-500/70 ring-1 ring-red-300" />
          산림전용 (D)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-4 rounded-sm bg-amber-500/70 ring-1 ring-amber-300" />
          황폐화 (G)
        </span>
        <span className="inline-flex items-center gap-1.5 text-muted">
          <span className="inline-block h-0 w-4 border-t border-dashed border-slate-400" />
          필지 경계
        </span>
        <span className="ml-auto tabular-nums text-muted">
          2025 표시 합계 ≈ {totalHa.toFixed(2)} ha
        </span>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <AnnotatedSatImage
          src={before.imageSrc}
          year={2021}
          alt="2021 기준 · 컷오프 직후"
          hotspots={hotBefore}
          plotOutline={analysis.plotOutlinePct}
        />
        <AnnotatedSatImage
          src={after.imageSrc}
          year={2025}
          alt="2025 현재 · 황폐화 확대"
          hotspots={hotAfter}
          plotOutline={analysis.plotOutlinePct}
        />
      </div>

      <div className="rounded-lg border border-danger/20 bg-white/70 px-3 py-2 text-xs leading-relaxed text-muted">
        <span className="font-medium text-danger">위치 판독 · </span>
        위성 기준 <span className="font-medium text-ink">우측 개간·나출</span>이
        빨간 D1(산림전용{" "}
        {analysis.deforestationAfterCutoffHa.toFixed(2)}ha),{" "}
        <span className="font-medium text-ink">밀림–개간 전이 수관선</span>이
        주황 G1·G2(황폐화 Δ +{analysis.degradationDeltaHa.toFixed(2)}ha ·
        캐노피 {analysis.canopyDeltaPp}%p)입니다. LUC{" "}
        {(analysis.lucAnnualCo2eKg / 1000).toFixed(2)} t/년은 이 경계 변화에서
        배분됩니다.
      </div>
    </div>
  );
}
