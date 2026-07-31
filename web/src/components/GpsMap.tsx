"use client";

/**
 * 시연용 GPS 폴리곤 맵
 * — AI 항공/위성 배경 위에 고정 bounds로 경계 폴리곤을 그립니다.
 */
export function GpsMap({
  points,
  current,
  showBuffer = true,
  basemapSrc = "/evidence/field/gps-ortho.png",
  /** 고정 지도 범위 (없으면 포인트±패딩) */
  bounds,
  closed = true,
}: {
  points: { lat: number; lng: number; label?: string }[];
  current?: { lat: number; lng: number };
  showBuffer?: boolean;
  basemapSrc?: string;
  bounds?: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  closed?: boolean;
}) {
  const W = 360;
  const H = 280;

  if (!points.length) {
    return (
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-bg text-sm text-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={basemapSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <span className="relative z-10 rounded-md bg-white/90 px-3 py-1.5 text-xs">
          좌표를 수집하면 필지 폴리곤이 표시됩니다
        </span>
      </div>
    );
  }

  const pad = 0.00035;
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = bounds?.minLat ?? Math.min(...lats) - pad;
  const maxLat = bounds?.maxLat ?? Math.max(...lats) + pad;
  const minLng = bounds?.minLng ?? Math.min(...lngs) - pad;
  const maxLng = bounds?.maxLng ?? Math.max(...lngs) + pad;

  const margin = 28;
  const toXY = (lat: number, lng: number) => {
    const x =
      margin + ((lng - minLng) / (maxLng - minLng)) * (W - margin * 2);
    const y =
      margin + (1 - (lat - minLat) / (maxLat - minLat)) * (H - margin * 2);
    return { x, y };
  };

  const xy = points.map((p) => toXY(p.lat, p.lng));
  const polyPts = xy.map((p) => `${p.x},${p.y}`).join(" ");
  const closedPts =
    closed && xy.length >= 3
      ? `${polyPts} ${xy[0].x},${xy[0].y}`
      : polyPts;

  // 버퍼: 중심에서 8% 바깥으로 확장한 점선 폴리곤
  const cx = xy.reduce((s, p) => s + p.x, 0) / xy.length;
  const cy = xy.reduce((s, p) => s + p.y, 0) / xy.length;
  const bufferPts = xy
    .map((p) => {
      const bx = cx + (p.x - cx) * 1.12;
      const by = cy + (p.y - cy) * 1.12;
      return `${bx},${by}`;
    })
    .join(" ");

  const cur = current ? toXY(current.lat, current.lng) : null;
  const canClose = points.length >= 4;

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-black shadow-sm">
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label="GPS 필지 폴리곤 맵"
        >
          <image
            href={basemapSrc}
            x="0"
            y="0"
            width={W}
            height={H}
            preserveAspectRatio="xMidYMid slice"
          />
          {/* 가독성용 살짝 어두운 오버레이 */}
          <rect width={W} height={H} fill="#0b1a12" opacity="0.18" />

          {showBuffer && canClose ? (
            <polygon
              points={bufferPts}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.5"
              strokeDasharray="5 4"
              opacity="0.85"
            />
          ) : null}

          {canClose ? (
            <polygon
              points={polyPts}
              fill="#22c55e55"
              stroke="#ecfdf5"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
          ) : (
            <polyline
              points={closedPts}
              fill="none"
              stroke="#ecfdf5"
              strokeWidth="2.8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {/* 변 번호 느낌의 연결선 강조 */}
          {xy.length >= 2
            ? xy.slice(0, -1).map((p, i) => {
                const n = xy[i + 1];
                return (
                  <line
                    key={`e-${i}`}
                    x1={p.x}
                    y1={p.y}
                    x2={n.x}
                    y2={n.y}
                    stroke="#86efac"
                    strokeWidth="1.2"
                    opacity="0.9"
                  />
                );
              })
            : null}
          {canClose && closed ? (
            <line
              x1={xy[xy.length - 1].x}
              y1={xy[xy.length - 1].y}
              x2={xy[0].x}
              y2={xy[0].y}
              stroke="#86efac"
              strokeWidth="1.2"
              opacity="0.9"
            />
          ) : null}

          {xy.map((p, i) => (
            <g key={`v-${i}`}>
              <circle cx={p.x} cy={p.y} r="9" fill="#052e16" opacity="0.55" />
              <circle
                cx={p.x}
                cy={p.y}
                r="6"
                fill="#f0fdf4"
                stroke="#15803d"
                strokeWidth="2"
              />
              <rect
                x={p.x + 8}
                y={p.y - 16}
                width={28}
                height={14}
                rx="3"
                fill="#052e16"
                opacity="0.85"
              />
              <text
                x={p.x + 22}
                y={p.y - 6}
                textAnchor="middle"
                fontSize="9"
                fill="#ecfdf5"
                fontWeight="700"
              >
                {points[i].label ?? `P${i + 1}`}
              </text>
            </g>
          ))}

          {cur ? (
            <g>
              <circle cx={cur.x} cy={cur.y} r="14" fill="#ef4444" opacity="0.25" />
              <circle
                cx={cur.x}
                cy={cur.y}
                r="5"
                fill="#ef4444"
                stroke="#fff"
                strokeWidth="1.5"
              />
              <text
                x={cur.x}
                y={cur.y + 22}
                textAnchor="middle"
                fontSize="9"
                fill="#fecaca"
                fontWeight="600"
              >
                GPS
              </text>
            </g>
          ) : null}
        </svg>

        <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1">
          <span className="rounded bg-black/65 px-2 py-0.5 text-[10px] font-medium text-white">
            드론 정사 · 시연
          </span>
          {canClose ? (
            <span className="rounded bg-emerald-700/90 px-2 py-0.5 text-[10px] font-medium text-white">
              폴리곤 폐합
            </span>
          ) : (
            <span className="rounded bg-amber-600/90 px-2 py-0.5 text-[10px] font-medium text-white">
              꼭짓점 {points.length}/4
            </span>
          )}
        </div>
        {showBuffer && canClose ? (
          <span className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/65 px-2 py-0.5 text-[10px] text-amber-200">
            노란 점선 · 삼림 버퍼
          </span>
        ) : null}
      </div>
      <p className="border-t border-line bg-surface px-3 py-1.5 text-[11px] text-muted">
        AI 정사영상 배경 · EUDR geolocation 폴리곤 시연 · 실서비스 시 위성 SDK 연동
      </p>
    </div>
  );
}
