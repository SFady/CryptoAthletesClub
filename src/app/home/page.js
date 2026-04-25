"use client";


import { useEffect, useState } from "react";
import { useDefitPrice } from "../api/useDefitPrice/useDefitPrice";
import { FaRunning, FaWalking } from "react-icons/fa";

export default function Home() {

  const [defitAmount, setDefitAmount] = useState(0);
  const [dollarAmount, setDollarAmount] = useState(0);
  const [user_liquidity, setUserLiquidity] = useState(0);

  const USER_ID_MAP = { usopp: "1", dteach: "2", nicor: "3", jinbe: "4" };

  const [selected, setSelected] = useState("1");

  const { price: defitPrice } = useDefitPrice();

  const [open, setOpen] = useState(false);
  const [boostMax, setBoostMax] = useState(null);
  const [stravaConnected, setStravaConnected] = useState(false);
  const [stravaActivities, setStravaActivities] = useState(null);
  const [stravaPopup, setStravaPopup] = useState(false);
  const [dbDates, setDbDates] = useState(new Set());

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
    let finalId = localStorage.getItem("selectedAthlete");
    if (!finalId) {
      try {
        const raw = localStorage.getItem("auth_session");
        if (raw) {
          const { user } = JSON.parse(raw);
          finalId = USER_ID_MAP[user] ?? "1";
        }
      } catch { /* ignore */ }
    }
    finalId = finalId ?? "1";

    setSelected(finalId);
    localStorage.setItem("selectedAthlete", finalId);
    fetchDefitAmount(finalId);
    fetchBoostMax(finalId);

    try {
      const { user } = JSON.parse(localStorage.getItem("auth_session") ?? "{}");
      const userId = USER_ID_MAP[user];
      if (userId) {
        fetch(`/api/profil?id=${userId}`)
          .then(r => r.json())
          .then(d => setStravaConnected(!!d.stravaConnected));
      }
    } catch { /* ignore */ }
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


  const activityIcon = {
    Run: (
      <span className="inline-flex items-center gap-0.5">
        <span className="flex flex-col gap-0.5">
          <span className="block h-px w-1.5 bg-white/60 rounded-full" />
          <span className="block h-px w-1 bg-white/40 rounded-full" />
          <span className="block h-px w-1.5 bg-white/60 rounded-full" />
        </span>
        <FaRunning className="text-white/80 text-lg" />
      </span>
    ),
    Walk: <FaWalking className="text-white/80 text-lg" />,
  };

  return (
    <main className="relative w-full max-w-[1600px] mx-auto px-6 md:px-16 flex flex-col justify-center min-h-[calc(100svh-144px)] md:min-h-[calc(100vh-96px)] md:justify-start md:pt-0 md:pb-0">

      {/* Popup activités Strava */}
      {stravaPopup && stravaActivities && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={() => setStravaPopup(false)}>
          <div className="bg-[#2a1a6e] border border-white/20 rounded-2xl shadow-2xl p-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="#FC4C02" className="w-5 h-5">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.169"/>
                </svg>
                Activités récentes
              </h2>
              <button onClick={() => setStravaPopup(false)} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
            </div>
            {stravaActivities.length === 0 ? (
              <p className="text-gray-400 text-sm text-center">Aucune activité cette semaine</p>
            ) : (
              <ul className="flex flex-col gap-2 overflow-y-auto max-h-[55vh]">
                {stravaActivities.filter(a => a.sport_type === "Run" || a.sport_type === "Walk").sort((a, b) => new Date(b.start_date) - new Date(a.start_date)).map(a => {
                  const dateKey = a.start_date_local.slice(0, 10);
                  const timeKey = a.start_date_local.slice(11, 19).replace(/:/g, "");
                  const km = Math.round((a.distance / 1000) * 10);
                  const alreadyIn = dbDates.has(`${dateKey}_${timeKey}_${a.sport_type}_${km}`);
                  return (
                  <li key={a.id} className={`flex items-center justify-between rounded-xl px-4 py-2.5 ${alreadyIn ? "bg-white/[0.02] opacity-40" : "bg-white/5"}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 flex justify-center flex-shrink-0">{activityIcon[a.sport_type]}</div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">
                          {new Date(a.start_date_local).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                          {" · "}
                          {new Date(a.start_date_local).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#FF8C5A] font-bold text-sm">{(a.distance / 1000).toFixed(2)} km</span>
                      <a href={`https://www.strava.com/activities/${a.id}`} target="_blank" rel="noopener noreferrer"
                        className="ml-2 text-white/60 hover:text-white transition-colors border border-white/30 hover:border-white/60 rounded p-1">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                      </a>
                    </div>
                  </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Sélecteur d’athlète centré au-dessus de l’image */}
      <div className="relative w-full max-w-sm md:max-w-[550px] mx-auto flex justify-center items-end gap-3 mb-2 mt-1 md:mt-10">
        <button
          disabled={!stravaConnected}
          onClick={async () => {
            if (!stravaConnected) return;
            try {
              const { user } = JSON.parse(localStorage.getItem("auth_session") ?? "{}");
              const userId = { usopp: "1", dteach: "2", nicor: "3", jinbe: "4" }[user];
              if (!userId) return;
              const [stravaRes, dbRes] = await Promise.all([
                fetch(`/api/strava/activities?userId=${userId}`),
                fetch(`/api/get-users-activities?userId=${userId}&limit=100`),
              ]);
              const stravaData = await stravaRes.json();
              const dbData = await dbRes.json();
              const dbEntries = new Set(
                (dbData.result ?? []).map(a => {
                  const raw = String(a.date_claimed);
                  const date = raw.slice(0, 10);
                  const time = raw.slice(11, 19).replace(/:/g, "");
                  const type = a.activity_name?.toLowerCase().includes("run") ? "Run" : "Walk";
                  const km = Math.round(Number(a.kilometers) * 10);
                  return `${date}_${time}_${type}_${km}`;
                })
              );
              setDbDates(dbEntries);
              setStravaActivities(stravaData);
              setStravaPopup(true);
            } catch { /* ignore */ }
          }}
          title="Récupérer activités Strava"
          className={`absolute left-2 inset-y-0 my-auto h-fit flex items-center gap-0.5 transition-all rounded-lg border p-1
            ${stravaConnected
              ? "text-[#FC4C02] border-white/20 hover:border-[#FC4C02]/60 bg-white/5 hover:bg-white/10 cursor-pointer"
              : "text-[#FC4C02]/30 border-white/10 bg-white/5 cursor-not-allowed"}`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.169"/>
          </svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} className="w-6 h-6 -ml-2 text-white/60">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
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
        <div className="relative flex-shrink-0" style={{ width: 200 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selected === "1" ? "/images/runner_init3.png" : selected === "4" ? "/images/runner_init1.png" : selected === "2" ? "/images/runner_init4.png" : "/images/runner_init2.png"}
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
              { x: 122, y: 32, tx: 212, ty: 86 },
              { x: 122, y: 100, tx: 212, ty: 110 },
              { x: 156, y: 158, tx: 212, ty: 134 },
              { x: 122, y: 180, tx: 212, ty: 158 },
              { x: 127, y: 252, tx: 212, ty: 182 },
              { x: 143, y: 273, tx: 212, ty: 206 },
            ].map(({ x, y, tx, ty }, i) => (
              <g key={i}>
                <line x1={x} y1={y} x2={tx} y2={ty} stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3,2" />
                <circle cx={x} cy={y} r="2.5" fill="rgba(255,255,255,0.7)" />
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
