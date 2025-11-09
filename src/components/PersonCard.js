import React from 'react';
import '../styles/PersonCard.css';

const PersonCard = ({ person }) => {
  return (
    <div className="person-card">
      <div className="card-header">
        <div className="person-photo">
          {person.photo ? (
            <img src={person.photo} alt={`${person.prenom} ${person.nom}`} />
          ) : (
            <div className="photo-placeholder">
              {person.prenom?.charAt(0) || ''}{person.nom?.charAt(0) || ''}
            </div>
          )}
        </div>
        <div className="person-basic-info">
          <h3>{person.prenom} {person.nom}</h3>
          <p className="telephone">📞 {person.telephone}</p>
          <p className="location">📍 {person.quartier}, {person.region}</p>
        </div>
      </div>
      
      <div className="card-body">
        <div className="info-section">
          <div className="info-item">
            <span className="label">🏴 Pays:</span>
            <span className="value">{person.pays}</span>
          </div>
          
          {person.travail ? (
            <>
              <div className="info-item">
                <span className="label">💼 Profession:</span>
                <span className="value">{person.profession}</span>
              </div>
              <div className="info-item">
                <span className="label">🏢 Entreprise:</span>
                <span className="value">{person.entreprise}</span>
              </div>
            </>
          ) : (
            <div className="info-item">
              <span className="label">🎓 Formation:</span>
              <span className="value">{person.formation}</span>
            </div>
          )}
          
          <div className="info-item">
            <span className="label">📚 Daara:</span>
            <span className="value">{person.daara}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonCard;