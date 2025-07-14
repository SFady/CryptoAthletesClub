"use client";

import { useState } from "react";
import Link from "next/link";

export default function TopMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
         <header className="header">
          <div className="logo">
            <img src="/images/CAC.png" alt="Logo CAC" className="logo-icon" />
            <h1 className="crypto-title">The Crypto Athletes Club</h1>
          </div>
           <nav>
            <Link href="/home" style={{ fontWeight: selected === "home" ? "bold" : "normal" }}>Home</Link> |{" "}
            <Link href="/activities" style={{ fontWeight: selected === "activities" ? "bold" : "normal" }}>Activities</Link> |{" "}
            <Link href="/profile" style={{ fontWeight: selected === "profile" ? "bold" : "normal" }}>Profile</Link>
          </nav>
        </header>
        </>
  );
}
