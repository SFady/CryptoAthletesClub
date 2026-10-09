"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ClientGate from "./ClientGate";
import LoginGate from "./LoginGate";
import PullToRefresh from "./PullToRefresh";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>The Crypto Athletes Club</title>
        <meta name="description" content="Dashboard de suivi des performances & actifs" />
        <meta charSet="UTF-8" />
      </head>

      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased h-[100dvh] overflow-hidden md:h-auto md:overflow-visible`}>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}

function AppShell({ children }) {
  const centralWidth = 1600;
  const [showLink, setShowLink] = useState(false);
  const [showDivers, setShowDivers] = useState(false);
  const [showBurger, setShowBurger] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { ready, authed, openLogin, logout } = useAuth();

  const PUBLIC_PAGES = ["/home", "/", "/profil"];

  useEffect(() => {
    if (!ready || authed) return;
    if (!PUBLIC_PAGES.includes(pathname)) {
      router.replace("/home");
    }
  }, [ready, authed, pathname, router]);

  useEffect(() => {
    if (!showDivers) return;
    const close = () => setShowDivers(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showDivers]);

  const DIVERS_ITEMS = [
    { label: "Profile", href: "/profil" },
    ...(showLink ? [{ label: "Entry",    href: "/sfy1024"  }] : []),
    ...(showLink ? [{ label: "Position", href: "/position" }] : []),
    { label: "About",  href: "/about" },
  ];

  const MAIN_PAGES = ["/dashboard", "/activities", "/statistics", "/shop"];

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
        <div className="relative flex flex-col h-[100dvh] md:min-h-screen text-white">

          {/* IMAGE DE FOND FIXE */}
          <div
            className="fixed inset-0 bg-center bg-cover z-0"
            style={{ backgroundImage: "url('/images/banner.webp')" }}
          ></div>

          {/* OVERLAYS — full viewport, toutes les pages */}
          <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] bg-[#2d1b69]" />
          <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[2] bg-cover bg-center bg-no-repeat opacity-35" style={{ backgroundImage: "url('/images/banner.webp')" }} />
          <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[3] bg-[#2d1b69]/45" />
          <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 z-[4] top-[22%] bottom-[8%] mx-auto w-[min(92vw,58rem)] rounded-[50%]" style={{ background: "linear-gradient(180deg, rgba(45,27,105,0.98) 0%, rgba(57,24,137,0.96) 30%, rgba(72,29,166,0.9) 58%, rgba(45,27,105,0.5) 88%, rgba(45,27,105,0.08) 100%)", filter: "blur(18px)" }} />
          <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5]" style={{ background: "radial-gradient(ellipse 68% 58% at 50% 52%, rgba(45,27,105,0.76) 0%, rgba(72,29,166,0.62) 42%, rgba(45,27,105,0.2) 72%, rgba(45,27,105,0) 88%)" }} />

          {/* HEADER FIXE */}
          <header className="fixed top-0 left-0 w-full bg-[#390494]/90 py-0.5 px-4 shadow-md z-30 backdrop-blur-md">
            <div className="flex w-full max-w-[1600px] px-6 md:px-12 mx-auto items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Burger mobile — gauche */}
                {authed && (
                  <button
                    onClick={() => setShowBurger(v => !v)}
                    className="md:hidden text-gray-300 hover:text-white transition-colors flex-shrink-0"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                )}

                <Link href="/" className="group flex items-center gap-1">
                  <img src="/images/move4x-logo-futuriste.png" alt="Move4X" className="h-14 w-auto object-contain opacity-95 transition-transform duration-200 group-hover:scale-105" />
                </Link>
              </div>

              {/* Nav desktop */}
              <nav className="hidden md:flex gap-8 text-sm font-medium justify-end ml-auto">
                {authed && [
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/activities", label: "Activities" },
                  { href: "/statistics", label: "Statistics" },
                  { href: "/shop", label: "Shop" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className={`transition-colors ${pathname === href ? "text-white" : "text-gray-400 hover:text-white"}`}>
                    {label}
                  </Link>
                ))}
                {/* Divers desktop */}
                {authed && (
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowDivers(v => !v); }}
                      className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
                    >
                      More
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
                )}
                <button onClick={authed ? logout : openLogin} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {authed ? "Logout" : "Login"}
                </button>
              </nav>
            </div>
          </header>

          <PullToRefresh />

          {/* ZONE CENTRALE - scroll global */}
          <main className="relative flex flex-col pt-16 md:pt-24 pb-20 flex-1 overflow-x-hidden overflow-y-auto">
            <div className="relative z-20 flex flex-col w-full md:max-w-[1600px] md:mx-auto px-0 md:px-12">
              {(PUBLIC_PAGES.includes(pathname) || (ready && authed)) && (
                <ClientGate>
                  {children}
                </ClientGate>
              )}
            </div>
          </main>

          <LoginGate />

          {/* FOOTER MOBILE */}
          <footer className="fixed bottom-0 left-0 w-full bg-[#390494]/95 text-xs z-30 backdrop-blur-md block md:hidden border-t border-white/20">
            <nav className="flex justify-around items-center h-14">
              {authed && [
                { href: "/dashboard", label: "Dashboard", icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H5a1 1 0 01-1-1V9.75z"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10"/></svg>
                )},
                { href: "/activities", label: "Activities", icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l3-8 4 16 3-8h5"/></svg>
                )},
                { href: "/statistics", label: "Stats", icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 20V14m4 6V10m4 10V4m4 16v-6m4 6v-9"/></svg>
                )},
                { href: "/shop", label: "Shop", icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M16 10a4 4 0 01-8 0"/></svg>
                )},
              ].map(({ href, label, icon }) => (
                <Link key={href} href={href} className={`flex flex-col items-center justify-center gap-1 h-full px-2 transition-colors ${pathname === href ? "text-white" : "text-gray-400 hover:text-gray-200"}`}>
                  {icon}
                  <span>{label}</span>
                </Link>
              ))}
              <button onClick={authed ? logout : openLogin} className="flex flex-col items-center justify-center gap-1 h-full px-2 text-gray-400 hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"/></svg>
                <span>{authed ? "Logout" : "Login"}</span>
              </button>
            </nav>
          </footer>

          {/* Drawer burger mobile */}
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
  );
}
