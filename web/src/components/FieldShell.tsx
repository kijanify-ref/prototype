import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** 조사원 모바일 시연용 폰 프레임 */
export function FieldShell({
  title,
  subtitle,
  backHref = "/field",
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh items-start justify-center bg-slate-800 px-4 py-6">
      <div className="flex w-full max-w-md flex-col">
        <div className="mb-3 flex items-center justify-between text-xs text-white/70">
          <Link href="/" className="hover:text-white">
            ← 관리자 콘솔
          </Link>
          <span>조사원 앱 · 시연</span>
        </div>
        <div className="overflow-hidden rounded-[1.75rem] border-[6px] border-slate-900 bg-bg shadow-2xl">
          <div className="flex items-center gap-2 bg-brand px-4 py-3 text-white">
            <Link
              href={backHref}
              className="rounded-md p-1 hover:bg-white/10"
              aria-label="뒤로"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{title}</p>
              {subtitle ? (
                <p className="truncate text-[11px] text-white/80">{subtitle}</p>
              ) : null}
            </div>
          </div>
          <div className="max-h-[70vh] overflow-y-auto px-4 py-4">{children}</div>
          {footer ? (
            <div className="border-t border-line bg-surface px-4 py-3">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
