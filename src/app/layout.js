"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ClientGate from "./ClientGate";
import LoginGate from "./LoginGate";
import PullToRefresh from "./PullToRefresh";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const centralWidth = 1280;
  const [showLink, setShowLink] = useState(false);
  const [showDivers, setShowDivers] = useState(false);
  const [showBurger, setShowBurger] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!showDivers) return;
    const close = () => setShowDivers(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showDivers]);

  const DIVERS_ITEMS = [
    { label: "Profil", href: "/profil" },
    ...(showLink ? [{ label: "Saisie", href: "/sfy1024" }] : []),
    { label: "A propos",  href: "/about" },
  ];

  const logout = () => {
    localStorage.removeItem("auth_session");
    window.location.reload();
  };

  const MAIN_PAGES = ["/home", "/activities", "/statistics", "/shop"];

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth_session");
      if (raw) {
        const { user } = JSON.parse(raw);
        setShowLink(user === "usopp");
      }
    } catch { /* ignore */ }
    if (MAIN_PAGES.includes(pathname)) {
      localStorage.setItem("lastMainPage", pathname);
    }
  }, [pathname]);

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>The Crypto Athletes Club</title>
        <meta name="description" content="Dashboard de suivi des performances & actifs" />
        <meta charSet="UTF-8" />
      </head>

      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased h-[100dvh] overflow-hidden md:h-auto md:overflow-visible`}>
        <div className="relative flex flex-col h-[100dvh] md:min-h-screen text-white">

          {/* IMAGE DE FOND FIXE */}
          <div
            className="fixed inset-0 bg-center bg-cover z-0"
            style={{ backgroundImage: "url('/images/banner.webp')" }}
          ></div>

          {/* OVERLAY VIOLET FULL SCREEN */}
          <div
            className="fixed inset-0 z-10"
            style={{
              background: `
                linear-gradient(
                  to right,
                  rgba(74,46,163,0) 0%, 
                  rgba(74,46,163,0.95) calc((100% - ${centralWidth}px)/2), 
                  rgba(74,46,163,0.95) calc((100% + ${centralWidth}px)/2), 
                  rgba(74,46,163,0) 100%
                )
              `,
            }}
          ></div>

          {/* HEADER FIXE */}
          <header className="fixed top-0 left-0 w-full bg-[#390494]/90 p-4 shadow-md z-30 backdrop-blur-md">
            <div className="flex w-full max-w-screen-xl px-6 md:px-12 mx-auto items-center justify-between">
              {/* Burger mobile — header */}
              <button
                onClick={() => setShowBurger(v => !v)}
                className="md:hidden mr-3 text-gray-300 hover:text-white transition-colors flex-shrink-0"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex flex-col w-full">
                <h1 className="text-xl font-bold" style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.8)" }}>
                  The Crypto Athletes Club
                </h1>
                <span className="hidden text-[10px] text-gray-500 text-right md:text-left md:ml-0 self-end md:self-auto">
                  {process.env.NEXT_PUBLIC_BUILD_DATE
                    ? (() => { const d = new Date(process.env.NEXT_PUBLIC_BUILD_DATE); return String(d.getUTCDate()).padStart(2,"0") + "/" + String(d.getUTCMonth()+1).padStart(2,"0") + "/" + String(d.getUTCFullYear()).slice(-2) + "-" + String(d.getUTCHours()).padStart(2,"0") + ":" + String(d.getUTCMinutes()).padStart(2,"0") + ":" + String(d.getUTCSeconds()).padStart(2,"0"); })()
                    : ""}
                </span>
              </div>

              {/* Nav desktop */}
              <nav className="hidden md:flex gap-8 text-sm font-medium justify-end ml-auto">
                {[
                  { href: "/home", label: "Dashboard" },
                  { href: "/activities", label: "Activités" },
                  { href: "/statistics", label: "Statistiques" },
                  { href: "/shop", label: "Boutique" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className={`transition-colors ${pathname === href ? "text-white" : "text-gray-400 hover:text-white"}`}>
                    {label}
                  </Link>
                ))}
                {/* Divers desktop */}
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowDivers(v => !v); }}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
                  >
                    Divers
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showDivers && (
                    <div className="absolute left-0 top-full mt-2 w-40 bg-[#2a1a6e] border border-white/20 rounded-xl shadow-xl z-50 overflow-hidden">
                      {DIVERS_ITEMS.map(({ label, href }) => href ? (
                        <Link key={label} href={href} onClick={() => setShowDivers(false)}
                          className={`block px-4 py-2.5 text-sm hover:bg-white/10 hover:text-white transition-colors ${pathname === href ? "text-white font-medium" : "text-gray-300"}`}>
                          {label}
                        </Link>
                      ) : (
                        <button key={label} onClick={() => setShowDivers(false)}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={logout} className="text-gray-400 hover:text-white transition-colors text-sm">Quitter</button>
              </nav>
            </div>
          </header>

          <PullToRefresh />

          {/* ZONE CENTRALE - scroll global */}
          <main className="relative flex flex-col pt-16 md:pt-24 pb-20 flex-1 overflow-x-hidden overflow-y-auto">
            <div className="relative z-20 flex flex-col w-full md:max-w-screen-xl md:mx-auto px-0 md:px-12">
              <LoginGate>
                <ClientGate>
                  {children}
                </ClientGate>
              </LoginGate>
            </div>
          </main>

          {/* FOOTER MOBILE */}
          <footer className="fixed bottom-0 left-0 w-full bg-[#390494]/95 text-xs z-30 backdrop-blur-md block md:hidden border-t border-white/20">
            <nav className="flex justify-around items-center h-14">
              {[
                { href: "/home", label: "Dashboard", icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H5a1 1 0 01-1-1V9.75z"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10"/></svg>
                )},
                { href: "/activities", label: "Activités", icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l3-8 4 16 3-8h5"/></svg>
                )},
                { href: "/statistics", label: "Stats", icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 20V14m4 6V10m4 10V4m4 16v-6m4 6v-9"/></svg>
                )},
                { href: "/shop", label: "Boutique", icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M16 10a4 4 0 01-8 0"/></svg>
                )},
              ].map(({ href, label, icon }) => (
                <Link key={href} href={href} className={`flex flex-col items-center justify-center gap-1 h-full px-2 transition-colors ${pathname === href ? "text-white" : "text-gray-400 hover:text-gray-200"}`}>
                  {icon}
                  <span>{label}</span>
                </Link>
              ))}
              <button onClick={logout} className="flex flex-col items-center justify-center gap-1 h-full px-2 text-gray-400 hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"/></svg>
                <span>Quitter</span>
              </button>
            </nav>
          </footer>

          {/* Drawer burger mobile */}
          {showBurger && (
            <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowBurger(false)}>
              <div className="absolute top-16 left-6 w-48 bg-[#2a1a6e]/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
                {DIVERS_ITEMS.map(({ label, href }) => href ? (
                  <Link key={label} href={href} onClick={() => setShowBurger(false)}
                    className={`block px-5 py-3 text-sm hover:bg-white/10 hover:text-white transition-colors border-b border-white/10 last:border-0 ${pathname === href ? "text-white font-medium" : "text-gray-300"}`}>
                    {label}
                  </Link>
                ) : (
                  <button key={label} onClick={() => setShowBurger(false)}
                    className="w-full text-left px-5 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors border-b border-white/10 last:border-0">
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </body>
    </html>
  );
}
