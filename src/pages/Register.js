import React, { useState } from 'react';
import PersonForm from '../components/PersonForm';
import '../styles/Register.css';

const Register = ({ onAddPerson }) => {
  const [step, setStep] = useState('choice'); // 'choice' ou 'form'
  const [selectedChoice, setSelectedChoice] = useState(''); // 'travail' ou 'formation'

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
              {/* Bouton Je travaille - toujours visible */}
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

              {/* Bouton Je ne travaille pas - toujours visible */}
              <button 
                className={`choice-button formation ${selectedChoice === 'formation' ? 'selected' : ''}`}
                onClick={() => handleChoiceSelect('formation')}
              >
                <div className="choice-icon">👤</div>
                <div className="choice-text">
                  <h3>Je ne travaille pas</h3>
                  <p>En quête d’emploi</p>
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
        />
      </div>
    </div>
  );
};

export default Register;