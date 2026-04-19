"use client";

import { useBackToMain } from "../useBackToMain";

export default function About() {
  const goBack = useBackToMain();

  const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE
    ? (() => {
        const d = new Date(process.env.NEXT_PUBLIC_BUILD_DATE);
        return (
          String(d.getUTCDate()).padStart(2, "0") + "/" +
          String(d.getUTCMonth() + 1).padStart(2, "0") + "/" +
          String(d.getUTCFullYear()).slice(-2) + " - " +
          String(d.getUTCHours()).padStart(2, "0") + ":" +
          String(d.getUTCMinutes()).padStart(2, "0") + ":" +
          String(d.getUTCSeconds()).padStart(2, "0")
        );
      })()
    : "—";

  return (
    <main className="flex flex-col items-start min-h-[60vh] text-white px-6 py-6">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={goBack} className="text-gray-300 hover:text-white transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-3xl font-bold">À propos</h1>
      </div>

      <div className="w-full flex flex-col items-center text-center">
        <p className="max-w-md text-gray-200 mb-8">
          The Crypto Athletes Club est une plateforme dédiée au suivi des
          performances sportives et des actifs numériques des athlètes DEFIT.
        </p>
        <div className="bg-white/10 border border-white/20 rounded-xl px-6 py-3 text-sm text-gray-300">
          Version du <span className="text-white font-semibold">{buildDate}</span>
        </div>
      </div>
    </main>
  );
}
