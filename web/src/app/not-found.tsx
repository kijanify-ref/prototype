import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-4">
      <p className="text-lg font-semibold text-ink">페이지를 찾을 수 없습니다</p>
      <p className="text-sm text-muted">시연 경로를 확인하거나 현황으로 돌아가세요.</p>
      <Link href="/" className="text-sm font-medium text-brand hover:underline">
        현황으로 이동
      </Link>
    </div>
  );
}
