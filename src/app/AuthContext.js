"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "auth_session";
const TTL_DAYS    = 365;

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { token, expiry } = JSON.parse(raw);
    if (Date.now() > expiry) { localStorage.removeItem(STORAGE_KEY); return null; }
    return token;
  } catch { return null; }
}

export function saveSession(token, user) {
  const expiry = Date.now() + TTL_DAYS * 24 * 3600 * 1000;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user, expiry }));
  localStorage.setItem("last_user", user);
}

export function AuthProvider({ children }) {
  const [ready, setReady]     = useState(false);
  const [authed, setAuthed]   = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = getSession();
    if (!token) { setReady(true); return; }

    fetch("/api/session", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (d.ok) setAuthed(true);
        else localStorage.removeItem(STORAGE_KEY);
      })
      .catch(() => localStorage.removeItem(STORAGE_KEY))
      .finally(() => setReady(true));
  }, []);

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  const value = {
    ready,
    authed,
    showModal,
    openLogin:  () => setShowModal(true),
    closeLogin: () => setShowModal(false),
    markAuthed: () => { setAuthed(true); setShowModal(false); },
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
