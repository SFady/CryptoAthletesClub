"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBackToMain } from "../useBackToMain";

const Card = ({ icon, title, subtitle, action, children }) => (
  <div className="rounded-2xl overflow-hidden shadow-lg border border-white/10">
    <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 py-3 px-5 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="text-lg flex-shrink-0">{icon}</span>
        <div className="flex flex-col">
          <h2 className="text-white text-sm font-bold uppercase tracking-widest">{title}</h2>
          {subtitle && <span className="text-white/70 text-xs">{subtitle}</span>}
        </div>
      </div>
      {action}
    </div>
    <div className="bg-white/[0.05] backdrop-blur-md">{children}</div>
  </div>
);

const Row = ({ label, value, gold, zebra }) => (
  <tr className={`border-b border-white/10 text-sm ${zebra ? "bg-white/[0.03]" : "bg-transparent"}`}>
    <td className="py-2.5 px-5 text-gray-300">{label}</td>
    <td className={`py-2.5 px-5 text-right font-semibold whitespace-nowrap ${gold ? "text-[#D6C48A] font-bold" : "text-white"}`}>{value}</td>
  </tr>
);

const SubHeader = ({ children }) => (
  <tr className="border-b border-white/10">
    <td colSpan={2} className="py-1.5 px-5 text-white/40 text-xs uppercase tracking-wide bg-white/[0.03]">{children}</td>
  </tr>
);

function authHeader() {
  try {
    const { token } = JSON.parse(localStorage.getItem("auth_session") ?? "{}");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch { return {}; }
}

export default function Position() {
  const router = useRouter();
  const goBack = useBackToMain();
  const [wallet, setWallet]         = useState(null);
  const [clm, setClm]               = useState(null);
  const [clmLoading, setClmLoading] = useState(true);
  const [distrib, setDistrib]       = useState(null);
  const [boostPending, setBoostPending] = useState(0);
  const [showGains, setShowGains] = useState(false);
  const [users, setUsers]               = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [lastBoost, setLastBoost]       = useState("");
  const [lastBonus, setLastBonus]       = useState("");
  const [lastBonus2, setLastBonus2]     = useState("");
  const [lastBonus3, setLastBonus3]     = useState("");
  const [lastBenef, setLastBenef]       = useState("");
  const [activityId, setActivityId]     = useState(null);
  const [sending, setSending]           = useState(false);
  const [sendResult, setSendResult]     = useState(null);
  const [confirming, setConfirming]     = useState(false);
  const [countdown, setCountdown]       = useState(3);
  const confirmTimer = useRef(null);
  const savedScrollY = useRef(0);

  useEffect(() => {
    if (!confirming) return;
    setCountdown(3);
    let n = 3;
    confirmTimer.current = setInterval(() => {
      n -= 1;
      setCountdown(n);
      if (n <= 0) {
        clearInterval(confirmTimer.current);
        setConfirming(false);
      }
    }, 1000);
    return () => clearInterval(confirmTimer.current);
  }, [confirming]);

  const handleUserChange = (userId) => {
    const user = users.find(u => u.id === Number(userId));
    setSelectedUser(user ?? null);
    setLastBoost("");
    setLastBonus("");
    setLastBenef("");
    setActivityId(null);
    setSendResult(null);
    const y = savedScrollY.current;
    requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" })));
    if (!userId) return;
    fetch(`/api/get-last-boost?userId=${userId}`, { headers: authHeader() })
      .then(r => r.json())
      .then(d => { setLastBoost(d.boost ?? ""); setLastBonus(d.bonus ?? ""); setLastBonus2(d.bonus2 ?? ""); setLastBonus3(d.bonus3 ?? ""); setLastBenef(d.benef ?? ""); setActivityId(d.activityId ?? null); })
      .catch(() => {});
  };

  const handleSend = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    clearInterval(confirmTimer.current);
    setConfirming(false);

    const boost  = Number(lastBoost);
    const bonus  = Number(lastBonus);
    const bonus2 = Number(lastBonus2);
    const bonus3 = Number(lastBonus3);
    const benef  = Number(lastBenef);
    if (boost <= 0 && bonus <= 0 && benef <= 0 && bonus2 <= 0 && bonus3 <= 0) {
      setSendResult({ error: "Montants invalides" });
      return;
    }

    setSending(true);
    setSendResult(null);
    try {
      const safeJson = async (r) => {
        const text = await r.text();
        try { return JSON.parse(text); } catch { return { error: text.slice(0, 120) }; }
      };

      // Toujours récupérer le dernier activityId avant d'envoyer
      const freshId = await fetch(`/api/get-last-boost?userId=${selectedUser.id}`, { headers: authHeader() })
        .then(r => r.json()).then(d => d.activityId).catch(() => activityId);
      if (freshId) setActivityId(freshId);
      const currentActivityId = freshId ?? activityId;

      const res  = await fetch("/api/transfer-boost", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({
          userId:      selectedUser.id,
          activityId:  currentActivityId,
          boostAmount: boost,
          bonusAmount: bonus,
          benefAmount: benef,
        }),
      });
      const data = await safeJson(res);

      const bonusRes  = await fetch("/api/send-bonus", { method: "POST", headers: { "Content-Type": "application/json", ...authHeader() }, body: JSON.stringify({ activityId: currentActivityId, minNonce: data.nextNonce ?? undefined }) });
      const bonusData = await safeJson(bonusRes);
      const bonusDebug = bonusData.debug;
      const bonusMsg = bonusData.error
        ?? (bonusData.message ? `${bonusData.message}${bonusDebug ? ` (id=${bonusDebug.id} bonus2=${bonusDebug.bonus2} tx2=${bonusDebug.tx_bonus2})` : ''}` : null);
      setSendResult({ ...data, bonusResults: bonusData.results ?? [], bonusMsg });
    } catch (err) {
      setSendResult({ error: err.message });
    } finally {
      setSending(false);
    }
  };

  const fetchClm = () => {
    setClmLoading(true);
    fetch("/api/clm")
      .then(r => r.json())
      .then(d => { setClm(d); setClmLoading(false); })
      .catch(() => setClmLoading(false));
  };

  useEffect(() => {
    try {
      const { user } = JSON.parse(localStorage.getItem("auth_session") ?? "{}");
      if (user !== "usopp") { router.replace("/home"); return; }
    } catch { router.replace("/home"); return; }
    fetch("/api/wallet").then(r => r.json()).then(setWallet).catch(() => {});
    fetch("/api/app-config?key=show_defits", { headers: authHeader() }).then(r => r.json()).then(d => setShowGains(d.value === 'true')).catch(() => {});
    fetch("/api/get-distributions").then(r => r.json()).then(setDistrib).catch(() => {});
    fetch("/api/get-user-boost?userId=1").then(r => r.json()).then(d => setBoostPending(d.boost_pending ?? 0)).catch(() => {});
    fetch("/api/get-users", { headers: authHeader() }).then(r => r.json()).then(list => {
      setUsers(list);
      if (list.length > 0) {
        setSelectedUser(list[0]);
        fetch(`/api/get-last-boost?userId=${list[0].id}`, { headers: authHeader() })
          .then(r => r.json())
          .then(d => { setLastBoost(d.boost ?? ""); setLastBonus(d.bonus ?? ""); setLastBonus2(d.bonus2 ?? ""); setLastBonus3(d.bonus3 ?? ""); setLastBenef(d.benef ?? ""); setActivityId(d.activityId ?? null); })
          .catch(() => {});
      }
    }).catch(() => {});
    fetchClm();
  }, []);

  return (
    <main className="flex flex-col w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-4 pb-10">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={goBack} className="text-gray-300 hover:text-white transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-white">Position</h1>
      </div>

      <div className="w-full md:max-w-[900px] xl:max-w-[1100px] mx-auto flex flex-col gap-6">

        {/* ── POSITION CLM ── */}
        <Card
          icon="📊"
          title={clm?.tokenId ? `#${clm.tokenId}` : "Position"}
          subtitle={clm?.pair ?? undefined}
          action={
            <div className="flex items-center gap-3">
              {clm?.wethPrice && <span className="text-white/70 text-xs">ETH {Number(clm.wethPrice).toLocaleString("fr-FR")} $</span>}
              <button onClick={fetchClm} className="text-white/70 hover:text-white text-sm transition-colors">↻</button>
            </div>
          }
        >
          {clmLoading ? (
            <div className="py-5 text-center text-gray-400 text-sm">Chargement…</div>
          ) : clm?.error ? (
            <div className="py-5 text-center text-rose-300 text-sm">Erreur : {clm.error}</div>
          ) : clm?.pair ? (
            <table className="w-full table-auto text-left border-collapse">
              <tbody>
                <tr className="border-b border-white/10 bg-white/5">
                  <td colSpan={2} className="py-2 px-5 text-right">
                    {clm.inRange !== null && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${clm.inRange ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>
                        {clm.inRange ? "In range" : "Out of range"}
                      </span>
                    )}
                  </td>
                </tr>
                <SubHeader>En position</SubHeader>
                {clm.pool.map((t, i) => (
                  <Row key={i} label={t.symbol} value={<><span className="text-white">{t.balance}</span><span className="text-gray-400 text-xs ml-2">~{t.usd} $</span></>} zebra={i % 2 === 0} />
                ))}
                <Row label="Total pool" value={`${clm.totalPoolUSD} $`} gold zebra />
                <SubHeader>Frais non collectés</SubHeader>
                {clm.fees.map((t, i) => (
                  <Row key={i} label={t.symbol} value={<><span className="text-white">{t.balance}</span><span className="text-gray-400 text-xs ml-2">~{t.usd} $</span></>} zebra={i % 2 === 0} />
                ))}
                <Row label="Total fees" value={`${clm.totalUSD} $`} gold zebra />
              </tbody>
            </table>
          ) : (
            <div className="py-5 text-center text-gray-400 text-sm">Position introuvable</div>
          )}
        </Card>

        {/* ── USDC ── */}
        {(wallet || clm) && (
          <Card icon="💵" title="USDC">
            <table className="w-full table-auto text-left border-collapse">
              <tbody>
                <SubHeader>Wallet</SubHeader>
                <Row label="USDC"                value={`${wallet?.usdc ?? "—"} $`}      zebra />
                <Row label="Frais non collectés" value={`${clm?.totalFeesUSD ?? "—"} $`} />
              </tbody>
            </table>
          </Card>
        )}

        {/* ── RÉCAP ── */}
        {wallet && distrib && (
          <Card icon="💰" title="Récap">
            <table className="w-full table-auto text-left border-collapse">
              <tbody>
                <Row label="Disponible perso"
                  value={`${(Number(wallet?.usdc ?? 0) * (1 - ((100 + 135 + 885 + (10 + 50)) / (2084.99 + (10 + 50)))) + Number(boostPending)).toFixed(2)} $`}
                  gold zebra />
                {clm?.totalPoolUSD && (() => {
                  const ref = 2144.99; const cur = Number(clm.totalPoolUSD);
                  const pct = ((cur - ref) / ref) * 100; const up = pct >= 0;
                  return (
                    <tr className="border-b border-white/10 text-sm bg-white/5">
                      <td className="py-2.5 px-5 text-gray-300">Évolution pool <span className="text-white text-xs">{ref.toFixed(2)} → {cur.toFixed(2)} $</span></td>
                      <td className={`py-2.5 px-5 text-right font-bold ${up ? "text-emerald-400" : "text-rose-400"}`}>{up ? "+" : ""}{pct.toFixed(2)} %</td>
                    </tr>
                  );
                })()}
                {clm?.wethPrice && (() => {
                  const ref = 1997.76; const cur = Number(clm.wethPrice);
                  const pct = ((cur - ref) / ref) * 100; const up = pct >= 0;
                  return (
                    <tr className="text-sm bg-white/10">
                      <td className="py-2.5 px-5 text-gray-300">Évolution ETH <span className="text-white text-xs">{ref.toFixed(2)} → {cur.toFixed(2)} $</span></td>
                      <td className={`py-2.5 px-5 text-right font-bold ${up ? "text-emerald-400" : "text-rose-400"}`}>{up ? "+" : ""}{pct.toFixed(2)} %</td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </Card>
        )}

        {/* ── TRANSFERT USDC ── */}
        <Card icon="💸" title="Transfert USDC">
          <div className="p-5 flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-xs uppercase tracking-wide">Utilisateur</label>
              <select
                value={selectedUser?.id ?? ""}
                onMouseDown={() => { savedScrollY.current = window.scrollY; }}
                onChange={e => handleUserChange(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id} className="bg-gray-900">{u.name}</option>
                ))}
              </select>
              {selectedUser && (
                <span className="text-white/30 text-xs truncate">
                  {selectedUser.wallet_address || "Pas de wallet configuré"}
                </span>
              )}
            </div>

            <div className="flex gap-4 flex-wrap">
              <div className="flex flex-col gap-1">
                <label className="text-gray-400 text-xs uppercase tracking-wide">Boost (USDC)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={lastBoost}
                  onChange={e => setLastBoost(e.target.value)}
                  placeholder="0.00"
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 w-32"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-gray-400 text-xs uppercase tracking-wide">Bonus (USDC)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={lastBonus}
                  onChange={e => setLastBonus(e.target.value)}
                  placeholder="0.00"
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 w-32"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-gray-400 text-xs uppercase tracking-wide">Bonus2 (USDC)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={lastBonus2}
                  onChange={e => setLastBonus2(e.target.value)}
                  placeholder="0.00"
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 w-32"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-gray-400 text-xs uppercase tracking-wide">Bonus3 (USDC)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={lastBonus3}
                  onChange={e => setLastBonus3(e.target.value)}
                  placeholder="0.00"
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 w-32"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-gray-400 text-xs uppercase tracking-wide">Benef (USDC)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={lastBenef}
                  onChange={e => setLastBenef(e.target.value)}
                  placeholder="0.00"
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 w-32"
                />
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={sending || !selectedUser || !lastBoost}
              className={`self-start text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                confirming
                  ? "bg-rose-500 hover:bg-rose-400 animate-pulse"
                  : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400"
              }`}
            >
              {sending ? "Envoi…" : confirming ? `Confirmer ? (${countdown}s)` : "Envoyer"}
            </button>

            {sendResult && (
              <div className={`text-sm rounded-lg px-4 py-3 flex flex-col gap-1 ${sendResult.error ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                {sendResult.error
                  ? `Erreur : ${sendResult.error}`
                  : <>
                      {sendResult.txBoost  && <span>✓ Boost — {sendResult.txBoost}</span>}
                      {sendResult.txBonus  && <span>✓ Bonus — {sendResult.txBonus}</span>}
                      {sendResult.txBenef  && <span>✓ Benef — {sendResult.txBenef}</span>}
                      {sendResult.bonusResults?.map(r => (
                        <span key={r.id}>
                          {r.tx_bonus2 && <>✓ Bonus2 #{r.id} — {r.tx_bonus2}<br/></>}
                          {r.tx_bonus3 && <>✓ Bonus3 #{r.id} — {r.tx_bonus3}</>}
                        </span>
                      ))}
                      {sendResult.bonusMsg && <span className="text-yellow-300">⚠ Bonus2/3 : {sendResult.bonusMsg}</span>}
                    </>
                }
              </div>
            )}

          </div>
        </Card>

        <Card icon="⚙️" title="Option Defits">
          <div className="p-5">
            <div
              className="flex items-center gap-2 text-white text-sm cursor-pointer select-none"
              onClick={() => {
                const next = !showGains;
                setShowGains(next);
                fetch('/api/app-config', { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify({ key: 'show_defits', value: next }) }).catch(() => {});
              }}
            >
              <div className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${showGains ? "bg-[#D6C48A]" : "bg-white/20"}`}>
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${showGains ? "translate-x-5" : "translate-x-0"}`} />
              </div>
              Afficher les Defits
            </div>
          </div>
        </Card>

      </div>
    </main>
  );
}
