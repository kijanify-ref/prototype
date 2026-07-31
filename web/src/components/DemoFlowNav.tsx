"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

/** 현장(조사원) → 검수 → 규제대응 시연 순서 */
export const DEMO_STEPS = [
  { id: "home", href: "/", label: "현황" },
  { id: "field", href: "/field", label: "조사원 현장" },
  { id: "gps", href: "/field/gps", label: "GPS 필지" },
  { id: "field-survey", href: "/field/survey/srv-004", label: "현장 조사서" },
  { id: "surveys", href: "/surveys", label: "검수·승인" },
  { id: "land-use", href: "/land-use", label: "토지이용·5년" },
  { id: "carbon", href: "/carbon", label: "탄소" },
  { id: "eudr", href: "/eudr", label: "EUDR·DDS" },
  { id: "supply-chain", href: "/supply-chain", label: "공급망" },
] as const;

function normalizePath(path: string) {
  if (!path) return "/";
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function DemoFlowNav({
  current,
}: {
  current?: (typeof DEMO_STEPS)[number]["id"];
}) {
  const pathname = normalizePath(usePathname());
  const idx = Math.max(
    0,
    DEMO_STEPS.findIndex((s) => {
      if (current) return s.id === current;
      const href = normalizePath(s.href);
      if (href === "/") return pathname === "/";
      // /field 는 정확히 홈만 ( /field/gps 등과 구분 )
      if (href === "/field") return pathname === "/field";
      if (href === "/surveys") return pathname === "/surveys";
      return pathname === href || pathname.startsWith(`${href}/`);
    }),
  );
  const next = DEMO_STEPS[idx + 1];
  const isLast = idx === DEMO_STEPS.length - 1;

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3 text-sm">
      <nav className="flex flex-wrap items-center gap-1" aria-label="시연 흐름">
        {DEMO_STEPS.map((s, i) => {
          const active = i === idx;
          return (
            <span key={s.id} className="flex items-center gap-1">
              {i > 0 ? (
                <span className="text-muted/40" aria-hidden>
                  /
                </span>
              ) : null}
              <Link
                href={s.href}
                className={
                  active
                    ? "font-medium text-brand"
                    : "text-muted hover:text-ink"
                }
              >
                {s.label}
              </Link>
            </span>
          );
        })}
      </nav>
      {next ? (
        <Link
          href={next.href}
          className="inline-flex items-center gap-1 rounded-md bg-brand px-2.5 py-1 text-xs font-medium text-white"
        >
          다음 · {next.label}
          <ArrowRight size={12} />
        </Link>
      ) : isLast ? (
        <Link
          href="/"
          className="text-xs font-medium text-muted hover:text-ink"
        >
          시연 완료 · 현황으로
        </Link>
      ) : null}
    </div>
  );
}
