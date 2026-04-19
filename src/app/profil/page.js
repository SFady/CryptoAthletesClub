"use client";

import { useEffect, useState } from "react";
import { useBackToMain } from "../useBackToMain";

const USER_ID_MAP = { usopp: "1", dteach: "2", nicor: "3", jinbe: "4" };

export default function Profil() {
  const goBack = useBackToMain();
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const { user } = JSON.parse(localStorage.getItem("auth_session") ?? "{}");
      const id = USER_ID_MAP[user];
      setUserId(id);
      if (id) {
        fetch(`/api/profil?id=${id}`)
          .then(r => r.json())
          .then(d => setEmail(d.email ?? ""));
      }
    } catch { /* ignore */ }
  }, []);

  const handleSave = async () => {
    if (!userId) return;
    await fetch("/api/profil", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, email }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="flex flex-col items-start min-h-[60vh] text-white px-6 py-6">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={goBack} className="text-gray-300 hover:text-white transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Profil</h1>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300">&nbsp;Adresse e-mail</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setSaved(false); }}
              placeholder="exemple@mail.com"
              className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button
              onClick={handleSave}
              className="flex-shrink-0 bg-white text-[#5f3dc4] font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              {saved ? "✓" : "Sauver"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300">&nbsp;Strava</label>
          <div className="flex gap-2">
            <button
              disabled
              className="flex-shrink-0 bg-white/10 text-white/40 font-semibold px-4 py-2 rounded-lg cursor-not-allowed whitespace-nowrap"
            >
              Tester la connexion
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
