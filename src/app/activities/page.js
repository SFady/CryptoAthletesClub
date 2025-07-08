// /app/activities/page.jsx
"use client";

import { useState, useEffect } from "react";
import { BarChart2 } from "lucide-react";
import { useDefitPrice } from "../useDefitPrice"; // adapte le chemin selon ton arborescence
import { activities } from "../activities";
import BottomMenu from "../BottomMenu"; // adapte ce chemin aussi

export default function ActivitiesPage() {
  const { price: defitPrice, error } = useDefitPrice();
  const [userFilter, setUserFilter] = useState("Tous");
  const [open, setOpen] = useState(false);

  const uniqueUsers = ["Tous", ...new Set(activities.map((a) => a.utilisateur))];
  const filteredActivities = activities.filter(
    (a) => userFilter === "Tous" || a.utilisateur === userFilter
  );

  useEffect(() => {
    const savedFilter = localStorage.getItem("userFilter");
    if (savedFilter) setUserFilter(savedFilter);
  }, []);

  useEffect(() => {
    localStorage.setItem("userFilter", userFilter);
  }, [userFilter]);

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
<br/>
<br/>
          <h2 className="ombre">
            <BarChart2 size={20} style={{ marginRight: "3px", verticalAlign: "middle", marginBottom: "-1px" }} />
            <span>Liste des activités</span>
          </h2>
          <br />
          <div style={{ marginBottom: "1rem", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {uniqueUsers.map((user) => (
              <button key={user} onClick={() => setUserFilter(user)} className={`filter-button ${userFilter === user ? "active" : ""}`}>
                {user}
              </button>
            ))}
          </div>

          <section className="activities-section">
            {error ? (
              <p className="price-error">{error}</p>
            ) : defitPrice === null ? (
              <p className="price-loading">Chargement prix DEFIT...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Utilisateur</th>
                    <th>Activité</th>
                    <th>Gain Brut (Defit)</th>
                    <th>Participation</th>
                    <th>Gain Net (Defit)</th>
                    <th>Gain Net ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.map(({ id, date, utilisateur, activite, defit, participation, defitnet }) => (
                    <tr key={id}>
                      <td>{date}</td>
                      <td>{utilisateur}</td>
                      <td>{activite}</td>
                      <td>{defit}</td>
                      <td>{participation}</td>
                      <td>{defitnet}</td>
                      <td>{(defitnet * defitPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </main>

        <BottomMenu />
      </div>
    </>
  );
}
