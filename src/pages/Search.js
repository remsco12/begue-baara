import React, { useState } from 'react';
import SearchResults from '../components/SearchResults';
import '../styles/Search.css';

const Search = ({ persons }) => {
  const [step, setStep] = useState('choice'); // 'choice' ou 'results'
  const [selectedSituation, setSelectedSituation] = useState('');

  const handleChoiceSelect = (situation) => {
    setSelectedSituation(situation);
    setStep('results');
  };

  const handleBackToChoice = () => {
    setSelectedSituation('');
    setStep('choice');
  };

  if (step === 'choice') {
    return (
      <div className="search-page">
        <div className="container">
          <div className="choice-section">
            <div className="choice-header">
              <h1>🔍 Type de recherche</h1>
              <p>Choisissez le type de membres que vous souhaitez rechercher</p>
            </div>
            
            <div className="choice-buttons">
              <button 
                className={`choice-button travail ${selectedSituation === 'travail' ? 'selected' : ''}`}
                onClick={() => handleChoiceSelect('travail')}
              >
                <div className="choice-icon">💼</div>
                <div className="choice-text">
                  <h3>Travailleurs</h3>
                  <p>Personnes actuellement en emploi</p>
                </div>
                <div className="choice-arrow">→</div>
              </button>

              <button 
                className={`choice-button formation ${selectedSituation === 'formation' ? 'selected' : ''}`}
                onClick={() => handleChoiceSelect('formation')}
              >
                <div className="choice-icon">👤</div>
                <div className="choice-text">
                  <h3>En quête d’emploi</h3>
                  <p>Personnes en quête d’emploi</p>
                </div>
                <div className="choice-arrow">→</div>
              </button>

              <button 
                className={`choice-button tous ${selectedSituation === 'tous' ? 'selected' : ''}`}
                onClick={() => handleChoiceSelect('tous')}
              >
                <div className="choice-icon">👥</div>
                <div className="choice-text">
                  <h3>Tous les membres</h3>
                  <p>Rechercher parmi tous les inscrits</p>
                </div>
                <div className="choice-arrow">→</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="container">
        <button className="back-button" onClick={handleBackToChoice}>
          ← Changer le type de recherche
        </button>
        <SearchResults 
          persons={persons} 
          selectedSituation={selectedSituation}
        />
      </div>
    </div>
  );
};

export default Search;