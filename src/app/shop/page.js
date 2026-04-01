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
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [clm, setClm] = useState(null);
  const [clmLoading, setClmLoading] = useState(true);
  const [distrib, setDistrib] = useState(null);

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
    }
  }, []);

  return (
    <main className="flex flex-col w-full max-w-screen-xl mx-auto px-4 md:px-8 pt-6 pb-6">
      <div className="max-w-[600px] w-full mx-auto">

        {/* Tableau boutique */}
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
                <tr
                  key={item.name}
                  className={`border-b border-white/10 text-sm ${idx % 2 === 0 ? "bg-[#5C42A6]" : "bg-[#4e3899]"}`}
                >
                  <td className="py-4 px-5 text-white font-semibold">{item.name}</td>
                  <td className="py-4 px-5 text-[#D6C48A] font-bold text-right">{item.price}</td>
                  <td className="py-4 px-5">
                    <div className="flex justify-center gap-2">
                      <button className="bg-purple-500/80 hover:bg-purple-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                        Acheter
                      </button>
                      <button className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border border-white/20">
                        Vendre
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Wallet — visible saisie uniquement */}
        {showWallet && <div className="rounded-xl overflow-hidden shadow-lg border border-white/10 mt-6">
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 py-3 px-5 flex items-center justify-between">
            <span className="text-white text-xs font-semibold uppercase tracking-wide">Wallet</span>
            <button onClick={fetchWallet} className="text-white/70 hover:text-white text-xs transition-colors">↻</button>
          </div>

          {walletLoading ? (
            <div className="bg-[#5C42A6] py-5 text-center text-gray-400 text-sm">Chargement…</div>
          ) : wallet?.error ? (
            <div className="bg-[#5C42A6] py-5 text-center text-rose-300 text-sm">Erreur : {wallet.error}</div>
          ) : wallet ? (
            <table className="w-full table-auto text-left border-collapse">
              <tbody>
                <tr className="border-b border-white/10 bg-[#5C42A6] text-sm">
                  <td className="py-3 px-5 text-gray-300">WETH</td>
                  <td className="py-3 px-5 text-right">
                    <span className="text-white">{wallet.weth}</span>
                    <span className="text-gray-400 text-xs ml-2">~{wallet.wethUSD} $</span>
                  </td>
                </tr>
                <tr className="border-b border-white/10 bg-[#4e3899] text-sm">
                  <td className="py-3 px-5 text-gray-300">USDC</td>
                  <td className="py-3 px-5 text-right">
                    <span className="text-white">{wallet.usdc}</span>
                    <span className="text-gray-400 text-xs ml-2">~{wallet.usdc} $</span>
                  </td>
                </tr>
                <tr className="border-b border-white/10 bg-[#5C42A6] text-sm">
                  <td className="py-3 px-5 text-gray-300">Total Fees</td>
                  <td className="py-3 px-5 text-[#D6C48A] font-bold text-right">{wallet.totalUSD} $</td>
                </tr>
              </tbody>
            </table>
          ) : null}
        </div>}

        {/* Position CLM Aerodrome — visible saisie uniquement */}
        {showWallet && <div className="rounded-xl overflow-hidden shadow-lg border border-white/10 mt-6">
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 py-3 px-5 flex items-center justify-between">
            <span className="text-white text-xs font-semibold uppercase tracking-wide">Position CLM Aerodrome</span>
            {clm?.wethPrice && <span className="text-white/70 text-xs">ETH {Number(clm.wethPrice).toLocaleString("fr-FR")} $</span>}
            <button onClick={fetchClm} className="text-white/70 hover:text-white text-xs transition-colors">↻</button>
          </div>

          {clmLoading ? (
            <div className="bg-[#5C42A6] py-5 text-center text-gray-400 text-sm">Chargement…</div>
          ) : clm?.error ? (
            <div className="bg-[#5C42A6] py-5 text-center text-rose-300 text-sm">Erreur : {clm.error}</div>
          ) : clm?.pair ? (
            <table className="w-full table-auto text-left border-collapse">
              <tbody>
                <tr className="bg-[#4e3899] border-b border-white/10 text-xs">
                  <td className="py-2 px-5 text-gray-400">#{clm.tokenId} — {clm.pair}</td>
                  <td className="py-2 px-5 text-right">
                    {clm.inRange !== null && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${clm.inRange ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>
                        {clm.inRange ? "In range" : "Out of range"}
                      </span>
                    )}
                  </td>
                </tr>
                {clm.pool.map((t, i) => (
                  <tr key={i} className={`border-b border-white/10 text-sm ${i % 2 === 0 ? "bg-[#5C42A6]" : "bg-[#4e3899]"}`}>
                    <td className="py-2.5 px-5 text-gray-300">{t.symbol}</td>
                    <td className="py-2.5 px-5 text-right">
                      <span className="text-white">{t.balance}</span>
                      <span className="text-gray-400 text-xs ml-2">~{t.usd} $</span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-[#5C42A6] border-b border-white/10 text-sm">
                  <td className="py-2.5 px-5 text-gray-300">Total pool</td>
                  <td className="py-2.5 px-5 text-right text-white font-semibold">{clm.totalPoolUSD} $</td>
                </tr>
                <tr className="bg-[#3d2d7a] border-b border-white/10 text-xs">
                  <td colSpan={2} className="py-1.5 px-5 text-gray-400 uppercase tracking-wide">Frais non collectés</td>
                </tr>
                {clm.fees.map((t, i) => (
                  <tr key={i} className={`border-b border-white/10 text-sm ${i % 2 === 0 ? "bg-[#5C42A6]" : "bg-[#4e3899]"}`}>
                    <td className="py-2.5 px-5 text-gray-300">{t.symbol}</td>
                    <td className="py-2.5 px-5 text-right">
                      <span className="text-white">{t.balance}</span>
                      <span className="text-gray-400 text-xs ml-2">~{t.usd} $</span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-[#5C42A6] text-sm">
                  <td className="py-3 px-5 text-gray-300">Total</td>
                  <td className="py-3 px-5 text-right text-[#D6C48A] font-bold">{clm.totalUSD} $</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="bg-[#5C42A6] py-5 text-center text-gray-400 text-sm">Position introuvable</div>
          )}
        </div>}

        {/* Tableau récap saisie */}
        {showWallet && (wallet || clm) && (
          <div className="rounded-xl overflow-hidden shadow-lg border border-white/10 mt-6">
            <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 py-3 px-5">
              <span className="text-white text-xs font-semibold uppercase tracking-wide">Récap saisie</span>
            </div>
            <table className="w-full table-auto text-left border-collapse">
              <tbody>
                <tr className="bg-[#4e3899] border-b border-white/10 text-xs">
                  <td colSpan={2} className="py-1.5 px-5 text-gray-400 uppercase tracking-wide">Wallet</td>
                </tr>
                <tr className="bg-[#5C42A6] border-b border-white/10 text-sm">
                  <td className="py-2.5 px-5 text-gray-300">USDC</td>
                  <td className="py-2.5 px-5 text-right text-white">{wallet?.usdc ?? "—"} $</td>
                </tr>
                <tr className="bg-[#5C42A6] border-b border-white/10 text-sm">
                  <td className="py-2.5 px-5 text-gray-300">Frais non collectés</td>
                  <td className="py-2.5 px-5 text-right text-white">{clm?.totalFeesUSD ?? "—"} $</td>
                </tr>
                <tr className="bg-[#4e3899] border-b border-white/10 text-sm">
                  <td className="py-2.5 px-5 text-gray-300">Bénéf + Boost + Bonus</td>
                  <td className="py-2.5 px-5 text-right text-white">
                    {distrib ? Number(distrib.total).toFixed(2) : "—"} $
                  </td>
                </tr>
                <tr className="bg-[#3d2d7a] border-b border-white/10 text-sm">
                  <td className="py-3 px-5 text-gray-300 font-semibold">Disponible</td>
                  <td className="py-3 px-5 text-right text-[#D6C48A] font-bold">
                    {wallet && distrib
                      ? (Number(wallet.usdc) - Number(distrib.total)).toFixed(2)
                      : "—"} $
                  </td>
                </tr>
                <tr className="bg-[#2a1f5e]">
                  <td colSpan={2} className="py-2" />
                </tr>
                <tr className="bg-[#3d2d7a] border-b border-white/10 text-xs">
                  <td colSpan={2} className="py-1.5 px-5 text-gray-400 uppercase tracking-wide">Répartition</td>
                </tr>
                <tr className="bg-[#5C42A6] border-b border-white/10 text-sm">
                  <td className="py-2.5 px-5 text-gray-300">Appli</td>
                  <td className="py-2.5 px-5 text-right text-white">
                    {wallet && distrib
                      ? (((100 + 135 + 885 + 60) / (2180.85 + 60)) * (Number(wallet.usdc) - Number(distrib.total))).toFixed(2)
                      : "—"} $
                  </td>
                </tr>
                {distrib?.byUser?.map((u, i) => {
                  const appli = wallet && distrib
                    ? ((100 + 135 + 885 + 60) / (2180.85 + 60)) * (Number(wallet.usdc) - Number(distrib.total))
                    : null;
                  const sol = Number(u.starting_offered_liquidity ?? 0);
                  const il  = Number(u.initial_liquidity ?? 0);
                  const percent = (sol + il) / (100 + 135 + 885 + 60);
                  const userShare = appli !== null && !isNaN(percent) ? percent * appli : null;
                  return (
                    <tr key={u.name} className={`border-b border-white/10 text-sm ${i % 2 === 0 ? "bg-[#4e3899]" : "bg-[#5C42A6]"}`}>
                      <td className="py-2.5 px-5 text-gray-300">{u.name}</td>
                      <td className="py-2.5 px-5 text-right text-white">{userShare !== null ? userShare.toFixed(2) : "—"} $</td>
                    </tr>
                  );
                })}

              </tbody>
            </table>
          </div>
        )}

      </div>
    </main>
  );
}
