import React from 'react';
import '../styles/Home.css';

const Home = ({ persons }) => {
  const recentPersons = persons.slice(-6).reverse();
  const totalMembers = persons.length;

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Bienvenue sur Bégué Baara</h1>
              <p className="hero-subtitle">
                Le réseau social qui connecte la communauté Groupe Allah Don
              </p>
              <p className="hero-description">
                Rejoignez {totalMembers} membres inscrits et connectez-vous 
                avec des personnes partageant les mêmes valeurs.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">{totalMembers}</div>
                  <div className="stat-label">Membres inscrits</div>
                </div>
                <div className="stat">
                  <div className="stat-number">100,000+</div>
                  <div className="stat-label">Objectif</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2>Ce que vous pouvez faire</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Trouver des Compétences</h3>
              <p>Recherchez des personnes par profession ou région</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Établir des Contacts</h3>
              <p>Connectez-vous avec des membres partageant vos intérêts</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;