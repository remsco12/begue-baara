import React from 'react';
import '../styles/Header.css';

const Header = ({ currentPage, setCurrentPage }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="entete-section">
            <div className="entete-container">
              <img 
                src="/logo.png" 
                alt="Réseau Allah Don" 
                className="entete-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'entete-icon';
                  fallback.textContent = '🕌';
                  e.target.parentNode.insertBefore(fallback, e.target);
                }}
              />
              {/* Pas de texte - complètement supprimé */}
            </div>
          </div>
          
          <nav className="nav">
            <button 
              className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentPage('home')}
            >
              🏠 Accueil
            </button>
            <button 
              className={`nav-btn ${currentPage === 'register' ? 'active' : ''}`}
              onClick={() => setCurrentPage('register')}
            >
              ✍️ S'inscrire
            </button>
            <button 
              className={`nav-btn ${currentPage === 'search' ? 'active' : ''}`}
              onClick={() => setCurrentPage('search')}
            >
              🔍 Rechercher
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;