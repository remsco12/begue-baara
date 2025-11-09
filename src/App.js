import React, { useState, useEffect } from "react";
import "./styles/App.css";

function App() {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedPersons = localStorage.getItem("begueBaaraPersons");
    if (savedPersons) {
      setPersons(JSON.parse(savedPersons));
    }
    setLoading(false);
  }, []);

  const addPerson = (personData) => {
    const newPerson = {
      id: Date.now(),
      ...personData,
      createdAt: new Date().toISOString()
    };
    const updatedPersons = [...persons, newPerson];
    setPersons(updatedPersons);
    localStorage.setItem("begueBaaraPersons", JSON.stringify(updatedPersons));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement de l'application Bégué Baara...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="header">
        <h1>🕌 Bégué Baara</h1>
        <p>Réseau Allah Don - Connectez plus de 100,000 membres</p>
      </header>
      <main className="main-content">
        <div className="stats">
          <div className="stat">
            <h3>{persons.length}</h3>
            <p>Membres inscrits</p>
          </div>
          <div className="stat">
            <h3>100,000+</h3>
            <p>Objectif</p>
          </div>
        </div>
        <button className="cta-button">
          Rejoindre le réseau
        </button>
      </main>
    </div>
  );
}

export default App;