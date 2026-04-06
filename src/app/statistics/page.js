"use client";

import { useDefitPrice } from "../api/useDefitPrice/useDefitPrice";
import { useEffect, useState } from "react";

const ACTIVITIES = [
  { id: 0, label: "Tout" },
  { id: 1, label: "Running" },
  { id: 2, label: "Marche" },
  { id: 3, label: "Cyclisme" },
  { id: 4, label: "Natation" },
];

export default function Home() {
  const { price: defitPrice } = useDefitPrice();

  const [totals, setTotals]   = useState([]);
  const [totals2, setTotals2] = useState([]);
  const [totals3, setTotals3] = useState([]);
  const [bonus, setBonus]     = useState([]);

  const [selected,  setSelected]  = useState(() => Number(localStorage.getItem("statsPeriodGains"))    || 1);
  const [selected2, setSelected2] = useState(() => Number(localStorage.getItem("statsPeriodDistance")) || 1);
  const [selected3, setSelected3] = useState(() => Number(localStorage.getItem("statsPeriodDefits"))   || 1);

  const [activity,  setActivity]  = useState(() => Number(localStorage.getItem("statsActivityGains"))    || 0);
  const [activity2, setActivity2] = useState(() => Number(localStorage.getItem("statsActivityDistance")) || 0);
  const [activity3, setActivity3] = useState(() => Number(localStorage.getItem("statsActivityDefits"))   || 0);

  const fetchTotals = async (period, act) => {
    try {
      const res = await fetch(`/api/get-user-totals?id=${period}&activity=${act}`);
      setTotals((await res.json()) || []);
    } catch (e) { console.error("Erreur fetchTotals:", e); }
  };

  const fetchTotals2 = async (period, act) => {
    try {
      const res = await fetch(`/api/get-user-totals?id=${period}&activity=${act}`);
      setTotals2((await res.json()) || []);
    } catch (e) { console.error("Erreur fetchTotals2:", e); }
  };

  const fetchTotals3 = async (period, act) => {
    try {
      const res = await fetch(`/api/get-user-totals?id=${period}&activity=${act}`);
      setTotals3((await res.json()) || []);
    } catch (e) { console.error("Erreur fetchTotals3:", e); }
  };

  const fetchBonus = async () => {
    try {
      const res = await fetch(`/api/get-weekly-distance-bonus`);
      setBonus((await res.json()) || []);
    } catch (e) { console.error("Erreur fetchBonus:", e); }
  };

  useEffect(() => { fetchTotals(selected, activity);    localStorage.setItem("statsPeriodGains",    selected);  localStorage.setItem("statsActivityGains",    activity);  }, [selected, activity]);
  useEffect(() => { fetchTotals2(selected2, activity2); localStorage.setItem("statsPeriodDistance", selected2); localStorage.setItem("statsActivityDistance", activity2); }, [selected2, activity2]);
  useEffect(() => { fetchTotals3(selected3, activity3); localStorage.setItem("statsPeriodDefits",   selected3); localStorage.setItem("statsActivityDefits",   activity3); }, [selected3, activity3]);
  useEffect(() => { fetchBonus(); }, []);

  const sortedTotals  = [...totals].sort((a, b)  => (b.boost ?? 0) - (a.boost ?? 0));
  const sortedTotals2 = [...totals2].sort((a, b) => (b.kilometers ?? 0) - (a.kilometers ?? 0));
  const sortedDefits  = [...totals3].sort((a, b) =>
    (defitPrice ?? 0) * (b.defit_amount ?? 0) - (defitPrice ?? 0) * (a.defit_amount ?? 0)
  );

  const medal = (idx) => idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : null;

  const PeriodFilter = ({ value, onChange }) => (
    <div className="flex flex-wrap bg-white/10 rounded-xl p-1 gap-1">
      {[1, 2, 3].map((id) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 ${
            value === id ? "bg-[#D6C48A] text-[#2A2550] shadow-md" : "text-white hover:bg-white/10"
          }`}
        >
          {id === 1 ? "Année" : id === 2 ? "Mois" : "Semaine"}
        </button>
      ))}
    </div>
  );

  const ActivityFilter = ({ value, onChange }) => (
    <div className="flex flex-wrap bg-white/10 rounded-xl p-1 gap-1">
      {ACTIVITIES.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-150 ${
            value === id ? "bg-white/30 text-white shadow-md" : "text-white/60 hover:bg-white/10"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const Filters = ({ period, onPeriod, act, onAct }) => (
    <div className="flex flex-col gap-2 mb-5 pl-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-white/40 text-xs uppercase tracking-widest w-14 shrink-0">Période</span>
        <PeriodFilter value={period} onChange={onPeriod} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-white/40 text-xs uppercase tracking-widest w-14 shrink-0">Sport</span>
        <ActivityFilter value={act} onChange={onAct} />
      </div>
    </div>
  );

  const SectionTitle = ({ icon, children }) => (
    <div className="flex items-center gap-2 mb-4 mt-1">
      <span className="text-lg">{icon}</span>
      <h2 className="text-white text-base font-bold uppercase tracking-widest">{children}</h2>
      <div className="flex-1 h-px bg-white/10 ml-2" />
    </div>
  );

  const LeaderboardTable = ({ rows, cols }) => (
    <div className="rounded-xl overflow-hidden shadow-lg border border-white/10">
      <table className="w-full table-auto text-left border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 text-white text-xs uppercase tracking-wide">
            {cols.map((col) => (
              <th key={col.key} className={`py-3 px-4 font-semibold ${col.right ? "text-right" : ""}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? rows.map((row, idx) => (
            <tr
              key={idx}
              className={`border-b border-white/10 transition-colors hover:bg-white/10 text-sm ${
                idx % 2 === 0 ? "bg-[#5C42A6]" : "bg-[#4e3899]"
              }`}
            >
              {cols.map((col) => (
                <td key={col.key} className={`py-3 px-4 ${col.right ? "text-right" : ""} ${col.gold ? "text-[#D6C48A] font-bold" : "text-gray-200"}`}>
                  {col.render ? col.render(row, idx) : row[col.key]}
                </td>
              ))}
            </tr>
          )) : (
            <tr className="bg-[#5C42A6]">
              <td colSpan={cols.length} className="py-4 px-4 text-gray-400 text-sm text-center italic">
                Aucune donnée pour cette période
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const fmt = (n) => Number(n ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(",", " ");

  const athleteCol = {
    key: "name", label: "Athlète",
    render: (row, idx) => (
      <span className="flex items-center gap-2">
        {medal(idx)
          ? <span className="text-base w-5 text-center">{medal(idx)}</span>
          : <span className="text-gray-500 text-xs w-5 text-center">{idx + 1}</span>}
        <span className="text-white font-medium">{row.name}</span>
      </span>
    ),
  };

  return (
    <main className="flex flex-col w-full max-w-screen-xl mx-auto px-4 md:px-8 pt-6 pb-10 overflow-x-hidden">
      <div className="w-full md:max-w-[900px] mx-auto flex flex-col gap-10">

        {/* BONUS EN COURS */}
        <div className="rounded-xl overflow-hidden shadow-lg border border-white/10">
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 py-3 px-5 text-white text-xs font-semibold uppercase tracking-wide text-center">
            🎯 Bonus en cours — du 06/04 au 12/04
          </div>
          <div className="bg-[#5C42A6] py-4 px-5 text-center text-gray-200 text-sm">
            Meilleure distance running hebdomadaire :{" "}
            <span className="text-[#D6C48A] font-bold ml-1">
              {bonus[0]?.bonus ? Number(bonus[0].bonus).toFixed(2) : "…"} $
            </span>
          </div>
        </div>

        {/* GAINS ($) */}
        <div>
          <SectionTitle icon="💰">Gains ($)</SectionTitle>
          <Filters period={selected} onPeriod={setSelected} act={activity} onAct={setActivity} />
          <LeaderboardTable
            rows={sortedTotals}
            cols={[
              athleteCol,
              { key: "total", label: "Total ($)", right: true, gold: true, render: (row) => fmt(row.boost) },
            ]}
          />
        </div>

        {/* DISTANCE */}
        <div>
          <SectionTitle icon="📏">Distance</SectionTitle>
          <Filters period={selected2} onPeriod={setSelected2} act={activity2} onAct={setActivity2} />
          <LeaderboardTable
            rows={sortedTotals2}
            cols={[
              athleteCol,
              { key: "kilometers", label: "Kilomètres", right: true, gold: true, render: (row) => fmt(row.kilometers) },
            ]}
          />
        </div>

        {/* GAINS (DEFITS) */}
        <div>
          <SectionTitle icon="💰">
            Gains Defit{" "}
            <span className="text-[#D6C48A] font-bold normal-case tracking-normal ml-1">
              ({defitPrice?.toFixed(4) ?? "…"} $)
            </span>
          </SectionTitle>
          <Filters period={selected3} onPeriod={setSelected3} act={activity3} onAct={setActivity3} />
          <LeaderboardTable
            rows={sortedDefits}
            cols={[
              athleteCol,
              { key: "defit_amount", label: "Defits", right: true, render: (row) => fmt(row.defit_amount) },
              {
                key: "defit_usd", label: "Defits ($)", right: true, gold: true,
                render: (row) => fmt(defitPrice * (row.defit_amount ?? 0)),
              },
            ]}
          />
        </div>

      </div>
    </main>
  );
}
