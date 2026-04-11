"use client";


import { useEffect, useState } from "react";
import { useDefitPrice } from "../api/useDefitPrice/useDefitPrice";

export default function Home() {

  const [defitAmount, setDefitAmount] = useState(0);
  const [dollarAmount, setDollarAmount] = useState(0);
  const [user_liquidity, setUserLiquidity] = useState(0);

  const USER_ID_MAP = { usopp: "1", dteach: "2", nicor: "3", jinbe: "4" };

  const [selected, setSelected] = useState(() => {
    if (typeof window === "undefined") return "1";
    try {
      const raw = localStorage.getItem("auth_session");
      if (!raw) return "1";
      const { user } = JSON.parse(raw);
      return USER_ID_MAP[user] ?? "1";
    } catch { return "1"; }
  });

  const { price: defitPrice } = useDefitPrice();

  const [open, setOpen] = useState(false);
  const [boostMax, setBoostMax] = useState(null);

  const fetchBoostMax = async (athleteId) => {
    try {
      const [wRes, dRes] = await Promise.all([
        fetch("/api/wallet"),
        fetch("/api/get-distributions"),
      ]);
      const wallet = await wRes.json();
      const distrib = await dRes.json();
      const disponible = Number(wallet.usdc) - Number(distrib.total);
      const nameMap = { "1": "Usopp", "2": "DTeach", "3": "Nico Robin", "4": "Jinbe" };
      const u = distrib.byUser?.find(r => r.name === nameMap[athleteId]);
      if (!u) { setBoostMax(null); return; }
      const percent = (u.starting_offered_liquidity + u.initial_liquidity) / (100 + 135 + 885 + 60);
      const val = 0.5 * ((100 + 135 + 885 + 60) / (2180.85 + 60)) * disponible * percent;
      setBoostMax(val);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDefitAmount = async (athleteId) => {
    try {
      const res = await fetch(`/api/get-user-defit-amount?id=${athleteId}`);
      const data = await res.json();
      setDefitAmount(Number(data.defits) ?? 0);
      setDollarAmount(Number(data.dollars) ?? 0);
      setUserLiquidity(Number(data.user_liquidity) ?? 0);
    } catch (error) {
      console.error("Erreur fetch DEFIT:", error);
    }
  };


  useEffect(() => {
    let finalId = "1";
    try {
      const raw = localStorage.getItem("auth_session");
      if (raw) {
        const { user } = JSON.parse(raw);
        finalId = USER_ID_MAP[user] ?? "1";
      }
    } catch { /* ignore */ }

    setSelected(finalId);
    localStorage.setItem("selectedAthlete", finalId);
    fetchDefitAmount(finalId);
    fetchBoostMax(finalId);
  }, []);

  const handleSelect = (e) => {
    const id = e.target.value;
    setSelected(id);
    localStorage.setItem("selectedAthlete", id);
    fetchDefitAmount(id);
    fetchBoostMax(id);
  };

  // Liste des éléments du tableau
  const rows = ["Personnage", "T-Shirt", "Montre", "Short", "Chaussettes", "Chaussures"];

  // Valeurs pour chaque ID (1 à 4)
  const dataBySelected = {
    "1": {
      "T-Shirt": ["A", "0"],
      "Short": ["A", "0"],
      "Chaussettes": ["A", "0"],
      "Chaussures": ["A", "0"],
      "Montre": ["A", "0"],
      "Personnage": ["A", "0"],
    },
    "2": {
      "T-Shirt": [,],
      "Short": [,],
      "Chaussettes": [,],
      "Chaussures": [,],
      "Montre": [,],
      "Personnage": [,],
    },
    "3": {
      "T-Shirt": ["A", "0"],
      "Short": ["A", "0"],
      "Chaussettes": ["A", "0"],
      "Chaussures": [,],
      "Montre": [,],
      "Personnage": [,],
    },
    "4": {
      "T-Shirt": [,],
      "Short": [,],
      "Chaussettes": ["A", "0"],
      "Chaussures": [,],
      "Montre": [,],
      "Personnage": [,],
    },
  };


  return (
    <main className="relative w-full max-w-screen-xl mx-auto px-6 md:px-16 flex flex-col justify-center min-h-[calc(100svh-144px)] md:min-h-[calc(100vh-96px)] md:justify-start md:pt-0 md:pb-0">

      {/* Sélecteur d’athlète centré au-dessus de l’image */}
      <div className="flex justify-center mb-2 mt-1 md:mt-10">
        <select
          value={selected}
          onChange={handleSelect}
          className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 
               focus:outline-none focus:ring-2 focus:ring-white/30
               md:px-4 md:py-2 md:text-base"
        >
          <option value="1" className="bg-[#3b2d8a] text-white">Usopp</option>
          <option value="3" className="bg-[#3b2d8a] text-white">Nico Robin</option>
          <option value="2" className="bg-[#3b2d8a] text-white">DTeach</option>
          <option value="4" className="bg-[#3b2d8a] text-white">Jinbe</option>
        </select>
      </div>


      <div className="flex justify-center items-start gap-0 mb-2">

        {/* Image + SVG dans un conteneur relatif */}
        <div className="relative" style={{ width: 160 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selected === "1" ? "/images/runner_init3.png" : "/images/runner_init2.png"}
            alt="Athlete"
            width={160}
            className="rounded-2xl"
            loading="eager"
          />
          {/* SVG par-dessus l'image, overflow visible vers la droite */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width="160" height="100%"
            overflow="visible"
          >
            {[
              { x: 98, y: 26, tx: 170, ty: 69 },
              { x: 98, y: 80, tx: 170, ty: 88 },
              { x: 125, y: 126, tx: 170, ty: 107 },
              { x: 98, y: 144, tx: 170, ty: 126 },
              { x: 102, y: 202, tx: 170, ty: 146 },
              { x: 114, y: 218, tx: 170, ty: 165 },
            ].map(({ x, y, tx, ty }, i) => (
              <g key={i}>
                <line x1={x} y1={y} x2={tx} y2={ty} stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3,2" />
                <circle cx={x} cy={y} r="2.5" fill="rgba(255,255,255,0.7)" />
              </g>
            ))}
          </svg>
        </div>

        {/* TABLE */}
        <div className="flex flex-col justify-start" style={{ marginTop: "40px" }}>
          <table className="border-collapse text-center text-xs text-gray-200">
            <thead>
              <tr className="text-white font-semibold">
                <th className="px-2 py-1 hidden"></th>
                <th className="px-2 py-1">Classe</th>
                <th className="px-2 py-1">Niveau</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => {
                const [col1 = "---", col2 = "---"] = dataBySelected[selected]?.[item] ?? ["---", "---"];
                return (
                  <tr key={item}>
                    <td className="px-2 py-1 text-white hidden"></td>
                    <td className="px-2 py-1">{col1}</td>
                    <td className="px-2 py-1">{col2}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Boost maximum disponible */}
      <div className="rounded-xl overflow-hidden shadow-lg border border-white/10 mb-4 w-full max-w-sm md:max-w-[550px] mx-auto bg-[#5C42A6] flex items-center justify-between px-8 py-2">
        <span className="text-white text-xs font-semibold uppercase tracking-wide">Boost max disponible</span>
        <span className="text-[#D6C48A] font-bold text-base">{boostMax !== null ? boostMax.toFixed(2) : "—"} $</span>
      </div>

      {/* Tableau des stats */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-4 mb-4 w-full max-w-sm md:max-w-[550px] mx-auto">
        <table className="w-full text-base">
          <tbody>
            <tr className="border-b border-white/20">
              <td className="py-2 px-2">
                <span className="inline-flex items-center">
                  DEFIT
                  <span
                    onClick={() => setOpen(!open)}
                    className="ml-1 relative inline-flex items-center justify-center 
                 w-4 h-4 text-xs border border-white/50 rounded-full 
                 cursor-pointer align-middle"
                  >
                    ?

                    {open && (
                      <span
                        className="absolute bottom-full mb-2 
                          left-0 sm:left-1/2 sm:-translate-x-1/2
                          w-[230px] sm:w-[300px] lg:w-[350px]
                          px-3 py-2 
                          bg-black text-white text-xs rounded 
                          whitespace-pre-line text-left sm:text-center
                          shadow-lg z-10"
                      >
                        Defits actuellement bloqués et non récupérables.
                        {`\n`}Non comptés dans le total.
                      </span>
                    )}
                  </span>
                </span>
              </td>
              <td className="py-2 px-2 text-right font-semibold text-gray-400">
                {Number(defitAmount * defitPrice)?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) + " $" ?? "..."}
              </td>
            </tr>
            <tr className="border-b border-white/20">
              <td className="py-2 px-2">Améliorations</td>
              <td className="py-2 px-2 text-right font-semibold">
                {Number(user_liquidity)?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).replace(",", " ") + " $" ?? "..."}
              </td>
            </tr>
            <tr className="border-b border-white/20">
              <td className="py-2 px-2">Disponible</td>
              <td className="py-2 px-2 text-right font-semibold">
                {Number(dollarAmount)?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).replace(",", " ") + " $" ?? "..."}
              </td>
            </tr>
            <tr className="border-t-4 border-transparent text-white bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400">
              <td className="py-2 px-2 font-bold">TOTAL</td>
              <td className="py-2 px-2 text-right font-semibold">
                {Number(dollarAmount + user_liquidity)?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).replace(",", " ") + " $" ?? "..."}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
