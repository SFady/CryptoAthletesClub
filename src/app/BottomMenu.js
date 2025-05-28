import React from 'react';

const BottomMenu = () => {
  return (
    <>
      <style>{`
        .bottom-menu {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 56px;
          background: #4608ad;
          box-shadow: 0 -1px 5px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-top: 0px solid #ccc;
          z-index: 1000;
        }

        /* Hide on larger screens */
        @media (min-width: 768px) {
          .bottom-menu {
            display: none;
          }
        }

        .bottom-menu button {
          background: none;
          border: none;
          font-size: 16px;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .bottom-menu button:focus {
          outline: none;
          color: #007bff;
        }

        .bottom-menu svg {
          width: 24px;
          height: 24px;
          margin-bottom: 4px;
        }
      `}</style>

      <nav className="bottom-menu" role="navigation" aria-label="Bottom navigation">
        <button aria-label="Home" onClick={() => window.location.href = '/'}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          Home
        </button>
        <button aria-label="Search" onClick={() => window.location.href = '/search'}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16a6.471 6.471 0 004.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z"/></svg>
          Search
        </button>
        <button aria-label="Profile" onClick={() => window.location.href = '/profile'}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          Profile
        </button>
      </nav>
    </>
  );
};

export default BottomMenu;
