"use client";

import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="container">
        <div className="background-image" />
        <div className="gradient-overlay" />
        
        <header className="header">
          <div className="logo">Mon Site</div>
          <nav className={`nav ${open ? "nav-open" : ""}`}>
            <a href="#accueil" onClick={() => setOpen(false)}>Accueil</a>
            <a href="#apropos" onClick={() => setOpen(false)}>À propos</a>
            <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
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
          <h1>Bienvenue sur mon site avec menu burger !</h1>
          <p>Ceci est un exemple de texte sur fond violet.</p>
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
          background-color: #4608AD; /* violet */
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

        /* Image de fond full screen */
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

        /* Dégradé violet à gauche de l’image */
        .gradient-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(
            to right,
            #4608AD 0%,
            #4608AD 50%,
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
          font-weight: bold;
          font-size: 1.5rem;
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
          color: white; /* Texte bien en blanc */
        }
      `}</style>
    </>
  );
}
