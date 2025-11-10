import React, { useState, useMemo } from 'react';
import SearchFilter from './SearchFilter';
import PersonCard from './PersonCard';
import '../styles/Search.css';

const SearchResults = ({ persons, selectedSituation }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    profession: '',
    entreprise: '',
    formation: '',
    region: '',
    quartier: '',
    daara: ''
  });

  const filteredPersons = useMemo(() => {
    return persons.filter(person => {
      const matchesSearch = filters.searchTerm === '' || 
        Object.values(person).some(value => 
          String(value).toLowerCase().includes(filters.searchTerm.toLowerCase())
        );

      const matchesSituation = selectedSituation === 'tous' ||
                               (selectedSituation === 'travail' && person.travail === true) ||
                               (selectedSituation === 'non-travail' && person.travail === false);

      // Filtre profession pour tous les types
      const matchesProfession = filters.profession === '' || 
        (person.profession && person.profession.toLowerCase().includes(filters.profession.toLowerCase()));

      // Filtre entreprise spécifique aux travailleurs
      const matchesEntreprise = filters.entreprise === '' || 
        (person.entreprise && person.entreprise.toLowerCase().includes(filters.entreprise.toLowerCase()));

      // Filtre formation spécifique aux non-travailleurs
      const matchesFormation = filters.formation === '' || 
        (person.formation && person.formation.toLowerCase().includes(filters.formation.toLowerCase()));

      const matchesRegion = filters.region === '' || 
        (person.region && person.region.toLowerCase().includes(filters.region.toLowerCase()));

      const matchesQuartier = filters.quartier === '' || 
        (person.quartier && person.quartier.toLowerCase().includes(filters.quartier.toLowerCase()));

      const matchesDaara = filters.daara === '' || 
        (person.daara && person.daara.toLowerCase().includes(filters.daara.toLowerCase()));

      return matchesSearch && 
             matchesSituation && 
             matchesProfession && 
             matchesEntreprise && 
             matchesFormation && 
             matchesRegion && 
             matchesQuartier && 
             matchesDaara;
    });
  }, [persons, filters, selectedSituation]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getSituationTitle = () => {
    switch(selectedSituation) {
      case 'travail': return 'Travailleurs';
      case 'non-travail': return 'Personnes en quête d\'emploi';
      case 'tous': return 'Tous les membres';
      default: return 'Résultats';
    }
  };

  // Compter les travailleurs et non-travailleurs pour l'affichage "Tous les membres"
  const stats = useMemo(() => {
    if (selectedSituation === 'tous') {
      const travailleurs = filteredPersons.filter(person => person.travail === true).length;
      const nonTravailleurs = filteredPersons.filter(person => person.travail === false).length;
      return { travailleurs, nonTravailleurs };
    }
    return { travailleurs: 0, nonTravailleurs: 0 };
  }, [filteredPersons, selectedSituation]);

  return (
    <div className="search-results">
      <div className="results-header">
        <h1>🔍 {getSituationTitle()}</h1>
        <p>Filtrez les résultats selon vos critères</p>
        
        {/* Statistiques pour "Tous les membres" */}
        {selectedSituation === 'tous' && (
          <div className="members-stats">
            <div className="stat-item travail-stat">
              <span className="stat-icon">💼</span>
              <span className="stat-count">{stats.travailleurs}</span>
              <span className="stat-label">Travailleurs</span>
            </div>
            <div className="stat-item non-travail-stat">
              <span className="stat-icon">👤</span>
              <span className="stat-count">{stats.nonTravailleurs}</span>
              <span className="stat-label">En recherche</span>
            </div>
          </div>
        )}
      </div>

      <div className="search-content">
        <div className="filters-sidebar">
          <SearchFilter 
            filters={filters} 
            onFilterChange={handleFilterChange}
            selectedSituation={selectedSituation}
          />
        </div>

        <div className="results-main">
          <div className="results-info">
            <h3>{filteredPersons.length} membre(s) trouvé(s)</h3>
            {selectedSituation && (
              <p className="search-type">
                Type : <strong>
                  {selectedSituation === 'travail' ? 'Travailleurs' : 
                   selectedSituation === 'non-travail' ? 'Non travailleurs' : 'Tous les membres'}
                </strong>
              </p>
            )}
          </div>

          <div className="persons-grid">
            {filteredPersons.map(person => (
              <PersonCard 
                key={person.id} 
                person={person} 
                showStatus={selectedSituation === 'tous'} // Afficher le statut seulement pour "Tous les membres"
              />
            ))}
          </div>

          {filteredPersons.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">
                {selectedSituation === 'travail' ? '💼' : 
                 selectedSituation === 'non-travail' ? '👤' : '🔍'}
              </div>
              <h3>Aucun membre ne correspond à votre recherche</h3>
              <p>Essayez de modifier vos critères de recherche ou élargissez vos filtres</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;