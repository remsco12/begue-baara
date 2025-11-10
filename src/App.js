import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Register from './pages/Register';
import Search from './pages/Search';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedPersons = localStorage.getItem('begueBaaraPersons');
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
    localStorage.setItem('begueBaaraPersons', JSON.stringify(updatedPersons));
  };

  const renderPage = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de l'application Bégué Baara...</p>
        </div>
      );
    }

    switch(currentPage) {
      case 'home':
        return <Home persons={persons} />;
      case 'register':
        return <Register onAddPerson={addPerson} />;
      case 'search':
        return <Search persons={persons} />;
      default:
        return <Home persons={persons} />;
    }
  };

  return (
    <div className="App">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
      
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Bégué Baara</h3>
              <p>Le réseau social de la communauté Allah Don</p>
              <p>Connectant plus de {persons.length} membres</p>
            </div>
            <div className="footer-section">
              <h4>Navigation</h4>
              <button onClick={() => setCurrentPage('home')}>Accueil</button>
              <button onClick={() => setCurrentPage('register')}>S'inscrire</button>
              <button onClick={() => setCurrentPage('search')}>Rechercher</button>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>📧 contact@beguebaara.org</p>
              <p>📞 +223 76 32 64 28 / 84 26 24 87 / 92 87 73 35</p>
              <p>📍 Bougouni, Mali</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Bégué Baara. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;