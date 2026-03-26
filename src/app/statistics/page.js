"use client";

import { useDefitPrice } from "../api/useDefitPrice/useDefitPrice";
import { useEffect, useState } from "react";

export default function Home() {
  const { price: defitPrice } = useDefitPrice();

  const [totals, setTotals] = useState([]);
  const [totals2, setTotals2] = useState([]);
  const [bonus, setBonus] = useState([]);
  const [selected, setSelected] = useState(1);
  const [selected2, setSelected2] = useState(1);

  const fetchTotals = async (period) => {
    try {
      const res = await fetch(`/api/get-user-totals?id=${period}`);
      const data = await res.json();
      setTotals(data || []);
    } catch (error) {
      console.error("Erreur fetchTotals:", error);
    }
  };

  const fetchTotals2 = async (period) => {
    try {
      const res = await fetch(`/api/get-user-totals?id=${period}`);
      const data = await res.json();
      setTotals2(data || []);
    } catch (error) {
      console.error("Erreur fetchTotals2:", error);
    }
  };

  const fetchBonus = async () => {
    try {
      const res = await fetch(`/api/get-weekly-distance-bonus`);
      const data = await res.json();
      setBonus(data || []);
    } catch (error) {
      console.error("Erreur fetchBonus:", error);
    }
  };

  useEffect(() => {
    fetchTotals(selected);
    fetchTotals2(selected2);
    fetchBonus();
  }, [selected, selected2]);

  // ✅ TRI GAINS
  const sortedTotals = [...totals].sort((a, b) => {
    const totalA = a.boost ?? 0; // ou defit + boost
    const totalB = b.boost ?? 0;
    return totalB - totalA;
  });

  // ✅ TRI DISTANCE
  const sortedTotals2 = [...totals2].sort((a, b) => {
    const kmA = a.kilometers ?? 0;
    const kmB = b.kilometers ?? 0;
    return kmB - kmA;
  });

  const sortedDefits = [...totals].sort((a, b) => {
  const defitA = (defitPrice ?? 0) * (a.defit_amount ?? 0);
  const defitB = (defitPrice ?? 0) * (b.defit_amount ?? 0);

  return defitB - defitA; // ordre décroissant
});

  return (
    <main className="flex flex-col w-full max-w-screen-xl mx-auto px-4 md:px-8 pt-4 pb-4">
      <div className="max-w-[800px] w-full mx-auto">        

        <div className="rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full table-auto text-center border-collapse bg-[#5C42A6]">
          <thead>
            <tr className="text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
              <th className="py-2 px-3">Bonus en cours (du 23/03 au 29/03)</th>
            </tr>
          </thead>
          <tbody className="text-gray-200">
            <tr>
              <td className="py-2 px-3">
                Meilleure Distance hebdomadaire : {bonus[0]?.bonus ? Number(bonus[0].bonus).toFixed(2) : "..."} $
              </td>
            </tr>
          </tbody>
        </table>
        </div>

        <br /><br />

        {/* GAINS */}
        <h2 className="text-white text-lg font-semibold mb-2">
          Gains ($)
        </h2>

        <div className="flex justify-start gap-2 mb-2">
          {[1, 2, 3].map((id) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`px-3 py-1 text-sm rounded transition
                ${selected === id
                  ? "bg-[#D6C48A] text-[#2A2550]"
                  : "bg-[#6B5FA7] text-white hover:bg-[#7569B3]"}
              `}
            >
              {id === 1 ? "Année" : id === 2 ? "Mois" : "Semaine"}
            </button>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full table-auto text-left border-collapse bg-[#5C42A6]">
          <thead>
            <tr className="text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
              <th className="py-2 px-3">Athlete</th>
              {/* <th className="py-2 px-3 text-right">Defits</th>
              <th className="py-2 px-3 text-right">Defits ($)</th>
              <th className="py-2 px-3 text-right">Boost ($)</th> */}
              <th className="py-2 px-3 text-right">Total ($)</th>
            </tr>
          </thead>
          <tbody className="text-gray-200">
            {sortedTotals.length > 0 ? (
              sortedTotals.map((row, idx) => {
                const defit = Number(defitPrice * (row.defit_amount ?? 0));
                const boost = Number(row.boost ?? 0);
                const total = boost;

                return (
                  <tr key={idx}>
                    <td className="py-1 px-3">
                      {idx === 0 && "🥇 "}
                      {idx === 1 && "🥈 "}
                      {idx === 2 && "🥉 "}
                      {idx > 2 && `\u00A0${idx + 1}\u00A0\u00A0\u00A0`}
                      {row.name}
                    </td>

                    {/* <td className="text-gray-400 py-1 px-3 text-right">
                      {(row.defit_amount ?? 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).replace(",", " ")}
                    </td>

                    <td className="text-gray-400 py-1 px-3 text-right">
                      {defit.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).replace(",", " ")}
                    </td>

                    <td className="text-gray-400 py-1 px-3 text-right">
                      {boost.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).replace(",", " ")}
                    </td> */}

                    <td className="py-1 px-3 text-right">
                      {total.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).replace(",", " ")}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-2 text-gray-400">
                  Chargement...
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>

        <br /><br />

        {/* DISTANCE */}
        <h2 className="text-white text-lg font-semibold mb-2">
          Distance
        </h2>

        <div className="flex justify-start gap-2 mb-2">
          {[1, 2, 3].map((id) => (
            <button
              key={id}
              onClick={() => setSelected2(id)}
              className={`px-3 py-1 text-sm rounded transition
                ${selected2 === id
                  ? "bg-[#D6C48A] text-[#2A2550]"
                  : "bg-[#6B5FA7] text-white hover:bg-[#7569B3]"}
              `}
            >
              {id === 1 ? "Année" : id === 2 ? "Mois" : "Semaine"}
            </button>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full table-auto text-left border-collapse bg-[#5C42A6]">
          <thead>
            <tr className="text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
              <th className="py-2 px-3">Athlete</th>
              <th className="py-2 px-3 text-right">Kilomètres</th>
            </tr>
          </thead>
          <tbody className="text-gray-200">
            {sortedTotals2.length > 0 ? (
              sortedTotals2.map((row, idx) => (
                <tr key={idx}>
                  <td className="py-1 px-3">
                    {idx === 0 && "🥇 "}
                    {idx === 1 && "🥈 "}
                    {idx === 2 && "🥉 "}
                     {idx > 2 && `\u00A0${idx + 1}\u00A0\u00A0\u00A0`}
                    {row.name}
                  </td>

                  <td className="py-1 px-3 text-right">
                    {Number(row.kilometers ?? 0)
                      .toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                      .replace(",", " ")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-2 text-gray-400">
                  Chargement...
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>

        <br /><br />

        {/* TABLEAU PRIX DEFIT */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full table-auto text-center border-collapse bg-[#5C42A6]">
          <thead>
            <tr className="text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
              <th className="py-2 px-3">Cours du Defit</th>
            </tr>
          </thead>
          <tbody className="text-gray-200">
            <tr>
              <td className="text-gray-400 py-2 px-3">
                {defitPrice?.toFixed(4) ?? "..."} $
              </td>
            </tr>
          </tbody>
        </table>
        </div>

        <br /><br />

        {/* GAINS */}
        <h2 className="text-white text-lg font-semibold mb-2">
          Gains (Defits)
        </h2>

        <div className="flex justify-start gap-2 mb-2">
          {[1, 2, 3].map((id) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`px-3 py-1 text-sm rounded transition
                ${selected === id
                  ? "bg-[#D6C48A] text-[#2A2550]"
                  : "bg-[#6B5FA7] text-white hover:bg-[#7569B3]"}
              `}
            >
              {id === 1 ? "Année" : id === 2 ? "Mois" : "Semaine"}
            </button>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full table-auto text-left border-collapse bg-[#5C42A6]">
          <thead>
            <tr className="text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
              <th className="py-2 px-3">Athlete</th>
              <th className="py-2 px-3 text-right">Defits</th>
              <th className="py-2 px-3 text-right">Defits ($)</th>
            </tr>
          </thead>
          <tbody className="text-gray-200">
{sortedDefits.length > 0 ? (
  sortedDefits.map((row, idx) => {
    const defit = Number(defitPrice * (row.defit_amount ?? 0));

    return (
      <tr key={idx}>
        <td className="py-1 px-3">
          {idx === 0 && "🥇 "}
          {idx === 1 && "🥈 "}
          {idx === 2 && "🥉 "}
          {idx > 2 && `\u00A0${idx + 1}\u00A0\u00A0\u00A0`}
          {row.name}
        </td>

        <td className="text-gray-400 py-1 px-3 text-right">
          {(row.defit_amount ?? 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).replace(",", " ")}
        </td>

        <td className="text-gray-400 py-1 px-3 text-right">
          {defit.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).replace(",", " ")}
        </td>
      </tr>
    );
  })
) : (
  <tr>
    <td colSpan={3} className="py-2 text-gray-400">
      Chargement...
    </td>
  </tr>
)}
          </tbody>
        </table>
        </div>

      </div>
    </main>
  );
}