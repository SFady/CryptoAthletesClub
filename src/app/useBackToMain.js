"use client";

import { useRouter } from "next/navigation";

export function useBackToMain() {
  const router = useRouter();
  return () => {
    const last = typeof window !== "undefined" ? localStorage.getItem("lastMainPage") : null;
    router.push(last ?? "/home");
  };
}
