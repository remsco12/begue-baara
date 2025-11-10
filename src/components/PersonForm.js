import React, { useState } from 'react';
import '../styles/PersonForm.css';

const PersonForm = ({ onAddPerson, selectedChoice, onBack }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    quartier: '',
    region: '',
    pays: 'Mali',
    profession: '',
    entreprise: '',
    formation: '',
    daara: '',
    photo: ''
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmSubmission = async () => {
    setIsSubmitting(true);
    
    const personToAdd = {
      nom: formData.nom,
      prenom: formData.prenom,
      telephone: formData.telephone,
      quartier: formData.quartier,
      region: formData.region,
      pays: formData.pays,
      profession: formData.profession,
      entreprise: formData.entreprise,
      formation: formData.formation,
      daara: formData.daara,
      travail: selectedChoice === 'travail'
    };

    const result = await onAddPerson(personToAdd);
    
    if (result.success) {
      setFormData({
        nom: '', prenom: '', telephone: '', quartier: '', region: '',
        pays: 'Mali', profession: '', entreprise: '', formation: '', daara: '', photo: ''
      });
      setShowConfirmation(false);
      alert('Inscription réussie! Votre profil est maintenant visible par tous.');
      onBack();
    } else {
      alert('Erreur: ' + result.error);
    }
    
    setIsSubmitting(false);
  };

  const cancelSubmission = () => {
    setShowConfirmation(false);
  };

  const getFieldDisplayValue = (value) => {
    return value || 'Non renseigné';
  };

  return (
    <div className="form-container">
      <form className="person-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>📝 Inscription - {selectedChoice === 'travail' ? 'Travailleur' : 'Non travailleur'}</h2>
          <p>Complétez vos informations pour rejoindre le réseau</p>
          <div className="network-notice">
            🌐 Votre profil sera visible par tous les membres
          </div>
        </div>
        
        {/* ... reste du formulaire inchangé ... */}
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Envoi en cours...' : '✅ Vérifier et s\'inscrire'}
          </button>
        </div>
      </form>

      {/* Modal de confirmation */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <h3>🔍 Vérifiez vos informations</h3>
              <p>Confirmez que toutes les informations sont correctes avant de vous inscrire</p>
              <div className="public-notice">
                🌍 Ces informations seront publiques dans le réseau
              </div>
            </div>

            {/* ... contenu de la confirmation inchangé ... */}

            <div className="modal-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={cancelSubmission}
                disabled={isSubmitting}
              >
                ✏️ Modifier les informations
              </button>
              <button 
                type="button" 
                className="confirm-btn"
                onClick={confirmSubmission}
                disabled={isSubmitting}
              >
                {isSubmitting ? '⏳ Enregistrement...' : '✅ Confirmer l\'inscription'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonForm;