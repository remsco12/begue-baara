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
                               (selectedSituation === 'formation' && person.travail === false);

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
        person.region.toLowerCase().includes(filters.region.toLowerCase());

      const matchesQuartier = filters.quartier === '' || 
        person.quartier.toLowerCase().includes(filters.quartier.toLowerCase());

      const matchesDaara = filters.daara === '' || 
        person.daara.toLowerCase().includes(filters.daara.toLowerCase());

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
      case 'formation': return 'Personnes en formation';
      case 'tous': return 'Tous les membres';
      default: return 'Résultats';
    }
  };

  return (
    <div className="search-results">
      <div className="results-header">
        <h1>🔍 {getSituationTitle()}</h1>
        <p>Filtrez les résultats selon vos critères</p>
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
                   selectedSituation === 'formation' ? 'En formation' : 'Tous les membres'}
                </strong>
              </p>
            )}
          </div>

          <div className="persons-grid">
            {filteredPersons.map(person => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>

          {filteredPersons.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">
                {selectedSituation === 'travail' ? '💼' : 
                 selectedSituation === 'formation' ? '🎓' : '🔍'}
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