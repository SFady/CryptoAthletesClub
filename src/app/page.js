"use client";

import { useEffect } from "react";
import { useAuth } from "./AuthContext";

export default function RootPage() {
  const { ready, authed } = useAuth();

  useEffect(() => {
    if (!ready) return;
    window.location.href = authed ? "/dashboard" : "/home";
  }, [ready, authed]);

  return null;
}
