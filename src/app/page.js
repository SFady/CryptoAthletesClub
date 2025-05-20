"use client";

import { useEffect, useState } from "react";
import { BarChart2 } from "lucide-react";
import { Trophy } from "lucide-react";

function DefitPrice() {
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/token_price/polygon-pos?contract_addresses=0x428360b02c1269bc1c79fbc399ad31d58c1e8fda&vs_currencies=usd"
        );
        const data = await res.json();
        const tokenData = data["0x428360b02c1269bc1c79fbc399ad31d58c1e8fda"];
        if (tokenData && tokenData.usd) {
          setPrice(tokenData.usd);
        } else {
          setError("Prix introuvable");
        }
      } catch (err) {
        setError("Erreur de chargement");
      }
    }

    fetchPrice();
  }, []);

  if (error) return <p className="price-error">{error}</p>;
  if (price === null) return <p className="price-loading">Chargement...</p>;

  return (
    <p className="defit-price">
      Prix actuel du <strong>DEFIT</strong> : <span>${price.toFixed(4)}</span>
    </p>
  );
}

function DefitPriceValue() {
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/token_price/polygon-pos?contract_addresses=0x428360b02c1269bc1c79fbc399ad31d58c1e8fda&vs_currencies=usd"
        );
        const data = await res.json();
        const tokenData = data["0x428360b02c1269bc1c79fbc399ad31d58c1e8fda"];
        if (tokenData && tokenData.usd) {
          setPrice(Number(tokenData.usd).toFixed(4));
        } else {
          setError("Prix introuvable");
        }
      } catch (err) {
        setError("Erreur de chargement");
      }
    }

    fetchPrice();
  }, []);

  return price;
}

export default function Home() {
  const [open, setOpen] = useState(false);

	// Exemple de données
  const activities = [
    { id: 1, name: "Yoga", date: "2025-05-20", status: "Confirmé" },
    { id: 2, name: "Course à pied", date: "2025-05-21", status: "En attente" },
    { id: 3, name: "Natation", date: "2025-05-22", status: "Confirmé" },
  ];

  return (
    <>
      <div className="container">
        <div className="background-image" />
        <div className="gradient-overlay" />

        <header className="header">
          <div className="logo" aria-label="Logo CAC">
            <img src="/images/CAC.png" alt="Logo CAC" className="logo-icon" />
            <h1 className="crypto-title">
		The Crypto Athletes Club
	    </h1>
          </div>

          <nav className={`nav ${open ? "nav-open" : ""}`}>
            <a href="#menu1" onClick={() => setOpen(false)}>
              Menu1
            </a>
            <a href="#menu2" onClick={() => setOpen(false)}>
              Menu2
            </a>
            <a href="#menu3" onClick={() => setOpen(false)}>
              Menu3
            </a>
          </nav>
          <button
            className={`burger ${open ? "burger-open" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </header>

        <main>
	  <DefitPrice />
<br/><br/><br/>
<h2 className="ombre"><Trophy size={20} style={{ marginRight: '8px', verticalAlign: 'middle', marginBottom: '8px' }} /><span>Utilisateurs</span></h2>
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
                {activities.map(({ id, name, date, status }) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
  <br/>
<br/><br/>

<h2 className="ombre"><BarChart2 size={20} style={{ marginRight: '8px', verticalAlign: 'middle', marginBottom: '3px' }} /><span>Liste des activités</span></h2>
	<section className="activities-section">
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
                {activities.map(({ id, name, date, status }) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{date}</td>
                    <td>{status}</td>
                    <td>{status}</td>
                    <td>{status}</td>
                    <td>{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

        </main>
      </div>

      <style jsx>{`
        /* Reset */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background-color: #4608ad;
          font-family: Arial, sans-serif;
          color: white;
          min-height: 100vh;
        }

        .container {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          z-index: 0;
        }

        .background-image {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-image: url("/images/banner.webp");
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
          z-index: 0;
        }

        .gradient-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(
            to right,
            #4608ad 0%,
            #4608ad 65%,
            transparent 100%
          );
          pointer-events: none;
          z-index: 1;
        }
	
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(70, 8, 173, 0.9);
          backdrop-filter: blur(5px);
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          z-index: 1000;
        }

       .logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

      .logo-icon {
	  width: 36px;
	  height: 36px;
	  border: 2px solid black; /* Bordure noire de 2px */
	  border-radius: 4px; /* optionnel : coins légèrement arrondis */
	  padding: 2px; /* optionnel : un peu d’espace entre l’image et la bordure */
	  background-color: white; /* optionnel : fond blanc pour bien faire ressortir le contour */
	}

        .nav {
          display: flex;
          gap: 2rem;
          z-index: 1100;
        }

        .nav a {
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }

        .nav a:hover {
          color: #a477ff;
        }

        .burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 1100;
        }

        .burger span {
          width: 25px;
          height: 3px;
          background: white;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .burger-open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .burger-open span:nth-child(2) {
          opacity: 0;
        }
        .burger-open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        @media (max-width: 768px) {
          .nav {
            position: fixed;
            top: 60px;
            right: 0;
            background: rgba(70, 8, 173, 0.95);
            backdrop-filter: blur(5px);
            flex-direction: column;
            width: 200px;
            padding: 1rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            height: calc(100vh - 60px);
          }

          .nav.nav-open {
            transform: translateX(0);
          }

          .burger {
            display: flex;
          }
        }

        main {
          padding: 100px 20px 20px;
          position: relative;
          z-index: 10;
          min-height: 100vh;
          background: transparent;
          color: white;
        }

	.activities-section {
          margin-top: 20px;
          max-width: 1200px;
        }
	
	.utilisateurs-section {
          margin-top: 20px;
          max-width: 800px;
        }	

        .activities-section h2 {
          margin-bottom: 0.5rem;
        }

        .activities-section p {
          margin-bottom: 1rem;
          color: #d0c6ff;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(255 255 255 / 0.1);
background-color: #5821B4;
	  border-radius: 6px;
          overflow: hidden;
        }

        th,
        td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid rgba(255 255 255 / 0.2);
        }

        th {
          background-color: rgba(164, 119, 255, 0.7);
        }

        tr:hover {
          //background-color: rgba(164, 119, 255, 0.3);
	  background-color: #a477ff;
  color: white;
        }
.crypto-title {
  font-family: Tahoma, Geneva, Verdana, sans-serif;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #ffffff; /* solid white */
  text-shadow:
    2px 2px 6px rgba(0, 0, 0, 0.9),
    1px 1px 2px rgba(0, 0, 0, 0.6);
}

.ombre {
  //text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
 color: white/* texte violet très clair mais pas blanc */
  //text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7);
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.details-texte {
  color: #d6ccff;
  font-size: 1rem;
  margin-bottom: 1rem;
}

table, th, td, tr {
  caret-color: transparent;   /* Supprime le curseur clignotant */
  user-select: none;          /* Empêche la sélection de texte (facultatif) */
}

table *:focus {
  outline: none;              /* Supprime le contour focus */
}

      `}</style>
    </>
  );
}
