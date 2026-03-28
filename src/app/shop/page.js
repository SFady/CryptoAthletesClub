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

  const fetchWallet = () => {
    setWalletLoading(true);
    fetch("/api/wallet")
      .then(r => r.json())
      .then(d => { setWallet(d); setWalletLoading(false); })
      .catch(() => setWalletLoading(false));
  };

  useEffect(() => {
    const hasAccess = !!localStorage.getItem("dataEntry");
    setShowWallet(hasAccess);
    if (hasAccess) fetchWallet();
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

      </div>
    </main>
  );
}
