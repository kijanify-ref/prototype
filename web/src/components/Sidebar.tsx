"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardCheck,
  Factory,
  FileCheck,
  Home,
  Leaf,
  LogOut,
  MapPinned,
  Smartphone,
  Trees,
  Truck,
  Users,
  Map,
} from "lucide-react";

const navGroups = [
  {
    title: "시연 · 현장→규제",
    items: [
      { href: "/", label: "1. 현황", icon: Home },
      { href: "/field", label: "2. 조사원 현장", icon: Smartphone },
      { href: "/field/gps", label: "3. GPS 필지", icon: MapPinned },
      {
        href: "/field/survey/srv-004",
        label: "4. 현장 조사서",
        icon: ClipboardCheck,
      },
      { href: "/surveys", label: "5. 검수·승인", icon: ClipboardCheck },
      { href: "/land-use", label: "6. 토지이용·5년", icon: Trees },
      { href: "/carbon", label: "7. 탄소", icon: Leaf },
      { href: "/eudr", label: "8. EUDR·DDS", icon: FileCheck },
      { href: "/supply-chain", label: "9. 공급망", icon: Truck },
    ],
  },
  {
    title: "마스터 데이터",
    items: [
      { href: "/producers", label: "생산자·조합", icon: Users },
      { href: "/farms", label: "재배지·지도", icon: Map },
    ],
  },
];

function normalizePath(path: string) {
  if (!path) return "/";
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

function isActive(pathname: string, href: string) {
  const path = normalizePath(pathname);
  const target = normalizePath(href);
  if (target === "/") return path === "/";
  if (target === "/field") return path === "/field";
  if (target === "/surveys") return path === "/surveys";
  return path === target || path.startsWith(`${target}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-line bg-surface">
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-line px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-[10px] font-bold text-white">
          KJ
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">KIJANIFY</p>
          <p className="truncate text-[10px] text-muted">현장 · 탄소 · EUDR</p>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-2.5 py-3">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="px-2.5 pb-1 text-[10px] font-medium text-muted">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={`${group.title}-${item.href}`}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition ${
                      active
                        ? "bg-brand-soft font-medium text-brand"
                        : "text-ink hover:bg-bg"
                    }`}
                  >
                    <Icon size={15} className="shrink-0 opacity-80" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-line p-2.5">
        <div className="mb-2 flex items-center gap-2 rounded-md bg-brand-soft px-2.5 py-2">
          <Factory size={14} className="shrink-0 text-brand" />
          <div className="min-w-0 text-[10px]">
            <p className="font-medium text-brand">키자미테이블</p>
            <p className="text-muted">프로토타입 · Mock</p>
          </div>
        </div>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-muted"
        >
          <LogOut size={15} />
          세션 종료
        </button>
      </div>
    </aside>
  );
}
