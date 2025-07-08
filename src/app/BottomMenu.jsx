import React from 'react';

const BottomMenu = () => {
  return (
    <>
      <nav className="bottom-menu" role="navigation" aria-label="Bottom navigation">
        <button aria-label="Accueil" onClick={() => window.location.href = '/'}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          Accueil
        </button>
        <button aria-label="Activités" onClick={() => window.location.href = '/activities'}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16a6.471 6.471 0 004.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z"/></svg>
          Activités
        </button>
        <button aria-label="Divers" onClick={() => window.location.href = '/divers'}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          Divers
        </button>
      </nav>
    </>
  );
};

export default BottomMenu;
