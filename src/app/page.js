"use client";

import { useState, useEffect } from "react";
import { BarChart2, User } from "lucide-react";
import { useDefitPrice } from "./useDefitPrice";
import BottomMenu from './BottomMenu';
import { activities } from './activities';

export default function Home() {
  const buildDate = process.env.BUILD_DATE;
  const [open, setOpen] = useState(false);
  const { price: defitPrice, error } = useDefitPrice();

  const users = [
    { id: 1, name: "Usopp", defit: 0 },
    { id: 2, name: "Nico_Robin", defit: 0 },
    { id: 3, name: "DTeach", defit: 0 }
  ];

  function sommeDefiNetParUtilisateur(defis) {
    return defis.reduce((acc, { utilisateur, defitnet }) => {
      acc[utilisateur] = (acc[utilisateur] || 0) + defitnet;
      return acc;
    }, {});
  }

  const defitSums = sommeDefiNetParUtilisateur(activities);

  const uniqueUsers = ["Tous", ...new Set(activities.map(a => a.utilisateur))];


  const [userFilter, setUserFilter] = useState("Tous");
  const filteredActivities = activities.filter(a => userFilter === "Tous" || a.utilisateur === userFilter);

  // Lire la dernière sélection depuis localStorage au montage
	useEffect(() => {
	  const savedFilter = localStorage.getItem("userFilter");
	  if (savedFilter) setUserFilter(savedFilter);
	}, []);

  // Sauvegarder dans localStorage dès que userFilter change
	useEffect(() => {
	  localStorage.setItem("userFilter", userFilter);
	}, [userFilter]);  
	
  const [periode, setPeriode] = useState("annee");
  
  // 🔁 Lire le filtre depuis localStorage au montage
  useEffect(() => {
    const savedPeriode = localStorage.getItem("periodFilter");
    if (savedPeriode) setPeriode(savedPeriode);
  }, []);

  // 💾 Enregistrer dans localStorage dès que ça change
  useEffect(() => {
    localStorage.setItem("periodFilter", periode);
  }, [periode]);

  function parseDateFR(str) {
    const [jour, mois, annee] = str.split("/").map(Number);
    return new Date(annee, mois - 1, jour);
  }

  function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  function sommeKmParUtilisateur(activities, periodeType) {
    const maintenant = new Date();
    return activities.reduce((acc, { utilisateur, date, km = 0 }) => {
      const d = parseDateFR(date);
      const match =
        (periodeType === "annee" && d.getFullYear() === maintenant.getFullYear()) ||
        (periodeType === "mois" && d.getFullYear() === maintenant.getFullYear() && d.getMonth() === maintenant.getMonth()) ||
        (periodeType === "semaine" && d.getFullYear() === maintenant.getFullYear() && getWeekNumber(d) === getWeekNumber(maintenant));
      if (!match) return acc;
      acc[utilisateur] = (acc[utilisateur] || 0) + km;
      return acc;
    }, {});
  }

  const kmParUtilisateur = sommeKmParUtilisateur(activities, periode);

  return (
    <>
      <div className="container">
        <div className="background-image" />
        <div className="gradient-overlay" />

        <header className="header">
          <div className="logo">
            <img src="/images/CAC.png" alt="Logo CAC" className="logo-icon" />
            <h1 className="crypto-title">The Crypto Athletes Club</h1>
          </div>

          <nav className={`nav ${open ? "nav-open" : ""}`}>
            <a href="/" onClick={() => setOpen(false)}>Accueil</a>
            <a href="/activities" onClick={() => setOpen(false)}>Activités</a>
            <a href="/divers" onClick={() => setOpen(false)}>Divers</a>
          </nav>
        </header>

        <main>
          {error ? (
            <p className="price-error">{error}</p>
          ) : defitPrice === null ? (
            <p className="price-loading">Chargement...</p>
          ) : (
            <p className="defit-price" style={{ marginTop: "20px" }}>
              Prix actuel du <strong>DEFIT</strong> : <span>${defitPrice.toFixed(4)}</span>
            </p>
          )}
          <p>Maj : {new Date(buildDate).toLocaleString()}</p>

          <br /><br /><br />
          <h2 className="ombre"><User size={20} style={{ marginRight: '3px', verticalAlign: 'middle', marginBottom: '3px' }} /><span>Utilisateurs</span></h2>

          <section className="utilisateurs-section">
            <table>
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Defit</th>
                  <th>Dollars $</th>
                </tr>
              </thead>
              <tbody>
                {users.map(({ id, name }) => {
                  const defit = defitSums[name] || 0;
                  return (
                    <tr key={id}>
                      <td>{name}</td>
                      <td>{defit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(',', ' ')}</td>
		      <td>{(defit * defitPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(',', ' ')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>


	<br /><br /><br />
          <h2 className="ombre"><BarChart2 size={20} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Classement</h2>
	<br/>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            {["annee", "mois", "semaine"].map(p => (
              <button key={p} onClick={() => setPeriode(p)} className={`filter-button ${periode === p ? 'active' : ''}`}>
                {p === 'annee' ? 'Année' : p === 'mois' ? 'Mois' : 'Semaine'}
              </button>
            ))}
          </div>

          <section className="activities-section">
            <table>
              <thead>
                <tr>
                  <th>Place</th>
		  <th>Utilisateur</th>
                  <th>Kilomètres</th>
                </tr>
              </thead>
              <tbody>
{Object.entries(kmParUtilisateur)
  .sort((a, b) => b[1] - a[1])
  .map(([utilisateur, km], index) => (
    <tr key={utilisateur}>
      <td>{index+1}</td>
      <td>{utilisateur}</td>
      <td>{km.toFixed(2)}</td>
    </tr>
))}
              </tbody>
            </table>
          </section>




          
        </main>
        <BottomMenu />
      </div>

      <style jsx>{`
        /* LE RESTE DE TON CSS ORIGINAL ICI : */

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background-color: #4608ad; font-family: Arial, sans-serif; color: white; min-height: 100vh; }
        .container { position: relative; min-height: 100vh; overflow: hidden; z-index: 0; }
        .background-image { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-image: url("/images/banner.webp"); background-repeat: no-repeat; background-position: center; background-size: cover; z-index: 0; }
        .gradient-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: linear-gradient(to right, #4608ad 0%, #4608ad 65%, transparent 100%); pointer-events: none; z-index: 1; }
        .header { position: fixed; top: 0; left: 0; right: 0; background: rgba(70, 8, 173, 1); backdrop-filter: blur(5px); color: white; display: flex; align-items: center; justify-content: space-between; padding: 1rem 2rem; z-index: 1000; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .logo { display: flex; align-items: center; gap: 1rem; }
        .logo-icon { width: 36px; height: 36px; border: 2px solid black; border-radius: 4px; padding: 2px; background-color: white; }
        .nav { display: flex; gap: 2rem; z-index: 1100; }
        .nav a { color: white; text-decoration: none; font-weight: 500; transition: color 0.3s; }
        .nav a:hover { color: #a477ff; }
        .burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; z-index: 1100; }
        .burger span { width: 25px; height: 3px; background: white; border-radius: 2px; transition: all 0.3s ease; }
        .burger-open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .burger-open span:nth-child(2) { opacity: 0; }
        .burger-open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
        @media (max-width: 768px) {
          .nav { position: fixed; top: 60px; right: 0; background: rgba(70, 8, 173, 0.95); backdrop-filter: blur(5px); flex-direction: column; width: 200px; padding: 1rem; transform: translateX(100%); transition: transform 0.3s ease; height: calc(100vh - 60px); }
          .nav.nav-open { transform: translateX(0); }
          .burger { display: flex; }
        }
        main { padding: 100px 20px 80px; position: relative; z-index: 10; min-height: 100vh; background: transparent; color: white; }
        .activities-section { margin-top: 20px; max-width: 1200px; }
        .utilisateurs-section { margin-top: 20px; max-width: 800px; }
        table { width: 100%; border-collapse: collapse; background-color: #5821B4; border-radius: 6px; overflow: hidden; }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid rgba(255 255 255 / 0.2); }
        th { background-color: rgba(164, 119, 255, 0.7); }
        tr:hover { background-color: #a477ff; color: white; }
        .crypto-title { font-family: Tahoma, Geneva, Verdana, sans-serif; font-size: 2rem; font-weight: 800; letter-spacing: 0.05em; color: #ffffff; text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.9), 1px 1px 2px rgba(0, 0, 0, 0.6); }
        .ombre { color: white; font-family: Arial, Helvetica, sans-serif; font-weight: 700; letter-spacing: 0.5px; text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.85); display: flex; align-items: center; gap: 8px; }
        .details-texte { color: #d6ccff; font-size: 1rem; margin-bottom: 1rem; }
        table, th, td, tr { caret-color: transparent; user-select: none; }
        table *:focus { outline: none; }

        /* 🔽 FILTRE STYLE 🔽 */
        .filter-button {
          background-color: #7c4dff;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.3s;
        }
        .filter-button:hover {
          background-color: #a477ff;
        }
        .filter-button.active {
          background-color: #ffd700;
          color: black;
        }
      `}</style>
    </>
  );
}
