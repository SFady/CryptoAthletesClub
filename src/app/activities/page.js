"use client";

import { useEffect, useState } from "react";
import { useDefitPrice } from "../api/useDefitPrice/useDefitPrice";

export default function Home() {
  const [rows, setRows] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const { price: defitPrice, error } = useDefitPrice();
  const [selected, setSelected] = useState("0");

  useEffect(() => {
    setIsClient(true);
    loadActivities(0); // load all activities at start
  }, []);

  const loadActivities = async (userId) => {
    try {
      const res = await fetch(`/api/get-users-activities?userId=${userId}`);
      const data = await res.json();
      setRows(data.result);
    } catch (err) {
      console.error("❌ Failed to load activities:", err);
    }
  };

  const handleSelect = (e) => {
    const id = e.target.value;
    setSelected(id);
    loadActivities(id); // call API when selection changes
  };

  return (
    <main className="flex flex-col justify-start w-full max-w-screen-xl mx-auto px-6 md:px-16 pt-6 pb-6 md:pt-0 md:pb-0 min-h-[calc(100vh-96px)] md:min-h-auto overflow-y-auto">

      <div className="mb-4 self-start">
        <select
          value={selected}
          onChange={handleSelect}
          className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 md:px-4 md:py-2 md:text-base"
        >
          <option value="0" className="bg-[#8d6bf2] text-[#f3f0ff]">Tous</option>
          <option value="1" className="bg-[#8d6bf2] text-[#f3f0ff]">Usopp</option>
          <option value="3" className="bg-[#8d6bf2] text-[#f3f0ff]">Nico Robin</option>
          <option value="2" className="bg-[#8d6bf2] text-[#f3f0ff]">DTeach</option>
          <option value="4" className="bg-[#8d6bf2] text-[#f3f0ff]">Jinbe</option>
        </select>
      </div>

      <div className="bg-[#5C42A6] rounded-2xl shadow-lg p-6 mb-6 w-full overflow-x-auto">
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Athlete</th>
              <th className="py-3 px-4">Activité</th>
              <th className="py-3 px-4">Gain brut (Defit)</th>
              <th className="py-3 px-4">Gain net Defit ($)</th>
              <th className="py-3 px-4">Boost ($)</th>
              <th className="py-3 px-4">Total ($)</th>
            </tr>
          </thead>
          <tbody className="text-gray-200">
            {rows.map((row, idx) => {
              const rowClass = `hover:bg-white/10 transition-colors ${idx % 2 === 0 ? "bg-[#5C42A6]/80" : "bg-[#5C42A6]/80"} border-b border-white/20`;
              return (
                <tr key={row.id} className={rowClass}>
                  <td className="text-white py-3 px-4">
                    {isClient ? new Date(row.date_claimed).toLocaleDateString("fr-FR") : row.date_claimed}
                  </td>
                  <td className="text-white py-3 px-4">{row.user_name}</td>
                  <td className="text-white py-3 px-4">{row.activity_name}</td>
                  <td className="text-white py-3 px-4">{row.defit_amount}</td>
                  <td className="text-white py-3 px-4">{(row.defit_amount * row.participation_percentage * defitPrice / 100).toFixed(2)}</td>
                  <td className="text-white py-3 px-4">{Number(row.boost).toFixed(2)}</td>
                  <td className="text-white py-3 px-4">{(Number(row.boost)+(row.defit_amount * row.participation_percentage * defitPrice / 100)).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
