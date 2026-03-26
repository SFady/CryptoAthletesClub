"use client";

import { useEffect, useState } from "react";
import { useDefitPrice } from "../api/useDefitPrice/useDefitPrice";

export default function Home() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const { price: defitPrice } = useDefitPrice();
  const [selected, setSelected] = useState("0");

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  // ✅ Toggle colonnes gains
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
      console.error("❌ Failed to load activities:", err);
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

  return (
    <main className="flex flex-col justify-start w-full max-w-[100vw] md:max-w-screen-xl mx-auto px-6 md:px-16 pt-6 pb-6 min-h-[calc(100vh-96px)] overflow-x-hidden overflow-y-auto">

      {/* FILTER + CHECKBOX */}
      <div className="mb-4 flex items-center gap-4 flex-wrap">

        <select
          value={selected}
          onChange={handleSelect}
          className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <option value="0" className="bg-[#8d6bf2] text-[#f3f0ff]">Tous</option>
          <option value="1" className="bg-[#8d6bf2] text-[#f3f0ff]">Usopp</option>
          <option value="3" className="bg-[#8d6bf2] text-[#f3f0ff]">Nico Robin</option>
          <option value="2" className="bg-[#8d6bf2] text-[#f3f0ff]">DTeach</option>
          <option value="4" className="bg-[#8d6bf2] text-[#f3f0ff]">Jinbe</option>
        </select>

        <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={showGains}
            onChange={(e) => setShowGains(e.target.checked)}
            className="accent-[#D6C48A]"
          />
          Afficher les Defits
        </label>

      </div>

      {/* CARDS — mobile uniquement */}
      <div className="flex flex-col gap-3 mb-6 w-full md:hidden">
        {currentRows.map((row) => (
          <div key={row.id} className="bg-[#5C42A6] rounded-2xl shadow-lg px-4 py-3 text-sm text-white">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-[#D6C48A]">
                {isClient ? new Date(row.date_claimed).toLocaleDateString("fr-FR") : row.date_claimed}
                <span className="ml-2 font-semibold text-gray-300">-&nbsp;&nbsp;{row.activity_name}</span>
              </span>
              <span className="font-semibold text-gray-300">{row.user_name}</span>
            </div>
            <div className="flex justify-between text-gray-300 mb-1">
              <span>Effort : {Math.min(Math.round((row.defit_amount / row.max_defits) * 100), 100)} %</span>
            </div>
            {showGains && (
              <div className="flex justify-between text-gray-400 mb-1">
                <span>Defits : {((row.defit_amount * row.participation_percentage * defitPrice) / 100).toFixed(2)} $ ({row.defit_amount})</span>
              </div>
            )}
            <div className="text-gray-300 mb-1">
              <span>Boost : {Number(row.boost).toFixed(2)} $</span>
            </div>
            <div className="flex justify-end font-semibold border-t border-white/20 pt-2 mt-1">
              <span>Total : {(
                Number(row.boost) +
                (showGains ? (row.defit_amount * row.participation_percentage * defitPrice) / 100 : 0)
              ).toFixed(2)} $</span>
            </div>
          </div>
        ))}

        {/* PAGINATION mobile */}
        <div className="flex justify-center items-center gap-2 flex-wrap">
          <button onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20">←</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => handlePageChange(i + 1)} className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-[#D6C48A] text-[#2A2550]" : "bg-white/10 text-white hover:bg-white/20"}`}>{i + 1}</button>
          ))}
          <button onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))} className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20">→</button>
        </div>
      </div>

      {/* TABLE — desktop uniquement */}
      <div className="hidden md:block bg-[#5C42A6] rounded-2xl shadow-lg p-6 mb-6 w-full overflow-x-auto">
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Athlete</th>
              <th className="py-3 px-4">Activité</th>
              <th className="py-3 px-4">Effort</th>

              {showGains && (
                <>
                  <th className="py-3 px-4">Gain brut (Defit)</th>
                  <th className="py-3 px-4">Gain net Defit ($)</th>
                </>
              )}

              <th className="py-3 px-4">Boost ($)</th>
              <th className="py-3 px-4">Total ($)</th>
            </tr>
          </thead>

          <tbody className="text-gray-200">
            {currentRows.map((row) => (
              <tr key={row.id} className="hover:bg-white/10 transition-colors border-b border-white/20">
                <td className="text-white py-3 px-4">
                  {isClient ? new Date(row.date_claimed).toLocaleDateString("fr-FR") : row.date_claimed}
                </td>
                <td className="text-white py-3 px-4">{row.user_name}</td>
                <td className="text-white py-3 px-4">{row.activity_name}</td>
                <td className="text-white py-3 px-4">
                  {Math.min(Math.round((row.defit_amount / row.max_defits) * 100), 100)} %
                </td>

                {showGains && (
                  <>
                    <td className="text-gray-400 py-3 px-4">{row.defit_amount}</td>
                    <td className="text-gray-400 py-3 px-4">
                      {((row.defit_amount * row.participation_percentage * defitPrice) / 100).toFixed(2)}
                    </td>
                  </>
                )}

                <td className="text-white py-3 px-4">{Number(row.boost).toFixed(2)}</td>
                <td className="text-white py-3 px-4">{Number(row.boost).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION desktop */}
        <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
          <button onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20">←</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => handlePageChange(i + 1)} className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-[#D6C48A] text-[#2A2550]" : "bg-white/10 text-white hover:bg-white/20"}`}>{i + 1}</button>
          ))}
          <button onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))} className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20">→</button>
        </div>
      </div>
    </main>
  );
}