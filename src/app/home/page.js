"use client";

import { useAuth } from "../AuthContext";
import { FaTrophy, FaWallet, FaBolt, FaArrowRight } from "react-icons/fa";

export default function PublicHome() {
  const { authed, openLogin } = useAuth();

  return (
    <section className="flex w-full flex-col items-center min-h-[calc(100svh-144px)] md:min-h-[calc(100vh-96px)] justify-center">

      <div className="relative z-10 flex flex-col items-center w-full max-w-7xl mx-auto px-6 py-8 text-center lg:px-12 lg:py-12">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-white/70 backdrop-blur-sm">
        <span className="size-2 rounded-full bg-[#e2c35b] shadow-[0_0_12px_#e2c35b]" />
        Move. Compete. Earn.
      </div>

      <img
        src="/images/move4x-logo-futuriste.png"
        alt="Move4X"
        className="w-[min(80vw,520px)] h-auto"
        style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.9)) drop-shadow(0 4px 24px rgba(0,0,0,0.7)) drop-shadow(0 0 40px rgba(180,140,255,0.6))" }}
      />

      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
        Track your workouts, earn rewards, and compete with the club — powered by real on-chain USDC.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        {authed ? (
          <a
            href="/dashboard"
            className="group inline-flex items-center h-12 rounded-lg bg-[#6d2cff] px-7 text-base font-semibold text-white shadow-[0_0_35px_rgba(109,44,255,0.55)] hover:bg-[#7b42ff] transition-colors"
          >
            Go to Dashboard
            <FaArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </a>
        ) : (
          <button
            onClick={openLogin}
            className="group inline-flex items-center h-12 rounded-lg bg-[#6d2cff] px-7 text-base font-semibold text-white shadow-[0_0_35px_rgba(109,44,255,0.55)] hover:bg-[#7b42ff] transition-colors"
          >
            Login
            <FaArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>

      <div className="mt-16 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
        {[
          { icon: FaTrophy,  title: "Compete", text: "Weekly challenges" },
          { icon: FaWallet,  title: "Earn",    text: "On-chain rewards" },
          { icon: FaBolt,    title: "Move",    text: "Every kilometer counts" },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-white/10 bg-white/[0.07] p-5 text-left backdrop-blur-sm">
            <Icon className="mb-4 text-[#e2c35b] text-lg" aria-hidden="true" />
            <p className="font-semibold text-white">{title}</p>
            <p className="mt-1 text-sm text-white/55">{text}</p>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
