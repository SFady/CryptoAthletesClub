"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "auth_session";
const TTL_DAYS    = 365;

const ATHLETES = [
  { id: "usopp",  label: "Usopp" },
  { id: "nicor",  label: "Nico Robin" },
  { id: "dteach", label: "DTeach" },
  { id: "jinbe",  label: "Jinbe" },
];

function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { token, expiry } = JSON.parse(raw);
    if (Date.now() > expiry) { localStorage.removeItem(STORAGE_KEY); return null; }
    return token;
  } catch { return null; }
}

function saveSession(token, user) {
  const expiry = Date.now() + TTL_DAYS * 24 * 3600 * 1000;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user, expiry }));
  localStorage.setItem("last_user", user);
}

function getLastUser() {
  return localStorage.getItem("last_user") ?? "usopp";
}

export default function LoginGate({ children }) {
  const [ready, setReady]     = useState(false);
  const [authed, setAuthed]   = useState(false);
  const [user, setUser]       = useState("usopp");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow]       = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session) setAuthed(true);
    setUser(getLastUser());
    setReady(true);
    setTimeout(() => setShow(true), 50);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      const data = await res.json();
      if (data.ok) {
        saveSession(data.token, data.user);
        setAuthed(true);
      } else {
        setError("Mot de passe incorrect");
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) return null;
  if (authed) return children;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 z-50">
      <div className="relative w-full max-w-sm">

        {/* Glow */}
        <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 opacity-50 blur-3xl animate-pulse" />

        {/* Modale */}
        <div className={`relative bg-white/20 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-2xl p-6 text-white transform transition-all duration-500 ease-out ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          <h2 className="text-xl font-bold text-center mb-6 drop-shadow-md">
            The Crypto Athletes Club
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <select
              value={user}
              onChange={e => setUser(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#D6C48A]/50"
            >
              {ATHLETES.map(a => (
                <option key={a.id} value={a.id} className="bg-[#3b2d8a]">{a.label}</option>
              ))}
            </select>

            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mot de passe"
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D6C48A]/50"
            />

            {error && <p className="text-rose-300 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-2.5 rounded-xl text-white font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 active:scale-95 transition-all duration-200 shadow-lg disabled:opacity-50"
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
