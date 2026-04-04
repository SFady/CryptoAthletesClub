"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const items = [
    { name: "Chaussettes", price: "10 $" },
    { name: "T-Shirt",     price: "25 $" },
    { name: "Short",       price: "50 $" },
    { name: "Chaussures",  price: "100 $" },
    { name: "Montre",      price: "200 $" },
    { name: "Personnage",  price: "400 $" },
  ];

  const [showWallet, setShowWallet] = useState(false);
  const [wallet, setWallet]         = useState(null);
  const [, setWalletLoading]        = useState(true);
  const [clm, setClm]               = useState(null);
  const [clmLoading, setClmLoading] = useState(true);
  const [distrib, setDistrib]       = useState(null);
  const [pendingTotal, setPendingTotal] = useState(null);

  const fetchWallet = () => {
    setWalletLoading(true);
    fetch("/api/wallet")
      .then(r => r.json())
      .then(d => { setWallet(d); setWalletLoading(false); })
      .catch(() => setWalletLoading(false));
  };

  const fetchClm = () => {
    setClmLoading(true);
    fetch("/api/clm")
      .then(r => r.json())
      .then(d => { setClm(d); setClmLoading(false); })
      .catch(() => setClmLoading(false));
  };

  useEffect(() => {
    const hasAccess = !!localStorage.getItem("dataEntry");
    setShowWallet(hasAccess);
    if (hasAccess) {
      fetchWallet();
      fetchClm();
      fetch("/api/get-distributions").then(r => r.json()).then(setDistrib).catch(() => {});
      fetch("/api/get-pending-transactions").then(r => r.json()).then(d => setPendingTotal(d.total)).catch(() => {});
    }
  }, []);

  const SectionTitle = ({ icon, children }) => (
    <div className="flex items-center gap-2 mb-4 mt-1">
      <span className="text-lg">{icon}</span>
      <h2 className="text-white text-base font-bold uppercase tracking-widest">{children}</h2>
      <div className="flex-1 h-px bg-white/10 ml-2" />
    </div>
  );

  const CardHeader = ({ children, action }) => (
    <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 py-3 px-5 flex items-center justify-between">
      <span className="text-white text-xs font-semibold uppercase tracking-wide">{children}</span>
      {action}
    </div>
  );

  const Row = ({ label, value, gold, zebra }) => (
    <tr className={`border-b border-white/10 text-sm ${zebra ? "bg-[#5C42A6]" : "bg-[#4e3899]"}`}>
      <td className="py-3 px-5 text-gray-300">{label}</td>
      <td className={`py-3 px-5 text-right font-semibold whitespace-nowrap ${gold ? "text-[#D6C48A] font-bold" : "text-white"}`}>{value}</td>
    </tr>
  );

  const SubHeader = ({ children }) => (
    <tr className="bg-[#3d2d7a] border-b border-white/10">
      <td colSpan={2} className="py-1.5 px-5 text-gray-400 text-xs uppercase tracking-wide">{children}</td>
    </tr>
  );

  return (
    <main className="flex flex-col w-full max-w-screen-xl mx-auto px-4 md:px-8 pt-6 pb-10">
      <div className="w-full md:max-w-[700px] mx-auto flex flex-col gap-10">

        {/* ── BOUTIQUE ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🛍️</span>
            <h2 className="text-white text-base font-bold uppercase tracking-widest">Boutique</h2>
            <div className="flex-1 h-px bg-white/10 ml-2" />
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg border border-white/10">
            <table className="w-full table-auto text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 text-white text-xs uppercase tracking-wide">
                  <th className="py-3.5 px-5 font-semibold">Article</th>
                  <th className="py-3.5 px-5 font-semibold text-right">Prix</th>
                  <th className="py-3.5 px-5 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.name} className={`border-b border-white/10 text-sm ${idx % 2 === 0 ? "bg-[#5C42A6]" : "bg-[#4e3899]"}`}>
                    <td className="py-3.5 px-3 sm:px-5 text-white font-semibold">{item.name}</td>
                    <td className="py-3.5 px-3 sm:px-5 text-[#D6C48A] font-bold text-right whitespace-nowrap">{item.price}</td>
                    <td className="py-3.5 px-2 sm:px-5">
                      <div className="flex justify-center gap-1 sm:gap-2">
                        <button className="bg-purple-500/80 hover:bg-purple-600 text-white text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">Acheter</button>
                        <button className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-lg transition-colors border border-white/20 whitespace-nowrap">Vendre</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── POSITION CLM ── */}
        {showWallet && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📊</span>
              <h2 className="text-white text-base font-bold uppercase tracking-widest">Position Bots</h2>
              <div className="flex-1 h-px bg-white/10 ml-2" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg border border-white/10">
              <SectionTitle
                action={
                  <div className="flex items-center gap-3">
                    {clm?.wethPrice && <span className="text-white/70 text-xs">ETH {Number(clm.wethPrice).toLocaleString("fr-FR")} $</span>}
                    <button onClick={fetchClm} className="text-white/70 hover:text-white text-sm transition-colors">↻</button>
                  </div>
                }
              >
                {clm?.tokenId ? `#${clm.tokenId} — ${clm.pair}` : "Chargement…"}
              </SectionTitle>

              {clmLoading ? (
                <div className="bg-[#5C42A6] py-5 text-center text-gray-400 text-sm">Chargement…</div>
              ) : clm?.error ? (
                <div className="bg-[#5C42A6] py-5 text-center text-rose-300 text-sm">Erreur : {clm.error}</div>
              ) : clm?.pair ? (
                <table className="w-full table-auto text-left border-collapse">
                  <tbody>
                    <tr className="bg-[#4e3899] border-b border-white/10">
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
                <div className="bg-[#5C42A6] py-5 text-center text-gray-400 text-sm">Position introuvable</div>
              )}
            </div>
          </div>
        )}

        {/* ── USDC ── */}
        {showWallet && (wallet || clm) && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">💵</span>
              <h2 className="text-white text-base font-bold uppercase tracking-widest">USDC</h2>
              <div className="flex-1 h-px bg-white/10 ml-2" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg border border-white/10">
              <table className="w-full table-auto text-left border-collapse">
                <tbody>
                  <SubHeader>Wallet</SubHeader>
                  <Row label="USDC"               value={`${wallet?.usdc ?? "—"} $`}        zebra />
                  <Row label="Frais non collectés" value={`${clm?.totalFeesUSD ?? "—"} $`}   />
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── DISPONIBLE / ÉVOLUTIONS ── */}
        {showWallet && wallet && distrib && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">💰</span>
            <h2 className="text-white text-base font-bold uppercase tracking-widest">Récap</h2>
            <div className="flex-1 h-px bg-white/10 ml-2" />
          </div>
        )}

        {showWallet && wallet && distrib && (
          <div className="rounded-xl overflow-hidden shadow-lg border border-white/10 -mt-2">
            <table className="w-full table-auto text-left border-collapse">
              <tbody>
                <Row label="Disponible perso"
                  value={`${(Number(wallet?.usdc ?? 0) - Number(distrib?.bonus ?? 0) - Number(distrib?.boost ?? 0) - Number(pendingTotal ?? 0)).toFixed(2)} $`}
                  gold zebra />
                {clm?.totalPoolUSD && (() => {
                  const ref = 2144.99;
                  const cur = Number(clm.totalPoolUSD);
                  const pct = ((cur - ref) / ref) * 100;
                  const up = pct >= 0;
                  return (
                    <tr className="border-b border-white/10 text-sm bg-[#4e3899]">
                      <td className="py-3 px-5 text-gray-300">Évolution pool <span className="text-white text-xs">{ref.toFixed(2)} → {cur.toFixed(2)} $</span></td>
                      <td className={`py-3 px-5 text-right font-bold ${up ? "text-emerald-400" : "text-rose-400"}`}>{up ? "+" : ""}{pct.toFixed(2)} %</td>
                    </tr>
                  );
                })()}
                {clm?.wethPrice && (() => {
                  const ref = 1997.76;
                  const cur = Number(clm.wethPrice);
                  const pct = ((cur - ref) / ref) * 100;
                  const up = pct >= 0;
                  return (
                    <tr className="text-sm bg-[#5C42A6]">
                      <td className="py-3 px-5 text-gray-300">Évolution ETH <span className="text-white text-xs">{ref.toFixed(2)} → {cur.toFixed(2)} $</span></td>
                      <td className={`py-3 px-5 text-right font-bold ${up ? "text-emerald-400" : "text-rose-400"}`}>{up ? "+" : ""}{pct.toFixed(2)} %</td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </main>
  );
}
