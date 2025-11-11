import React, { useState } from 'react';
import PersonForm from '../components/PersonForm';

const Register = ({ onAddPerson, persons }) => {  // Ajout de persons en prop
  const [step, setStep] = useState('choice');
  const [selectedChoice, setSelectedChoice] = useState('');

  const handleChoiceSelect = (choice) => {
    setSelectedChoice(choice);
    setStep('form');
  };

  const handleBackToChoice = () => {
    setSelectedChoice('');
    setStep('choice');
  };

  if (step === 'choice') {
    return (
      <div className="register-page">
        <div className="container">
          <div className="choice-section">
            <div className="choice-header">
              <h1>🔄 Choisissez votre situation</h1>
              <p>Sélectionnez votre situation professionnelle pour commencer l'inscription</p>
            </div>
            
            <div className="choice-buttons">
              <button 
                className={`choice-button travail ${selectedChoice === 'travail' ? 'selected' : ''}`}
                onClick={() => handleChoiceSelect('travail')}
              >
                <div className="choice-icon">💼</div>
                <div className="choice-text">
                  <h3>Je travaille</h3>
                  <p>Actuellement en poste professionnel</p>
                </div>
                <div className="choice-arrow">→</div>
              </button>

              <button 
                className={`choice-button non-travail ${selectedChoice === 'non-travail' ? 'selected' : ''}`}
                onClick={() => handleChoiceSelect('non-travail')}
              >
                <div className="choice-icon">👤</div>
                <div className="choice-text">
                  <h3>Je ne travaille pas</h3>
                  <p>En quête d'emploi</p>
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
    <div className="register-page">
      <div className="container">
        <button className="back-button" onClick={handleBackToChoice}>
          ← Retour au choix
        </button>
        <PersonForm 
          onAddPerson={onAddPerson} 
          selectedChoice={selectedChoice}
          onBack={handleBackToChoice}
          persons={persons}  // Passage de la liste des personnes
        />
      </div>
    </div>
  );
};

export default Register;