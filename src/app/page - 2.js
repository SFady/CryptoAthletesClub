
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
      
      <main>
	<img src="/images/banner.webp" alt="Bannière" className="banner" />
      </main>

      <style jsx>{`
        /* Reset de base */
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

        /* Burger - caché par défaut */
        .burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
        }
        .burger span {
          width: 25px;
          height: 3px;
          background: white;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        /* Animation burger quand ouvert */
        .burger-open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .burger-open span:nth-child(2) {
          opacity: 0;
        }
        .burger-open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        /* Responsive - sur petits écrans */
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

        main {
           padding: 100px 20px 20px;background: 
           linear-gradient(to bottom, #3366cc, #003399, #001f4d);
  	   color: white;
  	   min-height: 100vh; /* pour que le dégradé remplisse la hauteur */
        }
	
.banner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* ou contain si tu veux tout voir */
  z-index: 0;
}


      `}</style>
    </>
  );
}
