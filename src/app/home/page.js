"use client";

import { useAuth } from "../AuthContext";

export default function PublicHome() {
  const { authed, openLogin } = useAuth();

  return (
    <main className="flex flex-col items-center justify-center text-center min-h-[calc(100svh-144px)] md:min-h-[calc(100vh-96px)] px-6">
      <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.8)" }}>
        The Crypto Athletes Club
      </h1>
      <p className="text-white/70 max-w-md mb-8">
        Track your workouts, earn rewards, and compete with the club — powered by real on-chain USDC.
      </p>

      {authed ? (
        <a
          href="/dashboard"
          className="px-8 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 active:scale-95 transition-all duration-200 shadow-lg"
        >
          Go to Dashboard
        </a>
      ) : (
        <button
          onClick={openLogin}
          className="px-8 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 active:scale-95 transition-all duration-200 shadow-lg"
        >
          Login
        </button>
      )}
    </main>
  );
}
