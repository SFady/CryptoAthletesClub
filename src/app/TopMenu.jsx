"use client";

import { useState } from "react";

export default function TopMenu() {
  const [open, setOpen] = useState(false);

  return (
         <header className="header">
          <div className="logo">
            <img src="/images/CAC.png" alt="Logo CAC" className="logo-icon" />
            <h1 className="crypto-title">The Crypto Athletes Club</h1>
          </div>

          <nav className={`nav ${open ? "nav-open" : ""}`}>
            <a href="/" onClick={() => setOpen(false)}>Accueil</a>
            <a href="/activities" onClick={() => setOpen(false)}>Activités</a>
            <a href="/divers" onClick={() => setOpen(false)}>Divers</a>
          </nav>
        </header>
  );
}
