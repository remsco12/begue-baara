import React, { useState, useMemo, useEffect } from 'react';
import SearchFilter from './SearchFilter';
import PersonCard from './PersonCard';
import PersonTable from './PersonTable';
import '../styles/Search.css';

const SearchResults = ({ persons, selectedSituation, onDeletePerson }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    genre: '',
    situationMatrimoniale: '',
    profession: '',
    entreprise: '',
    formation: '',
    region: '',
    quartier: '',
    daara: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' ou 'table'
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleDeletePerson = async (personId, personName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${personName} ?`)) {
      const result = await onDeletePerson(personId);
      if (result.success) {
        alert('Membre supprimé avec succès');
        setCurrentPage(1); // Retour à la première page après suppression
      }
    }
  };

  // Fonction de tri
  const sortedAndFilteredPersons = useMemo(() => {
    let filtered = persons.filter(person => {
      const matchesSearch = filters.searchTerm === '' || 
        Object.values(person).some(value => 
          String(value).toLowerCase().includes(filters.searchTerm.toLowerCase())
        );

      const matchesSituation = selectedSituation === 'tous' ||
                               (selectedSituation === 'travail' && person.travail === true) ||
                               (selectedSituation === 'non-travail' && person.travail === false);

      const matchesGenre = filters.genre === '' || 
        (person.genre && person.genre === filters.genre);

      const matchesSituationMatrimoniale = filters.situationMatrimoniale === '' || 
        (person.situationMatrimoniale && person.situationMatrimoniale === filters.situationMatrimoniale);

      const matchesProfession = filters.profession === '' || 
        (person.profession && person.profession.toLowerCase().includes(filters.profession.toLowerCase()));

      const matchesEntreprise = filters.entreprise === '' || 
        (person.entreprise && person.entreprise.toLowerCase().includes(filters.entreprise.toLowerCase()));

      const matchesFormation = filters.formation === '' || 
        (person.formation && person.formation.toLowerCase().includes(filters.formation.toLowerCase()));

      const matchesRegion = filters.region === '' || 
        (person.region && person.region.toLowerCase().includes(filters.region.toLowerCase()));

      const matchesQuartier = filters.quartier === '' || 
        (person.quartier && person.quartier.toLowerCase().includes(filters.quartier.toLowerCase()));

      const matchesDaara = filters.daara === '' || 
        (person.daara && person.daara.toLowerCase().includes(filters.daara.toLowerCase()));

      return matchesSearch && matchesSituation && matchesGenre &&
             matchesSituationMatrimoniale && matchesProfession && 
             matchesEntreprise && matchesFormation && matchesRegion && 
             matchesQuartier && matchesDaara;
    });

    // Tri
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [persons, filters, selectedSituation, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedAndFilteredPersons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedAndFilteredPersons.slice(startIndex, startIndex + itemsPerPage);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, selectedSituation]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
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

  // Statistiques
  const stats = useMemo(() => {
    if (selectedSituation === 'tous') {
      const travailleurs = sortedAndFilteredPersons.filter(person => person.travail === true).length;
      const nonTravailleurs = sortedAndFilteredPersons.filter(person => person.travail === false).length;
      const hommes = sortedAndFilteredPersons.filter(person => person.genre === 'masculin').length;
      const femmes = sortedAndFilteredPersons.filter(person => person.genre === 'feminin').length;
      
      return { travailleurs, nonTravailleurs, hommes, femmes };
    }
    return { travailleurs: 0, nonTravailleurs: 0, hommes: 0, femmes: 0 };
  }, [sortedAndFilteredPersons, selectedSituation]);

  return (
    <div className="search-results">
      <div className="results-header">
        <h1>🔍 {getSituationTitle()}</h1>
        <p>Filtrez les résultats selon vos critères</p>
        
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
              <span className="stat-label">Non travailleur</span>
            </div>
            <div className="stat-item homme-stat">
              <span className="stat-icon">👨</span>
              <span className="stat-count">{stats.hommes}</span>
              <span className="stat-label">Hommes</span>
            </div>
            <div className="stat-item femme-stat">
              <span className="stat-icon">👩</span>
              <span className="stat-count">{stats.femmes}</span>
              <span className="stat-label">Femmes</span>
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
          <div className="results-controls">
            <div className="results-info">
              <h3>{sortedAndFilteredPersons.length} membre(s) trouvé(s)</h3>
              {selectedSituation && (
                <p className="search-type">
                  Type : <strong>
                    {selectedSituation === 'travail' ? 'Travailleurs' : 
                     selectedSituation === 'non-travail' ? 'Non travailleurs' : 'Tous les membres'}
                  </strong>
                </p>
              )}
            </div>

            <div className="view-controls">
              <div className="view-buttons">
                <button 
                  className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
                  onClick={() => setViewMode('cards')}
                >
                  🃏 Cartes
                </button>
                <button 
                  className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                >
                  📊 Tableau
                </button>
              </div>

              <div className="pagination-controls">
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="page-size-select"
                >
                  <option value={10}>10 par page</option>
                  <option value={20}>20 par page</option>
                  <option value={50}>50 par page</option>
                  <option value={100}>100 par page</option>
                </select>
              </div>
            </div>
          </div>

          {/* Affichage selon le mode */}
          {viewMode === 'cards' ? (
            <div className="persons-grid">
              {currentItems.map(person => (
                <PersonCard 
                  key={person.id} 
                  person={person} 
                  showStatus={selectedSituation === 'tous'}
                  onDelete={handleDeletePerson}
                />
              ))}
            </div>
          ) : (
            <PersonTable 
              persons={currentItems}
              onSort={handleSort}
              sortConfig={sortConfig}
              onDelete={handleDeletePerson}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                ◀ Précédent
              </button>
              
              <span className="pagination-info">
                Page {currentPage} sur {totalPages}
              </span>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Suivant ▶
              </button>
            </div>
          )}

          {sortedAndFilteredPersons.length === 0 && (
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