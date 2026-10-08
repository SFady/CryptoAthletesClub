"use client";

import { useEffect, useRef, useState } from "react";
import { useDefitPrice } from "../api/useDefitPrice/useDefitPrice";
import { FaRunning, FaSwimmer, FaBiking, FaWalking, FaStar } from "react-icons/fa";

function fmtDuration(seconds) {
  const s = Number(seconds) || 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

function fmtDate(val) {
  const d = new Date(val);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function authHeader() {
  try {
    const { token } = JSON.parse(localStorage.getItem("auth_session") ?? "{}");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch { return {}; }
}

export default function Home() {
  const [rows, setRows] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const { price: defitPrice } = useDefitPrice();
  const [selected, setSelected] = useState("0");

  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const selectedRef = useRef("0");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const rowsPerPage = 50;
  const sentinelRef = useRef(null);

  const [showGains, setShowGains] = useState(false);
  const [defitsEnabled, setDefitsEnabled] = useState(false);

  const loadActivities = async (userId, pageNum, reset = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await fetch(`/api/get-users-activities?userId=${userId}&page=${pageNum}&limit=${rowsPerPage}`, { headers: authHeader() });
      const data = await res.json();
      setRows(prev => {
        if (reset) return data.result;
        const ids = new Set(prev.map(r => r.id));
        return [...prev, ...data.result.filter(r => !ids.has(r.id))];
      });
      const more = data.result.length === rowsPerPage;
      hasMoreRef.current = more;
      setHasMore(more);
    } catch (err) {
      console.error("Failed to load activities:", err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    loadActivities("0", 1, true);
    fetch('/api/app-config?key=show_defits', { headers: authHeader() }).then(r => r.json()).then(d => setDefitsEnabled(d.value === 'true')).catch(() => {});
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current && !loadingRef.current) {
          pageRef.current += 1;
          loadActivities(selectedRef.current, pageRef.current);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const handleSelect = (e) => {
    const id = e.target.value;
    setSelected(id);
    selectedRef.current = id;
    pageRef.current = 1;
    hasMoreRef.current = true;
    setHasMore(true);
    loadActivities(id, 1, true);
  };

  const currentRows = rows;

  const pace = (duration, km, activityName) => {
    if (!duration || Number(duration) === 0 || !km || Number(km) === 0) return null;
    const key = (activityName || "").toLowerCase();
    const isSwim = key === "swim" || key === "natation";
    const isBike = key === "bike" || key === "cyclisme";
    if (isSwim) {
      const secPer100m = Number(duration) / (Number(km) * 10);
      const min = Math.floor(secPer100m / 60);
      const sec = Math.round(secPer100m % 60);
      return `${min}'${String(sec).padStart(2, "0")}"/100m`;
    }
    if (isBike) {
      const kmh = (Number(km) / Number(duration)) * 3600;
      return `${kmh.toFixed(1)} km/h`;
    }
    const secPerKm = Number(duration) / Number(km);
    const min = Math.floor(secPerKm / 60);
    const sec = Math.round(secPerKm % 60);
    return `${min}'${String(sec).padStart(2, "0")}"/km`;
  };

  const ActivityIcon = ({ name }) => {
    const key = (name || "").toLowerCase();
    const pill = "inline-flex items-center justify-center rounded-full border w-9 py-0.5";

    if (key === "run" || key === "running")   return (
      <span title="Running" className={`${pill} bg-orange-400/20 border-orange-400/30`}>
        <span className="inline-flex items-center gap-0.5">
          <span className="flex flex-col gap-0.5">
            <span className="block h-px w-1 bg-orange-400/60 rounded-full" />
            <span className="block h-px w-0.5 bg-orange-400/40 rounded-full" />
            <span className="block h-px w-1 bg-orange-400/60 rounded-full" />
          </span>
          <FaRunning className="text-orange-400 text-sm" />
        </span>
      </span>
    );
    if (key === "swim" || key === "natation") return <span title="Swimming" className={`${pill} bg-cyan-500/20 border-cyan-500/30`}><FaSwimmer className="text-cyan-400 text-sm scale-x-[-1]" /></span>;
    if (key === "bike" || key === "cyclisme") return <span title="Cycling" className={`${pill} bg-green-500/20 border-green-500/30`}><FaBiking className="text-green-400 text-sm" /></span>;
    if (key === "marche" || key === "walk")   return <span title="Walking" className={`${pill} bg-blue-500/20 border-blue-500/30`}><FaWalking className="text-blue-400 text-sm" /></span>;
    if (key.includes("bonus"))                return <span title={name} className={`${pill} bg-[#D6C48A]/20 border-[#D6C48A]/30`}><FaStar className="text-[#D6C48A] text-sm" /></span>;
    return <span className="text-gray-200 text-sm">{name}</span>;
  };

  return (
    <main className="flex flex-col justify-start w-full max-w-[100vw] md:max-w-[1600px] mx-auto px-6 md:px-16 pt-6 pb-6 min-h-[calc(100vh-96px)] overflow-x-hidden overflow-y-auto">

      {/* FILTER + TOGGLE */}
      <div className="mb-5 flex items-center justify-between gap-4 flex-wrap">
        <select
          value={selected}
          onChange={handleSelect}
          className="bg-white/10 text-white px-3 py-2 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D6C48A]/40 text-sm"
        >
          <option value="0" className="bg-[#3b2d8a]">All</option>
          <option value="1" className="bg-[#3b2d8a]">Usopp</option>
          <option value="3" className="bg-[#3b2d8a]">Nico Robin</option>
          <option value="2" className="bg-[#3b2d8a]">DTeach</option>
          <option value="4" className="bg-[#3b2d8a]">Jinbe</option>
        </select>

        {defitsEnabled && (
          <div
            className="flex items-center gap-2 text-white text-sm cursor-pointer select-none"
            onClick={() => setShowGains(!showGains)}
          >
            <div className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${showGains ? "bg-[#D6C48A]" : "bg-white/20"}`}>
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${showGains ? "translate-x-5" : "translate-x-0"}`} />
            </div>
            Show Defits&nbsp;
          </div>
        )}
      </div>

      {/* CARDS — mobile uniquement */}
      <div className="flex flex-col gap-5 mb-6 w-full md:hidden">
        {currentRows.map((row, idx) => {
          const effort = Math.min(Math.round((row.defit_amount / row.max_defits) * 10000), 10000);
          const gainDefit = (defitsEnabled && showGains) ? (row.defit_amount * row.participation_percentage * defitPrice) / 100 : 0;
          return (
            <div key={row.id} className={`rounded-2xl shadow-lg px-4 py-3 text-white border border-white/10 ${idx % 2 === 0 ? "bg-[#5C42A6]" : "bg-[#4e3899]"}`}>
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <ActivityIcon name={row.activity_name} />
                <span className="font-bold text-[#D6C48A]">
                  {isClient ? fmtDate(row.date_claimed) : row.date_claimed}
                </span>
                <span className="text-white font-semibold">— {row.user_name}</span>
              </div>
              {/* Bulles */}
              <div className="flex flex-col gap-1.5 mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex-1 text-xs px-2.5 py-0.5 rounded-full bg-purple-400/20 text-white border border-purple-400/30 flex justify-between">
                    <span className="opacity-70 font-normal">Distance</span>
                    <span className="font-semibold">{Number(row.kilometers ?? 0).toFixed(2)} km</span>
                  </span>
                  <span className="flex-1 text-xs px-2.5 py-0.5 rounded-full bg-purple-400/20 text-white border border-purple-400/30 flex justify-between">
                    <span className="opacity-70 font-normal">Speed</span>
                    <span className="font-semibold">{pace(row.duration, row.kilometers, row.activity_name) ?? "—"}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex-1 text-xs px-2.5 py-0.5 rounded-full bg-purple-400/20 text-white border border-purple-400/30 flex justify-between">
                    <span className="opacity-70 font-normal">Time</span>
                    <span className="font-semibold">{fmtDuration(row.duration)}</span>
                  </span>
                  <span className="flex-1 text-xs px-2.5 py-0.5 rounded-full bg-purple-400/20 text-white border border-purple-400/30 flex justify-between">
                    <span className="opacity-70 font-normal">Score</span>
                    <span className="font-semibold">{(row.activity_name || "").toLowerCase().includes("bonus") ? <span className="text-white/30">—</span> : effort}</span>
                  </span>
                </div>
                {defitsEnabled && showGains && (
                  <span className="w-full text-xs px-2.5 py-0.5 rounded-full bg-purple-400/20 text-white border border-purple-400/30 flex justify-between">
                    <span className="opacity-70 font-normal">Defits</span>
                    <span className="font-semibold">{((row.defit_amount * row.participation_percentage * defitPrice) / 100).toFixed(2)} $ ({row.defit_amount})</span>
                  </span>
                )}
              </div>
              {/* Reward */}
              <div className="border-t border-white/10 pt-2 mt-1">
                <span className="w-full text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 text-white flex justify-between">
                  <span className="font-normal">REWARD ($)</span>
                  <span className="font-semibold">{(Number(row.boost) + gainDefit).toFixed(2)} $</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* TABLE — desktop uniquement */}
      <div className="hidden md:block rounded-2xl shadow-xl overflow-hidden mb-6 w-full border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 text-white text-xs uppercase tracking-wide">
                <th className="py-3.5 px-5 font-semibold">Date</th>
                <th className="py-3.5 px-5 font-semibold">Athlete</th>
                <th className="py-3.5 px-5 font-semibold text-center">Activity</th>
                <th className="py-3.5 px-5 font-semibold">Score</th>
                <th className="py-3.5 px-5 font-semibold">Distance (km)</th>
                <th className="py-3.5 px-5 font-semibold">Speed</th>
                {defitsEnabled && showGains && (
                  <>
                    <th className="py-3.5 px-5 font-semibold">Gross gain (Defit)</th>
                    <th className="py-3.5 px-5 font-semibold">Net Defit gain ($)</th>
                  </>
                )}
                <th className="py-3.5 px-5 font-semibold">REWARD ($)</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, idx) => {
                const effort = Math.min(Math.round((row.defit_amount / row.max_defits) * 10000), 10000);
                const gainDefit = (defitsEnabled && showGains) ? (row.defit_amount * row.participation_percentage * defitPrice) / 100 : 0;
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-white/10 transition-colors hover:bg-white/10 text-sm ${idx % 2 === 0 ? "bg-[#5C42A6]" : "bg-[#4e3899]"}`}
                  >
                    <td className="py-4 px-5 text-[#D6C48A] font-semibold whitespace-nowrap tracking-wide">
                      {isClient ? fmtDate(row.date_claimed) : row.date_claimed}
                    </td>
                    <td className="py-4 px-5 text-white font-semibold whitespace-nowrap">{row.user_name}</td>
                    <td className="py-4 px-5"><div className="flex justify-center"><ActivityIcon name={row.activity_name} /></div></td>
                    <td className="py-4 px-5 text-gray-200">
                      {(row.activity_name || "").toLowerCase().includes("bonus") ? <span className="text-white/30">—</span> : effort}
                    </td>
                    <td className="py-4 px-5 text-gray-200">{Number(row.kilometers ?? 0).toFixed(2)}</td>
                    <td className="py-4 px-5 text-gray-200 whitespace-nowrap">
                      {pace(row.duration, row.kilometers, row.activity_name) ?? <span className="text-white/30">—</span>}
                    </td>
                    {defitsEnabled && showGains && (
                      <>
                        <td className="py-4 px-5 text-gray-200">{row.defit_amount}</td>
                        <td className="py-4 px-5 text-gray-200">
                          {((row.defit_amount * row.participation_percentage * defitPrice) / 100).toFixed(2)}
                        </td>
                      </>
                    )}
                    <td className="py-4 px-5 text-[#D6C48A] font-bold">{(Number(row.boost) + gainDefit).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div ref={sentinelRef} className="py-4 text-center text-white/40 text-sm">
        {loading ? "Loading..." : !hasMore ? "End of activities" : ""}
      </div>
    </main>
  );
}
