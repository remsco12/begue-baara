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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
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
    alert('Inscription réussie!');
    onBack(); // Retour au choix après soumission
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
            {selectedChoice === 'travail' ? '💼 Vous êtes travailleur' : '👤 Vous êtes en quête d’emploi'}
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
                    {selectedChoice === 'travail' ? 'Travailleur' : 'En quête d’emploi'}
                  </strong>
                  <small>
                    {selectedChoice === 'travail' 
                      ? 'Vous êtes actuellement en poste professionnel' 
                      : 'Vous êtes à la recherche d’un emploi'
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
            {selectedChoice === 'formation' && (
              <div className="option-fields">
                <div className="form-group">
                  <label>Profession *</label>
                  <input
                    type="text"
                    name="Profession"
                    value={formData.formation}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Mecanicien, Médecin, Enseignant..."
                  />
                </div>
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

          <section className="form-section">
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
          </section>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            ✅ S'inscrire au réseau
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonForm;