"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBackToMain } from "../useBackToMain";

export default function Position() {
  const router = useRouter();
  const goBack = useBackToMain();
  const [wallet, setWallet]         = useState(null);
  const [clm, setClm]               = useState(null);
  const [clmLoading, setClmLoading] = useState(true);
  const [distrib, setDistrib]       = useState(null);
  const [boostPending, setBoostPending] = useState(0);

  const fetchClm = () => {
    setClmLoading(true);
    fetch("/api/clm")
      .then(r => r.json())
      .then(d => { setClm(d); setClmLoading(false); })
      .catch(() => setClmLoading(false));
  };

  useEffect(() => {
    try {
      const { user } = JSON.parse(localStorage.getItem("auth_session") ?? "{}");
      if (user !== "usopp") { router.replace("/home"); return; }
    } catch { router.replace("/home"); return; }
    fetch("/api/wallet").then(r => r.json()).then(setWallet).catch(() => {});
    fetch("/api/get-distributions").then(r => r.json()).then(setDistrib).catch(() => {});
    fetch("/api/get-user-boost?userId=1").then(r => r.json()).then(d => setBoostPending(d.boost_pending ?? 0)).catch(() => {});
    fetchClm();
  }, []);

  const Card = ({ icon, title, subtitle, action, children }) => (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-white/10">
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 py-3 px-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg flex-shrink-0">{icon}</span>
          <div className="flex flex-col">
            <h2 className="text-white text-sm font-bold uppercase tracking-widest">{title}</h2>
            {subtitle && <span className="text-white/70 text-xs">{subtitle}</span>}
          </div>
        </div>
        {action}
      </div>
      <div className="bg-white/[0.05] backdrop-blur-md">{children}</div>
    </div>
  );

  const Row = ({ label, value, gold, zebra }) => (
    <tr className={`border-b border-white/10 text-sm ${zebra ? "bg-white/[0.03]" : "bg-transparent"}`}>
      <td className="py-2.5 px-5 text-gray-300">{label}</td>
      <td className={`py-2.5 px-5 text-right font-semibold whitespace-nowrap ${gold ? "text-[#D6C48A] font-bold" : "text-white"}`}>{value}</td>
    </tr>
  );

  const SubHeader = ({ children }) => (
    <tr className="border-b border-white/10">
      <td colSpan={2} className="py-1.5 px-5 text-white/40 text-xs uppercase tracking-wide bg-white/[0.03]">{children}</td>
    </tr>
  );

  return (
    <main className="flex flex-col w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-4 pb-10">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={goBack} className="text-gray-300 hover:text-white transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-white">Position</h1>
      </div>

      <div className="w-full md:max-w-[900px] xl:max-w-[1100px] mx-auto flex flex-col gap-6">

        {/* ── POSITION CLM ── */}
        <Card
          icon="📊"
          title={clm?.tokenId ? `#${clm.tokenId}` : "Position"}
          subtitle={clm?.pair ?? undefined}
          action={
            <div className="flex items-center gap-3">
              {clm?.wethPrice && <span className="text-white/70 text-xs">ETH {Number(clm.wethPrice).toLocaleString("fr-FR")} $</span>}
              <button onClick={fetchClm} className="text-white/70 hover:text-white text-sm transition-colors">↻</button>
            </div>
          }
        >
          {clmLoading ? (
            <div className="py-5 text-center text-gray-400 text-sm">Chargement…</div>
          ) : clm?.error ? (
            <div className="py-5 text-center text-rose-300 text-sm">Erreur : {clm.error}</div>
          ) : clm?.pair ? (
            <table className="w-full table-auto text-left border-collapse">
              <tbody>
                <tr className="border-b border-white/10 bg-white/5">
                  <td colSpan={2} className="py-2 px-5 text-right">
                    {clm.inRange !== null && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${clm.inRange ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>
                        {clm.inRange ? "In range" : "Out of range"}
                      </span>
                    )}
                  </td>
                </tr>
                <SubHeader>En position</SubHeader>
                {clm.pool.map((t, i) => (
                  <Row key={i} label={t.symbol} value={<><span className="text-white">{t.balance}</span><span className="text-gray-400 text-xs ml-2">~{t.usd} $</span></>} zebra={i % 2 === 0} />
                ))}
                <Row label="Total pool" value={`${clm.totalPoolUSD} $`} gold zebra />
                <SubHeader>Frais non collectés</SubHeader>
                {clm.fees.map((t, i) => (
                  <Row key={i} label={t.symbol} value={<><span className="text-white">{t.balance}</span><span className="text-gray-400 text-xs ml-2">~{t.usd} $</span></>} zebra={i % 2 === 0} />
                ))}
                <Row label="Total fees" value={`${clm.totalUSD} $`} gold zebra />
              </tbody>
            </table>
          ) : (
            <div className="py-5 text-center text-gray-400 text-sm">Position introuvable</div>
          )}
        </Card>

        {/* ── USDC ── */}
        {(wallet || clm) && (
          <Card icon="💵" title="USDC">
            <table className="w-full table-auto text-left border-collapse">
              <tbody>
                <SubHeader>Wallet</SubHeader>
                <Row label="USDC"                value={`${wallet?.usdc ?? "—"} $`}      zebra />
                <Row label="Frais non collectés" value={`${clm?.totalFeesUSD ?? "—"} $`} />
              </tbody>
            </table>
          </Card>
        )}

        {/* ── RÉCAP ── */}
        {wallet && distrib && (
          <Card icon="💰" title="Récap">
            <table className="w-full table-auto text-left border-collapse">
              <tbody>
                <Row label="Disponible perso"
                  value={`${(Number(wallet?.usdc ?? 0) * (1 - ((100 + 135 + 885 + (10 + 50)) / (2084.99 + (10 + 50)))) + Number(boostPending)).toFixed(2)} $`}
                  gold zebra />
                {clm?.totalPoolUSD && (() => {
                  const ref = 2144.99; const cur = Number(clm.totalPoolUSD);
                  const pct = ((cur - ref) / ref) * 100; const up = pct >= 0;
                  return (
                    <tr className="border-b border-white/10 text-sm bg-white/5">
                      <td className="py-2.5 px-5 text-gray-300">Évolution pool <span className="text-white text-xs">{ref.toFixed(2)} → {cur.toFixed(2)} $</span></td>
                      <td className={`py-2.5 px-5 text-right font-bold ${up ? "text-emerald-400" : "text-rose-400"}`}>{up ? "+" : ""}{pct.toFixed(2)} %</td>
                    </tr>
                  );
                })()}
                {clm?.wethPrice && (() => {
                  const ref = 1997.76; const cur = Number(clm.wethPrice);
                  const pct = ((cur - ref) / ref) * 100; const up = pct >= 0;
                  return (
                    <tr className="text-sm bg-white/10">
                      <td className="py-2.5 px-5 text-gray-300">Évolution ETH <span className="text-white text-xs">{ref.toFixed(2)} → {cur.toFixed(2)} $</span></td>
                      <td className={`py-2.5 px-5 text-right font-bold ${up ? "text-emerald-400" : "text-rose-400"}`}>{up ? "+" : ""}{pct.toFixed(2)} %</td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </Card>
        )}

      </div>
    </main>
  );
}
