"use client";

import { useEffect, useState } from "react";

export function useDemoToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(() => setMessage(null), 2600);
    return () => window.clearTimeout(t);
  }, [message]);

  return {
    toast: (msg: string) => setMessage(msg),
    node: message ? (
      <div
        role="status"
        className="fixed bottom-5 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-lg bg-ink px-4 py-2.5 text-sm text-white shadow-lg"
      >
        {message}
      </div>
    ) : null,
  };
}
