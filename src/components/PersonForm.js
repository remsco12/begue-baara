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

  const confirmSubmission = () => {
    const personToAdd = {
      ...formData,
      travail: selectedChoice === 'travail'
    };
    
    onAddPerson(personToAdd);
    setFormData({
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
    setShowConfirmation(false);
    alert('Inscription réussie!');
    onBack();
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
        </div>
        
        <div className="selected-choice-banner">
          <div className={`choice-indicator ${selectedChoice}`}>
            {selectedChoice === 'travail' ? '💼 Vous êtes travailleur' : '👤 Vous êtes en quête d\'emploi'}
          </div>
        </div>
        
        <div className="form-sections">
          <section className="form-section">
            <h3>👤 Informations Personnelles</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  placeholder="Votre prénom"
                />
              </div>

              <div className="form-group">
                <label>Nom *</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Téléphone *</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required
                placeholder="Ex: +223 77 13 45 67"
              />
            </div>
          </section>

          <section className="form-section">
            <h3>📍 Localisation</h3>
            
            <div className="form-group">
              <label>Quartier *</label>
              <input
                type="text"
                name="quartier"
                value={formData.quartier}
                onChange={handleChange}
                required
                placeholder="Ex: Titibougou, Kalanba-coura..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Région *</label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Bamako, Bougouni..."
                />
              </div>

              <div className="form-group">
                <label>Pays *</label>
                <select
                  name="pays"
                  value={formData.pays}
                  onChange={handleChange}
                >
                  <option value="Mali">Mali</option>
                  <option value="Sénégal">Sénégal</option>
                  <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                  <option value="Guinée">Guinée</option>
                  <option value="France">France</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3>💼 Situation Professionnelle</h3>
            
            <div className="selected-option-display">
              <div className={`option-display ${selectedChoice}`}>
                <div className="option-display-icon">
                  {selectedChoice === 'travail' ? '💼' : '👤'}
                </div>
                <div className="option-display-text">
                  <strong>
                    {selectedChoice === 'travail' ? 'Travailleur' : 'En quête d\'emploi'}
                  </strong>
                  <small>
                    {selectedChoice === 'travail' 
                      ? 'Vous êtes actuellement en poste professionnel' 
                      : 'Vous êtes à la recherche d\'un emploi'
                    }
                  </small>
                </div>
              </div>
            </div>

            {/* Champs pour travailleurs */}
            {selectedChoice === 'travail' && (
              <div className="option-fields">
                <div className="form-group">
                  <label>Profession *</label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Informaticien, Médecin, Enseignant..."
                  />
                </div>

                <div className="form-group">
                  <label>Entreprise *</label>
                  <input
                    type="text"
                    name="entreprise"
                    value={formData.entreprise}
                    onChange={handleChange}
                    required
                    placeholder="Nom de votre entreprise"
                  />
                </div>
              </div>
            )}

            {/* Champs pour non-travailleurs */}
            {selectedChoice === 'non-travail' && (
              <div className="option-fields">
                <div className="form-group">
                  <label>Métier de formation *</label>
                  <input
                    type="text"
                    name="formation"
                    value={formData.formation}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Informatique, Mécanique, Commerce..."
                  />
                </div>

                {/*<div className="form-group">
                  <label>Niveau d'étude</label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    placeholder="Ex: Bac, Licence, Master..."
                  />
                </div>*/}
              </div>
            )}
          </section>

          <section className="form-section">
            <h3>📚 Information Daara</h3>
            
            <div className="form-group">
              <label>Nom du Daara *</label>
              <input
                type="text"
                name="daara"
                value={formData.daara}
                onChange={handleChange}
                required
                placeholder="Nom de votre Daara"
              />
            </div>
          </section>

          {/*<section className="form-section">
            <h3>🖼️ Photo de Profil</h3>
            
            <div className="form-group">
              <label>URL de la photo (optionnel)</label>
              <input
                type="url"
                name="photo"
                value={formData.photo}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </section>*/}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            ✅ Vérifier et s'inscrire
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
            </div>

            <div className="confirmation-content">
              <div className="confirmation-section">
                <h4>👤 Informations Personnelles</h4>
                <div className="confirmation-row">
                  <span className="confirmation-label">Prénom:</span>
                  <span className="confirmation-value">{getFieldDisplayValue(formData.prenom)}</span>
                </div>
                <div className="confirmation-row">
                  <span className="confirmation-label">Nom:</span>
                  <span className="confirmation-value">{getFieldDisplayValue(formData.nom)}</span>
                </div>
                <div className="confirmation-row">
                  <span className="confirmation-label">Téléphone:</span>
                  <span className="confirmation-value">{getFieldDisplayValue(formData.telephone)}</span>
                </div>
              </div>

              <div className="confirmation-section">
                <h4>📍 Localisation</h4>
                <div className="confirmation-row">
                  <span className="confirmation-label">Quartier:</span>
                  <span className="confirmation-value">{getFieldDisplayValue(formData.quartier)}</span>
                </div>
                <div className="confirmation-row">
                  <span className="confirmation-label">Région:</span>
                  <span className="confirmation-value">{getFieldDisplayValue(formData.region)}</span>
                </div>
                <div className="confirmation-row">
                  <span className="confirmation-label">Pays:</span>
                  <span className="confirmation-value">{getFieldDisplayValue(formData.pays)}</span>
                </div>
              </div>

              <div className="confirmation-section">
                <h4>💼 Situation Professionnelle</h4>
                <div className="confirmation-row">
                  <span className="confirmation-label">Statut:</span>
                  <span className="confirmation-value">
                    {selectedChoice === 'travail' ? 'Travailleur' : 'En recherche d\'emploi'}
                  </span>
                </div>
                {selectedChoice === 'travail' && (
                  <>
                    <div className="confirmation-row">
                      <span className="confirmation-label">Profession:</span>
                      <span className="confirmation-value">{getFieldDisplayValue(formData.profession)}</span>
                    </div>
                    <div className="confirmation-row">
                      <span className="confirmation-label">Entreprise:</span>
                      <span className="confirmation-value">{getFieldDisplayValue(formData.entreprise)}</span>
                    </div>
                  </>
                )}
                {selectedChoice === 'non-travail' && (
                  <>
                    <div className="confirmation-row">
                      <span className="confirmation-label">Métier de formation:</span>
                      <span className="confirmation-value">{getFieldDisplayValue(formData.formation)}</span>
                    </div>
                    <div className="confirmation-row">
                      <span className="confirmation-label">Niveau d'étude:</span>
                      <span className="confirmation-value">{getFieldDisplayValue(formData.profession)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="confirmation-section">
                <h4>📚 Information Daara</h4>
                <div className="confirmation-row">
                  <span className="confirmation-label">Nom du Daara:</span>
                  <span className="confirmation-value">{getFieldDisplayValue(formData.daara)}</span>
                </div>
              </div>

              {/*formData.photo && (
                <div className="confirmation-section">
                  <h4>🖼️ Photo de Profil</h4>
                  <div className="confirmation-row">
                    <span className="confirmation-label">URL photo:</span>
                    <span className="confirmation-value url">{formData.photo}</span>
                  </div>
                </div>
              )*/}
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={cancelSubmission}
              >
                ✏️ Modifier les informations
              </button>
              <button 
                type="button" 
                className="confirm-btn"
                onClick={confirmSubmission}
              >
                ✅ Confirmer l'inscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonForm;