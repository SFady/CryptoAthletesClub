"use client";

import React from "react";

export default function TopMenu({ selected, onSelect }) {
  return (
    <header className="header">
      <div className="logo">
        <img src="/images/CAC.png" alt="Logo CAC" className="logo-icon" />
        <h1 className="crypto-title">The Crypto Athletes Club</h1>
      </div>

      <nav className="nav">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelect("home");
          }}
          className={selected === "home" ? "active" : ""}
        >
          Accueil
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelect("activities");
          }}
          className={selected === "activities" ? "active" : ""}
        >
          Activités
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelect("divers");
          }}
          className={selected === "divers" ? "active" : ""}
        >
          Divers
        </a>
      </nav>
    </header>
  );
}
