import React, { useState } from 'react';
import '../styles/PersonForm.css';

const PersonForm = ({ onAddPerson, selectedChoice, onBack, persons }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    quartier: '',
    region: '',
    pays: 'Mali',
    genre: '',
    situationMatrimoniale: '',
    profession: '',
    entreprise: '',
    formation: '',
    daara: ''
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur quand l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Fonction pour vérifier les doublons complets
  const checkForCompleteDuplicates = () => {
    const newErrors = {};
    
    if (selectedChoice === 'travail') {
      // Vérification pour les travailleurs: prenom, nom, profession, entreprise, telephone
      const duplicateTravailleur = persons.find(person => 
        person.travail === true &&
        person.prenom?.toLowerCase() === formData.prenom.toLowerCase() &&
        person.nom?.toLowerCase() === formData.nom.toLowerCase() &&
        person.profession?.toLowerCase() === formData.profession.toLowerCase() &&
        person.entreprise?.toLowerCase() === formData.entreprise.toLowerCase() &&
        person.telephone === formData.telephone
      );
      
      if (duplicateTravailleur) {
        newErrors.profession = `🚫 Doublon détecté ! \n\n${formData.prenom} ${formData.nom} est déjà enregistré avec :\n• Profession: ${formData.profession}\n• Entreprise: ${formData.entreprise}\n• Téléphone: ${formData.telephone}\n\nVeuillez modifier ces informations.`;
      }
    }
    
    if (selectedChoice === 'non-travail') {
      // Vérification pour les non-travailleurs: prenom, nom, formation, telephone
      const duplicateNonTravailleur = persons.find(person => 
        person.travail === false &&
        person.prenom?.toLowerCase() === formData.prenom.toLowerCase() &&
        person.nom?.toLowerCase() === formData.nom.toLowerCase() &&
        person.formation?.toLowerCase() === formData.formation.toLowerCase() &&
        person.telephone === formData.telephone
      );
      
      if (duplicateNonTravailleur) {
        newErrors.formation = `🚫 Doublon détecté ! \n\n${formData.prenom} ${formData.nom} est déjà enregistré avec :\n• Métier de formation: ${formData.formation}\n• Téléphone: ${formData.telephone}\n\nVeuillez modifier ces informations.`;
      }
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Vérifier que tous les champs requis sont remplis
    if (selectedChoice === 'travail' && (!formData.profession || !formData.entreprise)) {
      setErrors({ profession: 'Veuillez remplir tous les champs requis pour les travailleurs' });
      return;
    }
    
    if (selectedChoice === 'non-travail' && !formData.formation) {
      setErrors({ formation: 'Veuillez remplir le métier de formation' });
      return;
    }
    
    // Vérifier les doublons complets avant d'afficher la confirmation
    const duplicateErrors = checkForCompleteDuplicates();
    
    if (Object.keys(duplicateErrors).length > 0) {
      setErrors(duplicateErrors);
      return;
    }
    
    setErrors({});
    setShowConfirmation(true);
  };

  const confirmSubmission = async () => {
    // Vérifier une dernière fois les doublons avant l'envoi
    const duplicateErrors = checkForCompleteDuplicates();
    
    if (Object.keys(duplicateErrors).length > 0) {
      setErrors(duplicateErrors);
      setShowConfirmation(false);
      return;
    }
    
    setIsSubmitting(true);
    
    const personToAdd = {
      nom: formData.nom,
      prenom: formData.prenom,
      telephone: formData.telephone,
      quartier: formData.quartier,
      region: formData.region,
      pays: formData.pays,
      genre: formData.genre,
      situationMatrimoniale: formData.situationMatrimoniale,
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
        pays: 'Mali', genre: '', situationMatrimoniale: '', profession: '', entreprise: '', 
        formation: '', daara: ''
      });
      setShowConfirmation(false);
      setErrors({});
      alert('✅ Inscription réussie ! Votre profil est maintenant visible par tous.');
      onBack();
    } else {
      alert('❌ Erreur: ' + result.error);
    }
    
    setIsSubmitting(false);
  };

  const cancelSubmission = () => {
    setShowConfirmation(false);
  };

  const getFieldDisplayValue = (value) => {
    return value || 'Non renseigné';
  };

  const getGenreLabel = (value) => {
    const genres = {
      'masculin': 'Masculin',
      'feminin': 'Féminin',
      '': 'Non renseigné'
    };
    return genres[value] || value;
  };

  const getSituationMatrimonialeLabel = (value) => {
    const situations = {
      'celibataire': 'Célibataire',
      'marie': 'Marié(e)',
      'divorce': 'Divorcé(e)',
      'veuf': 'Veuf/Veuve',
      '': 'Non renseigné'
    };
    return situations[value] || value;
  };

  return (
    <div className="form-container">
      <form className="person-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>📝 Inscription - {selectedChoice === 'travail' ? 'Travailleur' : 'Non travailleur'}</h2>
          <p>Complétez vos informations pour rejoindre le réseau</p>
         {/* <div className="network-notice">
            🌐 Votre profil sera visible par tous les membres
          </div>
          
           {Message d'information sur les doublons }
          <div className="duplicate-warning">
            ⚠️ Le système vérifie les doublons complets (Prénom + Nom + Métier + Téléphone)
          </div>*/}
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
                  className={errors.profession || errors.formation ? 'input-warning' : ''}
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
                  className={errors.profession || errors.formation ? 'input-warning' : ''}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Genre</label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                >
                  <option value="">Choisir...</option>
                  <option value="masculin">👨 Masculin</option>
                  <option value="feminin">👩 Féminin</option>
                </select>
              </div>

              <div className="form-group">
                <label>Situation matrimoniale</label>
                <select
                  name="situationMatrimoniale"
                  value={formData.situationMatrimoniale}
                  onChange={handleChange}
                >
                  <option value="">Choisir...</option>
                  <option value="celibataire">Célibataire</option>
                  <option value="marie">Marié(e)</option>
                  <option value="divorce">Divorcé(e)</option>
                  <option value="veuf">Veuf/Veuve</option>
                </select>
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
                className={errors.profession || errors.formation ? 'input-warning' : ''}
              />
              {(errors.profession || errors.formation) && (
                <div className="field-warning">
                  Le téléphone fait partie des critères de vérification des doublons
                </div>
              )}
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
                    className={errors.profession ? 'input-error' : ''}
                  />
                  {errors.profession && (
                    <div className="error-message duplicate-error">
                      {errors.profession.split('\n').map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                  )}
                  <div className="field-info">
                    💡 Vérification: Prénom + Nom + Profession + Entreprise + Téléphone
                  </div>
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
                    className={errors.profession ? 'input-warning' : ''}
                  />
                  {errors.profession && (
                    <div className="field-warning">
                      L'entreprise fait partie des critères de vérification
                    </div>
                  )}
                </div>
              </div>
            )}

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
                    className={errors.formation ? 'input-error' : ''}
                  />
                  {errors.formation && (
                    <div className="error-message duplicate-error">
                      {errors.formation.split('\n').map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                  )}
                  <div className="field-info">
                    💡 Vérification: Prénom + Nom + Métier de formation + Téléphone
                  </div>
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
        </div>

        {/* Affichage des erreurs générales */}
        {(errors.profession || errors.formation) && (
          <div className="global-error">
            <h4>🚫 Inscription impossible - Doublon détecté</h4>
            <p>Cette combinaison existe déjà dans la base de données.</p>
            <p>Veuillez modifier les informations en surbrillance.</p>
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting || Object.keys(errors).length > 0}
          >
            {isSubmitting ? '⏳ Vérification...' : '✅ Vérifier et s\'inscrire'}
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
              
              {/* Message de confirmation de non-doublon */}
              <div className="duplicate-check-success">
                ✅ Aucun doublon détecté - Inscription autorisée
              </div>
            </div>

            <div className="confirmation-content">
              {/* Le contenu reste le même */}
              {/* ... */}
            </div>

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