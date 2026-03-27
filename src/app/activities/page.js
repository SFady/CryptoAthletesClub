"use client";

import { useEffect, useState } from "react";
import { useDefitPrice } from "../api/useDefitPrice/useDefitPrice";
import { FaRunning, FaSwimmer, FaBiking, FaWalking, FaStar } from "react-icons/fa";

export default function Home() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const { price: defitPrice } = useDefitPrice();
  const [selected, setSelected] = useState("0");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  const [showGains, setShowGains] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadActivities("0", 1);
  }, []);

  const loadActivities = async (userId, page) => {
    try {
      const res = await fetch(`/api/get-users-activities?userId=${userId}&page=${page}&limit=${rowsPerPage}`);
      const data = await res.json();
      setRows(data.result);
      setTotal(data.total);
    } catch (err) {
      console.error("Failed to load activities:", err);
    }
  };

  const handleSelect = (e) => {
    const id = e.target.value;
    setSelected(id);
    setCurrentPage(1);
    loadActivities(id, 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadActivities(selected, page);
  };

  const currentRows = rows;
  const totalPages = Math.ceil(total / rowsPerPage);

  const ActivityIcon = ({ name }) => {
    const key = (name || "").toLowerCase();
    const cls = "text-white/80 text-lg";
    if (key === "run" || key === "running")   return (
      <span title="Running" className="inline-flex items-center gap-0.5">
        <span className="flex flex-col gap-0.5">
          <span className="block h-px w-1.5 bg-white/60 rounded-full" />
          <span className="block h-px w-1 bg-white/40 rounded-full" />
          <span className="block h-px w-1.5 bg-white/60 rounded-full" />
        </span>
        <FaRunning className={cls} />
      </span>
    );
    if (key === "swim" || key === "natation") return <span title="Natation" className="inline-flex scale-x-[-1]"><FaSwimmer className={cls} /></span>;
    if (key === "bike" || key === "cyclisme") return <span title="Cyclisme"><FaBiking className={cls} /></span>;
    if (key === "marche" || key === "walk")   return <span title="Marche"><FaWalking className={cls} /></span>;
    if (key === "bonus")                      return <span title="Bonus"><FaStar className={cls} /></span>;
    return <span className="text-gray-200 text-sm">{name}</span>;
  };

  const effortBadge = (pct) => {
    if (pct >= 90) return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
    if (pct >= 60) return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
    return "bg-rose-500/30 text-rose-200 border border-rose-400/50";
  };

  const Pagination = () => (
    <div className="flex justify-center items-center gap-1 flex-wrap mt-5">
      <button
        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 disabled:opacity-30 transition-colors"
      >←</button>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => handlePageChange(i + 1)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            currentPage === i + 1
              ? "bg-[#D6C48A] text-[#2A2550] shadow-lg"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >{i + 1}</button>
      ))}
      <button
        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 disabled:opacity-30 transition-colors"
      >→</button>
    </div>
  );

  return (
    <main className="flex flex-col justify-start w-full max-w-[100vw] md:max-w-screen-xl mx-auto px-6 md:px-16 pt-6 pb-6 min-h-[calc(100vh-96px)] overflow-x-hidden overflow-y-auto">

      {/* FILTER + TOGGLE */}
      <div className="mb-5 flex items-center gap-4 flex-wrap">
        <select
          value={selected}
          onChange={handleSelect}
          className="bg-white/10 text-white px-3 py-2 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D6C48A]/40 text-sm"
        >
          <option value="0" className="bg-[#3b2d8a]">Tous</option>
          <option value="1" className="bg-[#3b2d8a]">Usopp</option>
          <option value="3" className="bg-[#3b2d8a]">Nico Robin</option>
          <option value="2" className="bg-[#3b2d8a]">DTeach</option>
          <option value="4" className="bg-[#3b2d8a]">Jinbe</option>
        </select>

        <div
          className="flex items-center gap-2 text-white text-sm cursor-pointer select-none"
          onClick={() => setShowGains(!showGains)}
        >
          <div className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${showGains ? "bg-[#D6C48A]" : "bg-white/20"}`}>
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${showGains ? "translate-x-5" : "translate-x-0"}`} />
          </div>
          Afficher les Defits
        </div>
      </div>

      {/* CARDS — mobile uniquement */}
      <div className="flex flex-col gap-3 mb-6 w-full md:hidden">
        {currentRows.map((row, idx) => {
          const effort = Math.min(Math.round((row.defit_amount / row.max_defits) * 100), 100);
          const gainDefit = showGains ? (row.defit_amount * row.participation_percentage * defitPrice) / 100 : 0;
          return (
            <div key={row.id} className={`rounded-2xl shadow-lg px-4 py-3 text-white border border-white/10 ${idx % 2 === 0 ? "bg-[#5C42A6]" : "bg-[#4e3899]"}`}>
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <ActivityIcon name={row.activity_name} />
                <span className="font-bold text-[#D6C48A]">
                  {isClient ? new Date(row.date_claimed).toLocaleDateString("fr-FR") : row.date_claimed}
                </span>
                <span className="text-xs font-semibold bg-white/15 text-white px-2 py-0.5 rounded-lg ml-auto">{row.user_name}</span>
              </div>
              {/* Bulles + Image */}
              <div className="flex gap-2 mb-2">
                <div className="flex flex-col gap-1.5 flex-1">
                  <span className={`w-[62%] text-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${effortBadge(effort)}`}>
                    Effort {effort} %
                  </span>
                  <span className="w-[62%] text-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-400/20 text-white border border-purple-400/30">
                    Boost {Number(row.boost).toFixed(2)} $
                  </span>
                  {showGains && (
                    <span className="w-[62%] text-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-400/20 text-white border border-purple-400/30">
                      Defits {((row.defit_amount * row.participation_percentage * defitPrice) / 100).toFixed(2)} $ ({row.defit_amount})
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-end w-16 -translate-x-0.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={row.user_name === "Usopp" ? "/images/runner_init3.png" : "/images/runner_init2.png"}
                    alt={row.user_name}
                    className="h-10 w-auto object-contain"
                  />
                </div>
              </div>
              {/* Total */}
              <div className="flex justify-end border-t border-white/10 pt-2 mt-1">
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 text-white px-5 py-0.5 rounded-full text-sm">
                  Total : {(Number(row.boost) + gainDefit).toFixed(2)} $
                </span>
              </div>
            </div>
          );
        })}
        <Pagination />
      </div>

      {/* TABLE — desktop uniquement */}
      <div className="hidden md:block rounded-2xl shadow-xl overflow-hidden mb-6 w-full border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 text-white text-xs uppercase tracking-wide">
                <th className="py-3.5 px-5 font-semibold">Date</th>
                <th className="py-3.5 px-5 font-semibold">Athlete</th>
                <th className="py-3.5 px-5 font-semibold">Activité</th>
                <th className="py-3.5 px-5 font-semibold">Effort</th>
                {showGains && (
                  <>
                    <th className="py-3.5 px-5 font-semibold">Gain brut (Defit)</th>
                    <th className="py-3.5 px-5 font-semibold">Gain net Defit ($)</th>
                  </>
                )}
                <th className="py-3.5 px-5 font-semibold">Boost ($)</th>
                <th className="py-3.5 px-5 font-semibold">Total ($)</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, idx) => {
                const effort = Math.min(Math.round((row.defit_amount / row.max_defits) * 100), 100);
                const gainDefit = showGains ? (row.defit_amount * row.participation_percentage * defitPrice) / 100 : 0;
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-white/10 transition-colors hover:bg-white/10 text-sm ${idx % 2 === 0 ? "bg-[#5C42A6]" : "bg-[#4e3899]"}`}
                  >
                    <td className="py-4 px-5 text-[#D6C48A] font-semibold whitespace-nowrap tracking-wide">
                      {isClient ? new Date(row.date_claimed).toLocaleDateString("fr-FR") : row.date_claimed}
                    </td>
                    <td className="py-4 px-5 text-white font-semibold">{row.user_name}</td>
                    <td className="py-4 px-5"><ActivityIcon name={row.activity_name} /></td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${effortBadge(effort)}`}>
                        {effort} %
                      </span>
                    </td>
                    {showGains && (
                      <>
                        <td className="py-4 px-5 text-gray-200">{row.defit_amount}</td>
                        <td className="py-4 px-5 text-gray-200">
                          {((row.defit_amount * row.participation_percentage * defitPrice) / 100).toFixed(2)}
                        </td>
                      </>
                    )}
                    <td className="py-4 px-5 text-gray-100">{Number(row.boost).toFixed(2)}</td>
                    <td className="py-4 px-5 text-[#D6C48A] font-bold">{(Number(row.boost) + gainDefit).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="bg-[#4a3491] px-6 pb-5">
          <Pagination />
        </div>
      </div>
    </main>
  );
}
