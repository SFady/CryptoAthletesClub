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

  const [selected,  setSelected]  = useState(1);
  const [selected2, setSelected2] = useState(1);
  const [selected3, setSelected3] = useState(1);
  const [activity,  setActivity]  = useState(0);
  const [activity2, setActivity2] = useState(0);
  const [activity3, setActivity3] = useState(0);
  const [mounted,   setMounted]   = useState(false);

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

  useEffect(() => {
    setSelected( Number(localStorage.getItem("statsPeriodGains"))       || 1);
    setSelected2(Number(localStorage.getItem("statsPeriodDistance"))    || 1);
    setSelected3(Number(localStorage.getItem("statsPeriodDefits"))      || 1);
    setActivity( Number(localStorage.getItem("statsActivityGains"))     || 0);
    setActivity2(Number(localStorage.getItem("statsActivityDistance"))  || 0);
    setActivity3(Number(localStorage.getItem("statsActivityDefits"))    || 0);
    setMounted(true);
    fetchBonus();
  }, []);

  useEffect(() => { if (!mounted) return; fetchTotals(selected, activity);    localStorage.setItem("statsPeriodGains",    selected);  localStorage.setItem("statsActivityGains",    activity);  }, [mounted, selected, activity]);
  useEffect(() => { if (!mounted) return; fetchTotals2(selected2, activity2); localStorage.setItem("statsPeriodDistance", selected2); localStorage.setItem("statsActivityDistance", activity2); }, [mounted, selected2, activity2]);
  useEffect(() => { if (!mounted) return; fetchTotals3(selected3, activity3); localStorage.setItem("statsPeriodDefits",   selected3); localStorage.setItem("statsActivityDefits",   activity3); }, [mounted, selected3, activity3]);

  const sortedTotals  = [...totals].sort((a, b)  => (b.boost ?? 0) - (a.boost ?? 0));
  const sortedTotals2 = [...totals2].sort((a, b) => (b.kilometers ?? 0) - (a.kilometers ?? 0));
  const sortedDefits  = [...totals3].sort((a, b) =>
    (defitPrice ?? 0) * (b.defit_amount ?? 0) - (defitPrice ?? 0) * (a.defit_amount ?? 0)
  );

  const medal = (idx) => idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : null;

  const noFocus = (e) => e.preventDefault();

  const PeriodFilter = ({ value, onChange }) => (
    <div className="flex flex-wrap bg-white/10 rounded-xl p-1 gap-1">
      {[1, 2, 3].map((id) => (
        <button
          key={id}
          onMouseDown={noFocus}
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
    <div className="flex bg-white/10 rounded-xl p-1 gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
      {ACTIVITIES.map(({ id, label }) => (
        <button
          key={id}
          onMouseDown={noFocus}
          onClick={() => onChange(id)}
          className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap flex-shrink-0 ${
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
        <span className="text-white/40 text-xs uppercase tracking-widest w-20 shrink-0">Période</span>
        <PeriodFilter value={period} onChange={onPeriod} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-white/40 text-xs uppercase tracking-widest w-20 shrink-0">Sport</span>
        <ActivityFilter value={act} onChange={onAct} />
      </div>
    </div>
  );

  const LeaderboardTable = ({ rows, cols }) => (
    <div className="rounded-xl overflow-hidden border border-white/10">
      <table className="w-full table-auto text-left border-collapse">
        <thead>
          <tr className="bg-white/[0.06] text-white/60 text-xs uppercase tracking-wide">
            {cols.map((col) => (
              <th key={col.key} className={`py-2 px-4 font-semibold ${col.right ? "text-right" : ""}`}>
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
                idx % 2 === 0 ? "bg-white/[0.03]" : "bg-transparent"
              }`}
            >
              {cols.map((col) => (
                <td key={col.key} className={`py-2.5 px-4 ${col.right ? "text-right" : ""} ${col.gold ? "text-[#D6C48A] font-bold" : "text-gray-200"}`}>
                  {col.render ? col.render(row, idx) : row[col.key]}
                </td>
              ))}
            </tr>
          )) : (
            <tr>
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

  const Card = ({ icon, title, subtitle, children }) => (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-white/10">
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 py-3 px-5 flex items-center gap-2">
        <span className="text-lg flex-shrink-0">{icon}</span>
        <div className="flex flex-col">
          <h2 className="text-white text-sm font-bold uppercase tracking-widest">{title}</h2>
          {subtitle && <span className="text-white/70 text-xs">{subtitle}</span>}
        </div>
      </div>
      <div className="bg-white/[0.05] backdrop-blur-md px-4 py-4">
        {children}
      </div>
    </div>
  );

  return (
    <main className="flex flex-col w-full max-w-screen-xl mx-auto px-4 md:px-8 pt-6 pb-10 overflow-x-hidden">
      <div className="w-full md:max-w-[900px] mx-auto flex flex-col gap-6">

        {/* BONUS EN COURS */}
        <Card icon="🎯" title="Bonus en cours" subtitle="du 20/04 au 27/04">
          <p className="text-center text-gray-200 text-sm">
            Meilleure distance running hebdomadaire :{" "}
            <span className="text-[#D6C48A] font-bold ml-1">
              {bonus[0]?.bonus ? Number(bonus[0].bonus).toFixed(2) : "…"} $
            </span>
          </p>
        </Card>

        {/* GAINS ($) */}
        <Card icon="💰" title="Gains ($)">
          <Filters period={selected} onPeriod={setSelected} act={activity} onAct={setActivity} />
          <LeaderboardTable
            rows={sortedTotals}
            cols={[
              athleteCol,
              { key: "total", label: "Total ($)", right: true, gold: true, render: (row) => fmt(row.boost) },
            ]}
          />
        </Card>

        {/* DISTANCE */}
        <Card icon="📏" title="Distance">
          <Filters period={selected2} onPeriod={setSelected2} act={activity2} onAct={setActivity2} />
          <LeaderboardTable
            rows={sortedTotals2}
            cols={[
              athleteCol,
              { key: "kilometers", label: "Kilomètres", right: true, gold: true, render: (row) => fmt(row.kilometers) },
            ]}
          />
        </Card>

        {/* GAINS (DEFITS) */}
        <Card
          icon="💰"
          title={<>Gains Defit <span className="text-[#D6C48A] font-bold normal-case tracking-normal ml-1">({defitPrice?.toFixed(4) ?? "…"} $)</span></>}
        >
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
        </Card>

      </div>
    </main>
  );
}
