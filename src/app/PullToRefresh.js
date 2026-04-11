"use client";

import { useEffect, useState } from "react";

export default function PullToRefresh() {
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 768) return;
    let startY = 0;
    let triggered = false;

    const onTouchStart = (e) => {
      const scrollEl = document.querySelector("main");
      const atTop = !scrollEl || scrollEl.scrollTop === 0;
      startY = atTop ? e.touches[0].clientY : -1;
      triggered = false;
    };
    const onTouchMove = (e) => {
      if (startY < 0) return;
      if (!triggered && e.touches[0].clientY - startY > 70) {
        triggered = true;
        setRefreshing(true);
      }
    };
    const onTouchEnd = () => {
      if (triggered) {
        window.location.reload();
      }
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  if (!refreshing) return null;

  return (
    <div className="fixed top-16 left-0 right-0 flex justify-center z-50 md:hidden">
      <span className="text-white/70 text-xs bg-white/10 px-3 py-1 rounded-full animate-pulse">
        Actualisation…
      </span>
    </div>
  );
}
