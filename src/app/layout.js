"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ClientGate from "./ClientGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function getVersionString() {
  const year = "2026";
  const month = "01";
  const day = "03";
  const hours = "21";
  const minutes = "00";
  return `(V${year}${month}${day}_${hours}${minutes})`;
}

export default function RootLayout({ children }) {
  const centralWidth = 1280;
  const version = getVersionString();

  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>The Crypto Athletes Club</title>
        <meta name="description" content="Dashboard de suivi des performances & actifs" />
        <meta charSet="UTF-8" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="relative flex flex-col min-h-screen text-white">

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
              <div className="flex items-baseline w-full">
                <h1 className="text-xl font-bold" style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.8)" }}>
                  The Crypto Athletes Club
                </h1>
                <span className="text-[10px] md:text-xs text-gray-400 ml-2">{version}</span>
              </div>

              {/* Nav desktop */}
              <nav className="hidden md:flex gap-8 text-sm font-medium justify-end ml-auto">
                <Link href="/home" className="hover:text-white transition-colors">Dashboard</Link>
                <Link href="/activities" className="hover:text-white transition-colors">Activités</Link>
                <Link href="/statistics" className="hover:text-white transition-colors">Statistiques</Link>
                <Link href="/shop" className="hover:text-white transition-colors">Boutique</Link>
              </nav>
            </div>
          </header>

          {/* ZONE CENTRALE - scroll global */}
          <main className="relative flex flex-col pt-16 md:pt-24 pb-20 min-h-screen overflow-x-auto overflow-y-auto">
            <div className="relative z-20 flex flex-col w-max min-w-full md:max-w-screen-xl md:mx-auto px-0 md:px-12">
              <ClientGate>
                {children}
              </ClientGate>
            </div>
          </main>

          {/* FOOTER MOBILE */}
          <footer className="fixed bottom-0 left-0 w-full bg-[#390494]/95 text-xs text-gray-200 py-2 z-30 backdrop-blur-md block md:hidden border-t border-white/20">
            <nav className="flex justify-around items-center">
              <Link href="/home" className="flex flex-col items-center gap-1 hover:text-white transition-colors">
                <span className="text-lg">🏠</span>
                <span>Dashboard</span>
              </Link>
              <Link href="/activities" className="flex flex-col items-center gap-1 hover:text-white transition-colors">
                <span className="text-lg">📊</span>
                <span>Activités</span>
              </Link>
              <Link href="/statistics" className="flex flex-col items-center gap-1 hover:text-white transition-colors">
                <span className="text-lg">👤</span>
                <span>Statistiques</span>
              </Link>
              <Link href="/shop" className="flex flex-col items-center gap-1 hover:text-white transition-colors">
                <span className="text-lg">👤</span>
                <span>Boutique</span>
              </Link>
            </nav>
          </footer>

        </div>
      </body>
    </html>
  );
}
