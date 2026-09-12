"use client";

import { useState } from "react";

function authHeader() {
  try {
    const { token } = JSON.parse(localStorage.getItem("auth_session") ?? "{}");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch { return {}; }
}

export default function Sfysell() {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/insert-sell", {
        method: "POST",
        body: new FormData(e.target),
        headers: authHeader(),
      });
      const data = await res.json();
      setResult(res.ok ? { ok: true, ...data } : { ok: false, error: data.error ?? "Erreur" });
    } catch (err) {
      setResult({ ok: false, error: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="flex flex-col items-start min-h-screen text-white bg-[#5f3dc4] px-6 py-6">
      <h1 className="text-2xl mb-4">Ajouter une donnée</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">

        <input
          type="text"
          name="date_sell"
          placeholder="date_sell"
          required
          className="px-3 py-2 rounded text-black"
        />

        <input
          type="text"
          name="defit_amount"
          placeholder="defit_amount"
          required
          className="px-3 py-2 rounded text-black"
        />

        <button
          type="submit"
          disabled={sending}
          className="bg-white text-[#5f3dc4] font-semibold py-2 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          {sending ? "Envoi…" : "Envoyer"}
        </button>

        {result && (
          <div className={`text-sm rounded-lg px-4 py-3 ${result.ok ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>
            {result.ok ? (result.message ?? "✅ Calc OK") : `Erreur: ${result.error}`}
          </div>
        )}
      </form>
    </main>
  );
}
