"use client";

import { useEffect, useState } from "react";
import { useBackToMain } from "../useBackToMain";

export default function Sfy1024() {

  const goBack = useBackToMain();
  const [today, setToday] = useState("");
  const [poolData, setPoolData] = useState(null);

  useEffect(() => {
    localStorage.setItem("dataEntry", "saisie");
    setToday(new Date().toISOString().split("T")[0]);
    Promise.all([fetch("/api/clm"), fetch("/api/wallet-pool")])
      .then(([r1, r2]) => Promise.all([r1.json(), r2.json()]))
      .then(([clm, wp]) => {
        const pool = Number(clm.totalPoolUSD ?? 0);
        const usdc = Number(wp.usdc ?? 0);
        const wethUSD = Number(wp.wethUSD ?? 0);
        setPoolData({ pool: pool.toFixed(2), usdc: usdc.toFixed(2), wethUSD: wethUSD.toFixed(2), total: (pool + usdc + wethUSD).toFixed(2) });
      })
      .catch(() => {});
  }, []);

  return (
    <main className="flex flex-col items-start min-h-screen text-white bg-[#5f3dc4] px-6 py-6">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={goBack} className="text-gray-300 hover:text-white transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Saisie</h1>
      </div>

      <form
        action="/api/insert-data"
        method="POST"
        className="flex flex-col gap-4 w-full max-w-sm"
      >

        <select name="user_id" className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 
               focus:outline-none focus:ring-2 focus:ring-white/30
               md:px-4 md:py-2 md:text-base">
          <option value="1" className="bg-[#8d6bf2] text-[#f3f0ff]">Usopp</option>
          <option value="3" className="bg-[#8d6bf2] text-[#f3f0ff]">Nico Robin</option>
          <option value="2" className="bg-[#8d6bf2] text-[#f3f0ff]">DTeach</option>
          <option value="4" className="bg-[#8d6bf2] text-[#f3f0ff]">Jinbe</option>
        </select>

        <div className="flex items-center gap-2">
          <label>&nbsp;Date : </label>
          <input
            type="date"
            name="date_claimed"
            required
            defaultValue={today}
            className="px-3 py-2 rounded text-black"
          />
          <input
            type="time"
            name="time_claimed"
            defaultValue="00:00"
            className="px-3 py-2 rounded text-black"
          />
        </div>

        <div className="flex items-center gap-2">
          <label>&nbsp;Defit amount : </label>
          <input
            type="text"
            name="defit_amount"
            placeholder="defit_amount"
            required
            className="px-3 py-2 rounded text-black"
          />
        </div>

        <select name="activity_type" className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 
               focus:outline-none focus:ring-2 focus:ring-white/30
               md:px-4 md:py-2 md:text-base">
          <option value="1" className="bg-[#8d6bf2] text-[#f3f0ff]">Running</option>
          <option value="2" className="bg-[#8d6bf2] text-[#f3f0ff]">Marche</option>
          <option value="3" className="bg-[#8d6bf2] text-[#f3f0ff]">Cyclisme</option>
          <option value="4" className="bg-[#8d6bf2] text-[#f3f0ff]">Natation</option>
        </select>

        <select name="participation_percentage" className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 
               focus:outline-none focus:ring-2 focus:ring-white/30
               md:px-4 md:py-2 md:text-base">
          <option value="50" className="bg-[#8d6bf2] text-[#f3f0ff]">50%</option>
          <option value="100" className="bg-[#8d6bf2] text-[#f3f0ff]">100%</option>
        </select>

        <div className="flex items-center gap-2">
          <label>&nbsp;Kilometers : </label>
          <input
            type="text"
            name="kilometers"
            placeholder="kilometers"
            required
            className="px-3 py-2 rounded text-black"
          />
        </div>

        <div className="flex items-center gap-2">
          <label>&nbsp;Durée : </label>
          <input type="number" name="duration_h"  min="0" max="23" placeholder="hh" className="px-2 py-2 rounded text-black w-16 text-center" />
          <span className="text-white font-bold">h</span>
          <input type="number" name="duration_m"  min="0" max="59" placeholder="mm" className="px-2 py-2 rounded text-black w-16 text-center" />
          <span className="text-white font-bold">m</span>
          <input type="number" name="duration_s"  min="0" max="59" placeholder="ss" className="px-2 py-2 rounded text-black w-16 text-center" />
          <span className="text-white font-bold">s</span>
        </div>

        <input type="hidden" name="weth_value"       defaultValue="0" />
        <input type="hidden" name="current_liquidity" defaultValue="0" />
        <input type="hidden" name="pool_weth"         defaultValue="0" />
        <input type="hidden" name="pool_usdc"         defaultValue="0" />
        <input type="hidden" name="rewards_weth"      defaultValue="0" />

        <input type="hidden" name="rewards_usdc" defaultValue="0" />

        {poolData && (
          <div className="flex flex-col gap-1 text-sm border border-white/20 rounded-lg px-4 py-3 bg-white/5">
            <div className="flex justify-between">
              <span className="text-white/60">Pool</span>
              <span className="font-bold text-white">{poolData.pool} $</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Wallet USDC</span>
              <span className="font-bold text-white">{poolData.usdc} $</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Wallet WETH</span>
              <span className="font-bold text-white">{poolData.wethUSD} $</span>
            </div>
            <div className="flex justify-between border-t border-white/20 pt-1 mt-1">
              <span className="text-white/60">Total</span>
              <span className="font-bold text-[#D6C48A]">{poolData.total} $</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-white text-[#5f3dc4] font-semibold py-2 rounded hover:bg-gray-200"
        >
          Envoyer
        </button>

      </form>
    </main>
  );
}

