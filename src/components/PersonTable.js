import React from 'react';
import '../styles/PersonTable.css';

const PersonTable = ({ persons, onSort, sortConfig }) => {
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '⬆️' : '⬇️';
  };

  const getGenreDisplay = (genre) => {
    return genre === 'masculin' ? 'H' : genre === 'feminin' ? 'F' : '';
  };

  const getSituationMatrimonialeDisplay = (situation) => {
    const situations = {
      'celibataire': 'Célibataire',
      'marie': 'Marié(e)',
      'divorce': 'Divorcé(e)',
      'veuf': 'Veuf/Veuve'
    };
    return situations[situation] || '';
  };

  return (
    <div className="person-table-container">
      <div className="table-responsive">
        <table className="person-table">
          <thead>
            <tr>
              <th onClick={() => onSort('prenom')} className="sortable">
                Prénom {getSortIcon('prenom')}
              </th>
              <th onClick={() => onSort('nom')} className="sortable">
                Nom {getSortIcon('nom')}
              </th>
              <th>Genre</th>
              <th>Situation</th>
              <th>Téléphone</th>
              <th>Localisation</th>
              <th onClick={() => onSort('profession')} className="sortable">
                Profession/Formation {getSortIcon('profession')}
              </th>
              <th>Entreprise</th>
              <th>Daara</th>
            </tr>
          </thead>
          <tbody>
            {persons.map(person => (
              <tr 
                key={person.id} 
                className={`table-row ${person.travail ? 'travail-row' : 'non-travail-row'}`}
              >
                <td className="person-name" data-label="Prénom">
                  <strong>{person.prenom}</strong>
                </td>
                <td className="person-name" data-label="Nom">
                  <strong>{person.nom}</strong>
                </td>
                <td className="person-genre" data-label="Genre">
                  <span className={`genre-badge ${person.genre || 'unknown'}`}>
                    {getGenreDisplay(person.genre)}
                  </span>
                </td>
                <td className="person-situation" data-label="Situation matrimoniale">
                  {getSituationMatrimonialeDisplay(person.situationMatrimoniale)}
                </td>
                <td className="person-phone" data-label="Téléphone">
                  {person.telephone}
                </td>
                <td className="person-location" data-label="Localisation">
                  <div className="location-main">{person.quartier}</div>
                  <div className="location-detail">{person.region}, {person.pays}</div>
                </td>
                <td className="person-profession" data-label={person.travail ? "Profession" : "Formation"}>
                  {person.travail ? person.profession : person.formation}
                </td>
                <td className="person-entreprise" data-label="Entreprise">
                  {person.entreprise || '-'}
                </td>
                <td className="person-daara" data-label="Daara">
                  {person.daara}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PersonTable;