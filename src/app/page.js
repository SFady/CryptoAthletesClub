"use client";

import { useEffect, useState } from "react";
import { BarChart2 } from "lucide-react";
import { Trophy } from "lucide-react";
import { useDefitPrice } from "./useDefitPrice";
import BottomMenu from './BottomMenu'; // adjust the path


export default function Home() {
  const [open, setOpen] = useState(false);

	// Exemple de données
  const activities = [

{ id: 61, date: "07/06/2025", utilisateur: "Nico Robin", activite: "Running", defit: 17.28, participation: "50%", defitnet: 8.64 },
{ id: 60, date: "29/05/2025", utilisateur: "Nico Robin", activite: "Running", defit: 4.15, participation: "50%", defitnet: 2.08 },
{ id: 59, date: "28/05/2025", utilisateur: "DTeach", activite: "Running", defit: 5.71, participation: "50%", defitnet: 2.86 },
{ id: 58, date: "27/05/2025", utilisateur: "Nico Robin", activite: "Running", defit: 18.61, participation: "50%", defitnet: 9.31 },
{ id: 57, date: "24/05/2025", utilisateur: "DTeach", activite: "Running", defit: 27.03, participation: "50%", defitnet: 13.52 },
{ id: 56, date: "23/05/2025", utilisateur: "DTeach", activite: "Running", defit: 6.21, participation: "50%", defitnet: 3.11 },
{ id: 55, date: "21/05/2025", utilisateur: "DTeach", activite: "Running", defit: 7.64, participation: "50%", defitnet: 3.82 },
{ id: 54, date: "20/05/2025", utilisateur: "Usopp", activite: "Running", defit: 96.19, participation: "100%", defitnet: 96.19 },
{ id: 53, date: "19/05/2025", utilisateur: "DTeach", activite: "Running", defit: 37.13, participation: "50%", defitnet: 18.57 },
{ id: 52, date: "18/05/2025", utilisateur: "Usopp", activite: "Running", defit: 169.74, participation: "100%", defitnet: 169.74 },
{ id: 51, date: "17/05/2025", utilisateur: "DTeach", activite: "Running", defit: 63.93, participation: "50%", defitnet: 31.97 },
{ id: 50, date: "15/05/2025", utilisateur: "DTeach", activite: "Running", defit: 7.79, participation: "50%", defitnet: 3.90 },
{ id: 49, date: "13/05/2025", utilisateur: "DTeach", activite: "Running", defit: 3, participation: "50%", defitnet: 1.50 },
{ id: 48, date: "12/05/2025", utilisateur: "DTeach", activite: "Running", defit: 13.67, participation: "50%", defitnet: 6.84 },
{ id: 47, date: "11/05/2025", utilisateur: "Usopp", activite: "Running", defit: 191.05, participation: "100%", defitnet: 191.05 },
{ id: 46, date: "08/05/2025", utilisateur: "Usopp", activite: "Running", defit: 82.44, participation: "100%", defitnet: 82.44 },
{ id: 45, date: "06/05/2025", utilisateur: "Usopp", activite: "Running", defit: 45.56, participation: "100%", defitnet: 45.56 },
{ id: 44, date: "04/05/2025", utilisateur: "Usopp", activite: "Running", defit: 98.61, participation: "100%", defitnet: 98.61 },
{ id: 43, date: "28/04/2025", utilisateur: "Usopp", activite: "Running", defit: 10.29, participation: "100%", defitnet: 10.29 },
{ id: 42, date: "28/04/2025", utilisateur: "DTeach", activite: "Running", defit: 11.33, participation: "50%", defitnet: 5.67 },
{ id: 41, date: "21/04/2025", utilisateur: "Usopp", activite: "Running", defit: 48.77, participation: "100%", defitnet: 48.77 },
{ id: 40, date: "21/04/2025", utilisateur: "Usopp", activite: "Running", defit: 7.35, participation: "100%", defitnet: 7.35 },
{ id: 39, date: "16/04/2025", utilisateur: "Usopp", activite: "Running", defit: 85.71, participation: "100%", defitnet: 85.71 },
{ id: 38, date: "13/04/2025", utilisateur: "Usopp", activite: "Running", defit: 335.07, participation: "100%", defitnet: 335.07 },
{ id: 37, date: "09/04/2025", utilisateur: "Usopp", activite: "Running", defit: 70.54, participation: "100%", defitnet: 70.54 },
{ id: 36, date: "08/04/2025", utilisateur: "Usopp", activite: "Running", defit: 250.63, participation: "100%", defitnet: 250.63 },
{ id: 35, date: "02/04/2025", utilisateur: "Usopp", activite: "Running", defit: 51.44, participation: "100%", defitnet: 51.44 },
{ id: 34, date: "28/03/2025", utilisateur: "Usopp", activite: "Running", defit: 61.72, participation: "100%", defitnet: 61.72 },
{ id: 33, date: "25/03/2025", utilisateur: "Usopp", activite: "Running", defit: 61.72, participation: "100%", defitnet: 61.72 },
{ id: 32, date: "23/03/2025", utilisateur: "Usopp", activite: "Running", defit: 91.12, participation: "100%", defitnet: 91.12 },
{ id: 31, date: "19/03/2025", utilisateur: "Usopp", activite: "Running", defit: 41.08, participation: "100%", defitnet: 41.08 },
{ id: 30, date: "16/03/2025", utilisateur: "Usopp", activite: "Running", defit: 33.07, participation: "100%", defitnet: 33.07 },
{ id: 29, date: "13/03/2025", utilisateur: "Usopp", activite: "Running", defit: 16.88, participation: "100%", defitnet: 16.88 },
{ id: 28, date: "09/03/2025", utilisateur: "Usopp", activite: "Running", defit: 27.47, participation: "100%", defitnet: 27.47 },
{ id: 27, date: "02/03/2025", utilisateur: "Usopp", activite: "Running", defit: 16.64, participation: "100%", defitnet: 16.64 },
{ id: 26, date: "23/02/2025", utilisateur: "Usopp", activite: "Running", defit: 72.02, participation: "100%", defitnet: 72.02 },
{ id: 25, date: "18/02/2025", utilisateur: "Usopp", activite: "Running", defit: 25.92, participation: "100%", defitnet: 25.92 },
{ id: 24, date: "16/02/2025", utilisateur: "Usopp", activite: "Running", defit: 23.97, participation: "100%", defitnet: 23.97 },
{ id: 23, date: "12/02/2025", utilisateur: "Usopp", activite: "Running", defit: 23.15, participation: "100%", defitnet: 23.15 },
{ id: 22, date: "09/02/2025", utilisateur: "Usopp", activite: "Running", defit: 46.27, participation: "100%", defitnet: 46.27 },
{ id: 21, date: "05/02/2025", utilisateur: "Usopp", activite: "Running", defit: 29.83, participation: "100%", defitnet: 29.83 },
{ id: 20, date: "02/02/2025", utilisateur: "Usopp", activite: "Running", defit: 46.29, participation: "100%", defitnet: 46.29 },
{ id: 19, date: "29/01/2025", utilisateur: "Usopp", activite: "Running", defit: 66.28, participation: "100%", defitnet: 66.28 },
{ id: 18, date: "26/01/2025", utilisateur: "Usopp", activite: "Running", defit: 146.96, participation: "100%", defitnet: 146.96 },
{ id: 17, date: "24/01/2025", utilisateur: "Usopp", activite: "Running", defit: 60.25, participation: "100%", defitnet: 60.25 },
{ id: 16, date: "19/01/2025", utilisateur: "Usopp", activite: "Running", defit: 46.29, participation: "100%", defitnet: 46.29 },
{ id: 15, date: "12/01/2025", utilisateur: "Usopp", activite: "Running", defit: 27.11, participation: "100%", defitnet: 27.11 },
{ id: 14, date: "05/01/2025", utilisateur: "Usopp", activite: "Running", defit: 29.83, participation: "100%", defitnet: 29.83 },
{ id: 13, date: "02/01/2025", utilisateur: "Usopp", activite: "Running", defit: 26.21, participation: "100%", defitnet: 26.21 },
{ id: 12, date: "31/12/2024", utilisateur: "Usopp", activite: "Running", defit: 27.11, participation: "100%", defitnet: 27.11 },
{ id: 11, date: "29/12/2024", utilisateur: "Usopp", activite: "Running", defit: 25.79, participation: "100%", defitnet: 25.79 },
{ id: 10, date: "27/12/2024", utilisateur: "Usopp", activite: "Running", defit: 29.65, participation: "100%", defitnet: 29.65 },
{ id: 9, date: "21/12/2024", utilisateur: "Usopp", activite: "Running", defit: 60.25, participation: "100%", defitnet: 60.25 },
{ id: 8, date: "15/12/2024", utilisateur: "Usopp", activite: "Running", defit: 66.28, participation: "100%", defitnet: 66.28 },
{ id: 7, date: "08/12/2024", utilisateur: "Usopp", activite: "Running", defit: 60.25, participation: "100%", defitnet: 60.25 },
{ id: 6, date: "01/12/2024", utilisateur: "Usopp", activite: "Running", defit: 60.08, participation: "100%", defitnet: 60.08 },
{ id: 5, date: "10/11/2024", utilisateur: "Usopp", activite: "Running", defit: 13.19, participation: "100%", defitnet: 13.19 },
{ id: 4, date: "27/10/2024", utilisateur: "Usopp", activite: "Running", defit: 211.2, participation: "100%", defitnet: 211.20 },
{ id: 3, date: "20/10/2024", utilisateur: "Usopp", activite: "Running", defit: 199.32, participation: "100%", defitnet: 199.32 },
{ id: 2, date: "13/10/2024", utilisateur: "Usopp", activite: "Running", defit: 251.2, participation: "100%", defitnet: 251.20 },
{ id: 1, date: "02/10/2024", utilisateur: "Usopp", activite: "Running", defit: 158, participation: "100%", defitnet: 158.00 },

  ];

 const { price: defitPrice, error } = useDefitPrice();
 const users= [
    { id: 1, name: "Usopp", defit: 3725.79 },
    { id: 2, name: "DTeach", defit: 91.72 },
    { id: 3, name: "Nico Robin", defit: 20.02 } 
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
	    {error ? (
            <p className="price-error">{error}</p>
          ) : defitPrice === null ? (
            <p className="price-loading">Chargement...</p>
          ) : (
            <p className="defit-price" style={{ marginTop: "20px" }}>
              Prix actuel du <strong>DEFIT</strong> :{" "}
              <span>${defitPrice.toFixed(4)}</span>
            </p>
          )}
	   <p>
      		Maj : 29-05-2025 18:00
	    </p>
<br/><br/><br/>
<h2 className="ombre"><Trophy size={20} style={{ marginRight: '3px', verticalAlign: 'middle', marginBottom: '3px' }} /><span>Utilisateurs</span></h2>

<section className="utilisateurs-section">
        {error ? (
          <p>{error}</p>
        ) : defitPrice === null ? (
          <p>Chargement...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Defit</th>
                <th>Dollars $</th>
              </tr>
            </thead>
            <tbody>
              {users.map(({ id, name, defit }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{defit}</td>
                  <td>{(defit * defitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>	


  <br/>
<br/><br/>

<h2 className="ombre"><BarChart2 size={20} style={{ marginRight: '3px', verticalAlign: 'middle', marginBottom: '-1px' }} /><span>Liste des activités</span></h2>
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
                {activities.map(({ id, date, utilisateur, activite, defit, participation, defitnet }) => (
                  <tr key={id}>
                    <td>{date}</td>
                    <td>{utilisateur}</td>
                    <td>{activite}</td>
                    <td>{defit}</td>
                    <td>{participation}</td>
                    <td>{defitnet}</td>
                    <td>{(defitnet*defitPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

        </main>
	 <BottomMenu />
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
          background: rgba(70, 8, 173, 1);
          backdrop-filter: blur(5px);
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          z-index: 1000;
	  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
          padding: 100px 20px 80px;
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
  color: white;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.85); /* solid dark shadow only */
  display: flex;
  align-items: center;
  gap: 8px;
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
