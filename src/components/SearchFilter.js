import React from 'react';
import '../styles/SearchFilter.css';

const SearchFilter = ({ filters, onFilterChange, selectedSituation }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ target: { name, value } });
  };

  return (
    <div className="search-filters">
      <div className="filters-header">
        <h3>🔍 Filtres de Recherche</h3>
        {selectedSituation && (
          <div className="selected-situation">
            Recherche : {selectedSituation === 'travail' ? 'Travailleurs' : 
                        selectedSituation === 'formation' ? 'En formation' : 'Tous les membres'}
          </div>
        )}
      </div>

      <div className="filter-group">
        <label>Recherche globale</label>
        <input
          type="text"
          name="searchTerm"
          value={filters.searchTerm}
          onChange={handleInputChange}
          placeholder="Nom, prénom, téléphone..."
          className="filter-input"
        />
      </div>

      {/* Filtres spécifiques aux travailleurs */}
      {selectedSituation === 'travail' && (
        <>
          <div className="filter-group">
            <label>🔍 Recherche par profession</label>
            <input
              type="text"
              name="profession"
              value={filters.profession}
              onChange={handleInputChange}
              placeholder="Ex: Informaticien, Médecin, Enseignant..."
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>🏢 Recherche par entreprise</label>
            <input
              type="text"
              name="entreprise"
              value={filters.entreprise}
              onChange={handleInputChange}
              placeholder="Nom de l'entreprise"
              className="filter-input"
            />
          </div>
        </>
      )}

      {/* Filtres spécifiques aux personnes en formation */}
      {selectedSituation === 'formation' && (
        <div className="filter-group">
          <label>🎓 Recherche par formation</label>
          <input
            type="text"
            name="formation"
            value={filters.formation}
            onChange={handleInputChange}
            placeholder="Ex: Étudiant en Médecine, Formation en Informatique..."
            className="filter-input"
          />
        </div>
      )}

      {/* Filtre profession pour "Tous les membres" ou mixte */}
      {(selectedSituation === 'tous' || !selectedSituation) && (
        <div className="filter-group">
          <label>💼 Profession (tous types)</label>
          <input
            type="text"
            name="profession"
            value={filters.profession}
            onChange={handleInputChange}
            placeholder="Ex: Informaticien, Médecin, Étudiant..."
            className="filter-input"
          />
        </div>
      )}

      <div className="filter-group">
        <label>📍 Région</label>
        <input
          type="text"
          name="region"
          value={filters.region}
          onChange={handleInputChange}
          placeholder="Ex: Dakar, Thiès..."
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label>🏘️ Quartier</label>
        <input
          type="text"
          name="quartier"
          value={filters.quartier}
          onChange={handleInputChange}
          placeholder="Ex: HLM, Grand Yoff..."
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label>📚 Daara</label>
        <input
          type="text"
          name="daara"
          value={filters.daara}
          onChange={handleInputChange}
          placeholder="Nom du Daara"
          className="filter-input"
        />
      </div>
    </div>
  );
};

export default SearchFilter;