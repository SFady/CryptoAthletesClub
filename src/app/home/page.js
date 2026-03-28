"use client";


import { useEffect, useState } from "react";
import { useDefitPrice } from "../api/useDefitPrice/useDefitPrice";

export default function Home() {

  const [defitAmount, setDefitAmount] = useState(0);
  const [dollarAmount, setDollarAmount] = useState(0);
  const [user_liquidity, setUserLiquidity] = useState(0);

  const [selected, setSelected] = useState("1");

  const { price: defitPrice, error } = useDefitPrice();

  const [open, setOpen] = useState(false);

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
    const stored = localStorage.getItem("selectedAthlete");
    const finalId = stored || "1";
    setSelected(finalId);
    if (!stored) localStorage.setItem("selectedAthlete", finalId);

    fetchDefitAmount(finalId);
  }, []);

  const handleSelect = (e) => {
    const id = e.target.value;
    setSelected(id);
    localStorage.setItem("selectedAthlete", id);
    fetchDefitAmount(id);
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
    <main className="relative w-full max-w-screen-xl mx-auto px-6 md:px-16 pt-6 pb-6 md:pt-0 md:pb-0 md:min-h-[calc(100vh-96px)] overflow-y-auto md:overflow-visible">

      {/* Sélecteur d’athlète centré au-dessus de l’image */}
      <div className="flex justify-center mb-4 mt-2 md:mt-10">
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


      <div className="flex justify-center items-start gap-0 mb-4">

        {/* Image + SVG dans un conteneur relatif */}
        <div className="relative" style={{ width: 200 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selected === "1" ? "/images/runner_init3.png" : "/images/runner_init2.png"}
            alt="Athlete"
            width={200}
            className="rounded-2xl"
            loading="eager"
          />
          {/* SVG par-dessus l'image, overflow visible vers la droite */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width="200" height="100%"
            overflow="visible"
          >
            {[
              { x: 122, y: 32,  tx: 212, ty: 86  },
              { x: 122, y: 100, tx: 212, ty: 110 },
              { x: 156, y: 158, tx: 212, ty: 134 },
              { x: 122, y: 180, tx: 212, ty: 158 },
              { x: 127, y: 252, tx: 212, ty: 182 },
              { x: 143, y: 273, tx: 212, ty: 206 },
            ].map(({ x, y, tx, ty }, i) => (
              <g key={i}>
                <line x1={x} y1={y} x2={tx} y2={ty} stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3,2"/>
                <circle cx={x} cy={y} r="2.5" fill="rgba(255,255,255,0.7)"/>
              </g>
            ))}
          </svg>
        </div>

        {/* TABLE */}
        <div className="flex flex-col justify-start" style={{ marginTop: "50px" }}>
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

      {/* Tableau des stats */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-6 w-full max-w-sm mx-auto">
        <table className="w-full text-base">
          <tbody>
            <tr className="border-b border-white/20">
              <td className="py-3 px-2">
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
              <td className="py-3 px-2 text-right font-semibold text-gray-400">
                {Number(defitAmount * defitPrice)?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) + " $" ?? "..."}
              </td>
            </tr>
            <tr className="border-b border-white/20">
              <td className="py-3 px-2">Améliorations</td>
              <td className="py-3 px-2 text-right font-semibold">
                {Number(user_liquidity)?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).replace(",", " ") + " $" ?? "..."}
              </td>
            </tr>
            <tr className="border-b border-white/20">
              <td className="py-3 px-2">Disponible</td>
              <td className="py-3 px-2 text-right font-semibold">
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
