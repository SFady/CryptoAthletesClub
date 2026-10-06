"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useBackToMain } from "../useBackToMain";

const USER_ID_MAP = { usopp: "1", dteach: "2", nicor: "3", jinbe: "4" };

const inputCls = "flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm";

function authHeader() {
  try {
    const { token } = JSON.parse(localStorage.getItem("auth_session") ?? "{}");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch { return {}; }
}

export default function Profil() {
  const goBack = useBackToMain();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [stravaConnected, setStravaConnected] = useState(false);
  const [stravaStatus, setStravaStatus] = useState(null);
  const [activities, setActivities] = useState(null);
  const [loadingAct, setLoadingAct] = useState(false);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [credSaved, setCredSaved] = useState(false);
  const [stravaStartDate, setStravaStartDate] = useState("");
  const [startDateSaved, setStartDateSaved] = useState(false);
  const [managedUserId, setManagedUserId] = useState(null);

  const loadProfile = (id) => {
    if (!id) return;
    fetch(`/api/profil?id=${id}`, { headers: authHeader() })
      .then(r => r.json())
      .then(d => {
        setEmail(d.email ?? "");
        const connected = !!d.stravaConnected;
        setStravaConnected(connected);
        if (!connected) setStravaStatus(null);
        setClientId(d.stravaClientId ?? "");
        setStravaStartDate(d.stravaStartDate ?? "");
        setActivities(null);
      });
  };

  useEffect(() => {
    const s = searchParams.get("strava");
    if (s === "ok")    setStravaStatus("ok");
    if (s === "error") setStravaStatus("error");

    try {
      const { user } = JSON.parse(localStorage.getItem("auth_session") ?? "{}");
      const id = USER_ID_MAP[user];
      setUserId(id);
      setManagedUserId(id);
      setCurrentUser(user ?? null);
      loadProfile(id);
    } catch { /* ignore */ }
  }, []);

  const switchUser = (id) => {
    setManagedUserId(id);
    setStravaStatus(null);
    loadProfile(id);
  };

  const activeId = managedUserId;

  const handleSave = async () => {
    if (!activeId) return;
    await fetch("/api/profil", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({ id: activeId, email }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveCreds = async () => {
    if (!activeId || !clientId || !clientSecret) return;
    await fetch("/api/profil", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({ id: activeId, stravaClientId: clientId, stravaClientSecret: clientSecret }),
    });
    setCredSaved(true);
    setTimeout(() => setCredSaved(false), 2000);
  };

  const handleSaveStartDate = async () => {
    if (!activeId) return;
    await fetch("/api/profil", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({ id: activeId, stravaStartDate }),
    });
    setStartDateSaved(true);
    setTimeout(() => setStartDateSaved(false), 2000);
  };

  const [oauthLink, setOauthLink] = useState(null);

  const handleConnect = async () => {
    const res = await fetch(`/api/strava/auth?userId=${activeId}`);
    const { link } = await res.json();
    if (!link) return;
    if (currentUser === 'usopp' && managedUserId !== userId) {
      setOauthLink(link);
    } else {
      window.location.href = link;
    }
  };

  return (
    <main className="flex flex-col items-start min-h-[60vh] text-white px-6 py-6">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={goBack} className="text-gray-300 hover:text-white transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      {currentUser === 'usopp' && (
        <div className="w-full max-w-sm mb-4 flex items-center gap-2">
          <label className="text-sm text-gray-400 whitespace-nowrap">Manage user :</label>
          <select
            value={managedUserId ?? ""}
            onChange={e => switchUser(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            {Object.entries(USER_ID_MAP).map(([name, id]) => (
              <option key={id} value={id} className="bg-[#1a0533] text-white">{name} (id {id})</option>
            ))}
          </select>
        </div>
      )}

      <div className="w-full max-w-sm flex flex-col gap-4">

        {/* Email — usopp uniquement */}
        {currentUser === 'usopp' && (
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">&nbsp;Email address</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setSaved(false); }}
                placeholder="example@mail.com"
                className={inputCls}
              />
              <button
                onClick={handleSave}
                className="flex-shrink-0 bg-white text-[#5f3dc4] font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                {saved ? "✓" : "Save"}
              </button>
            </div>
          </div>
        )}

        {/* Strava */}
        <div className="relative flex flex-col gap-3">
          {currentUser === 'justtosee' && (
            <div className="absolute inset-0 z-10 rounded-xl backdrop-blur-[1px] bg-black/30 flex items-center justify-center">
              <span className="text-xs text-gray-400 bg-black/60 px-3 py-1.5 rounded-lg">Strava not available</span>
            </div>
          )}
          {/* <label className="text-sm text-gray-300">&nbsp;Strava</label> */}

          {/* Étape 1 : credentials */}
          {currentUser === 'usopp' && (
            <div className="flex flex-col gap-2 bg-white/5 rounded-xl p-3">
              <p className="text-xs text-gray-400">
                1. Create an app at <span className="text-white">strava.com/settings/api</span><br/>
                2. Paste your Client ID and Client Secret below
              </p>
              <input
                type="text"
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                placeholder="Client ID"
                className={inputCls}
              />
              <div className="flex gap-2">
                <input
                  type="password"
                  value={clientSecret}
                  onChange={e => setClientSecret(e.target.value)}
                  placeholder="Client Secret"
                  className={inputCls}
                />
                <button
                  onClick={handleSaveCreds}
                  disabled={!clientId || !clientSecret}
                  className="flex-shrink-0 bg-white text-[#5f3dc4] font-semibold px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-40"
                >
                  {credSaved ? "✓" : "Save"}
                </button>
              </div>
            </div>
          )}

          {/* Étape 2 : connexion OAuth */}
          <div className="flex items-center gap-2">
            <button
              disabled={!activeId}
              onClick={handleConnect}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white text-sm transition-colors whitespace-nowrap
                ${activeId ? "bg-[#FC4C02] hover:bg-[#e04402]" : "bg-[#FC4C02]/40 cursor-not-allowed"}`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M15.387 3.612a5.386 5.386 0 0 0-3.387 1.19V3.5a.5.5 0 0 0-1 0v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-2.53a4.387 4.387 0 1 1-1.47 3.25.5.5 0 0 0-1 0 5.387 5.387 0 1 0 4.887-6.638z"/>
              </svg>
              {stravaConnected ? "Reconnect Strava" : "Connect Strava"}
            </button>
            {stravaStatus === "ok"    && <span className="text-emerald-400 text-sm">✓ Connected</span>}
            {stravaStatus === "error" && <span className="text-rose-400 text-sm">Error</span>}
            {stravaConnected && !stravaStatus && <span className="text-emerald-400 text-sm">✓ Active</span>}
          </div>
          {oauthLink && (
            <div className="flex flex-col gap-1 bg-white/5 rounded-xl p-3">
              <p className="text-xs text-gray-400">Send this link to the user — they need to open it in a browser logged into their own Strava account:</p>
              <div className="flex gap-2 items-center">
                <input readOnly value={oauthLink} className={inputCls + " text-xs"} onClick={e => e.target.select()} />
                <button
                  onClick={() => { navigator.clipboard.writeText(oauthLink); }}
                  className="flex-shrink-0 bg-white text-[#5f3dc4] font-semibold px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-xs whitespace-nowrap"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
          {stravaConnected && (
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  await fetch("/api/strava/disconnect", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: activeId }),
                  });
                  setStravaConnected(false);
                  setStravaStatus(null);
                  setActivities(null);
                }}
                className="text-rose-400 hover:text-rose-300 text-sm transition-colors whitespace-nowrap"
              >
                Disconnect
              </button>
            </div>
          )}

          {/* Date de début Strava + View raw — usopp uniquement */}
          {currentUser === 'usopp' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={stravaStartDate}
                onChange={e => setStravaStartDate(e.target.value)}
                className={inputCls + " flex-1"}
              />
              <button
                onClick={handleSaveStartDate}
                disabled={!activeId}
                className="flex-shrink-0 bg-white text-[#5f3dc4] font-semibold px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-40"
              >
                {startDateSaved ? "✓" : "Start date"}
              </button>
            </div>
          )}

          {stravaConnected && currentUser === 'usopp' && (
            <div className="mt-1">
              <button
                onClick={async () => {
                  setLoadingAct(true);
                  const res = await fetch(`/api/strava/activities?userId=${activeId}`);
                  const data = await res.json();
                  setActivities(Array.isArray(data) ? data.filter(a => ["Run","Walk","Ride","Swim"].includes(a.sport_type)) : data);
                  setLoadingAct(false);
                }}
                className="text-sm text-gray-300 hover:text-white underline transition-colors"
              >
                {loadingAct ? "Loading…" : "View raw activities"}
              </button>
              {activities && (
                <pre className="mt-3 text-xs bg-black/40 text-green-300 rounded-lg p-3 overflow-auto max-h-96 w-full">
                  {JSON.stringify(activities, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>


      </div>
    </main>
  );
}
