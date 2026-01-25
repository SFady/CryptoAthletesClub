"use client"; // must be client-side
import { useEffect } from "react";

export default function RootPage() {
  useEffect(() => {
    window.location.href = `/home`;
  }, []);
}
