"use client";

import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="logo">The Crypto Athletes Club</div>
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

      <main className="hero-section">
        <div className="hero-text">
	<br/>
	<br/>          
	<h1>The Crypto Athletes Club</h1>
          <p>Site en Next.js</p>
        </div>
        <img
          src="/images/banner.webp"
          alt="Image d'accueil"
          className="hero-image"
        />
      </main>

      <style jsx>{`
        html, body {
          margin: 0;
          padding: 0;
          background-color: #222;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
        }
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #222;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          z-index: 1000;
          border-bottom: none;
          box-shadow: none;
        }
        .logo {
          font-weight: bold;
          font-size: 1.5rem;
        }
        .nav {
          display: flex;
          gap: 2rem;
        }
        .nav a {
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }
        .nav a:hover {
          color: #ff6347;
        }
        .burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          outline: none;
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
            background: #222;
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

        main.hero-section {
          position: relative;
          margin-top: 60px; /* hauteur menu */
          height: calc(100vh - 60px);
          display: flex;
          align-items: flex-start; /* texte collé en haut */
          color: white;
          background: linear-gradient(to bottom, #3366cc, #003399, #001f4d);
          overflow: hidden;
        }
        .hero-text {
          position: relative;
          z-index: 2;
          flex: 1;
          padding: 1rem 2rem 2rem 2rem;
          max-width: 600px;
          margin-top: 0;
        }
        .hero-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
          opacity: 0.7;
        }
      `}</style>
    </>
  );
}
