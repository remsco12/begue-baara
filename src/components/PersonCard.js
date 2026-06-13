import React from 'react';
import '../styles/PersonCard.css';

const PersonCard = ({ person, showStatus = false }) => {
  const isTravailleur = person.travail === true;
  
  const getProfileColor = () => {
    return isTravailleur 
      ? { background: 'linear-gradient(135deg, #27ae60, #2ecc71)', color: '#fff' }
      : { background: 'linear-gradient(135deg, #e74c3c, #e67e22)', color: '#fff' };
  };

  const getInitials = () => {
    const prenomInitial = person.prenom ? person.prenom.charAt(0).toUpperCase() : '';
    const nomInitial = person.nom ? person.nom.charAt(0).toUpperCase() : '';
    return `${prenomInitial}${nomInitial}`;
  };

  const getGenreDisplay = () => {
    return person.genre === 'masculin' ? 'H' : person.genre === 'feminin' ? 'F' : '';
  };

  const getSituationMatrimonialeDisplay = () => {
    const situations = {
      'celibataire': 'Célibataire',
      'marie': 'Marié(e)',
      'divorce': 'Divorcé(e)',
      'veuf': 'Veuf/Veuve'
    };
    return situations[person.situationMatrimoniale] || '';
  };

  return (
    <div className={`person-card ${isTravailleur ? 'travail' : 'non-travail'}`}>
      {/* Badge de statut */}
      {showStatus && (
        <div className={`person-status ${isTravailleur ? 'status-travail' : 'status-non-travail'}`}>
          {isTravailleur ? '💼 Travaille' : '👤 Recherche'}
        </div>
      )}
      
      <div className="person-photo">
        {person.photo ? (
          <img src={person.photo} alt={`${person.prenom} ${person.nom}`} />
        ) : (
          <div 
            className="photo-placeholder"
            style={getProfileColor()}
          >
            {getInitials()}
          </div>
        )}
      </div>
      
      <div className="person-info">
        <h3>{person.prenom} {person.nom}</h3>
        
        {/* Informations démographiques */}
        <div className="person-demographics">
          {person.genre && (
            <span className="person-genre">
              {getGenreDisplay()}
            </span>
          )}
          {person.situationMatrimoniale && (
            <span className="person-situation-matrimoniale">
              {getSituationMatrimonialeDisplay()}
            </span>
          )}
        </div>
        
        <p className="person-phone">📞 {person.telephone}</p>
        <p className="person-location">📍 {person.quartier}, {person.region}</p>
        
        {isTravailleur ? (
          <>
            <p className="person-profession">💼 {person.profession}</p>
            <p className="person-entreprise">🏢 {person.entreprise}</p>
          </>
        ) : (
          <>
            <p className="person-formation">🎓 {person.formation}</p>
            {person.profession && <p className="person-niveau">📚 {person.profession}</p>}
          </>
        )}
        
        <p className="person-daara">📚 {person.daara}</p>
      </div>
    </div>
  );
};

export default PersonCard;