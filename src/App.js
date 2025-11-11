import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import './styles/App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Register from './pages/Register';
import Search from './pages/Search';

// Fonction de mapping centralisée
const mapPersonFromSupabase = (person) => ({
  id: person.id,
  nom: person.nom,
  prenom: person.prenom,
  telephone: person.telephone,
  quartier: person.quartier,
  region: person.region,
  pays: person.pays,
  genre: person.genre,
  situationMatrimoniale: person.situation_matrimoniale, // Mapping du underscore vers camelCase
  profession: person.profession,
  entreprise: person.entreprise,
  formation: person.formation,
  daara: person.daara,
  travail: person.travail,
  created_at: person.created_at
});

// Fonction inverse pour l'ajout
const mapPersonToSupabase = (personData) => ({
  nom: personData.nom,
  prenom: personData.prenom,
  telephone: personData.telephone,
  quartier: personData.quartier,
  region: personData.region,
  pays: personData.pays,
  genre: personData.genre || null,
  situation_matrimoniale: personData.situationMatrimoniale || null, // camelCase vers underscore
  profession: personData.profession || null,
  entreprise: personData.entreprise || null,
  formation: personData.formation || null,
  daara: personData.daara,
  travail: personData.travail
});

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données depuis Supabase
  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Chargement des données depuis Supabase...');
      
      const { data, error } = await supabase
        .from('persons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        throw error;
      }
      
      // APPLICATION DU MAPPAGE
      const mappedData = (data || []).map(mapPersonFromSupabase);
      
      console.log('✅ Données chargées et mappées:', mappedData.length, 'personnes');
      console.log('📋 Exemple de données mappées:', mappedData[0]);
      
      setPersons(mappedData);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      setError('Erreur de connexion à la base de données');
      
      // Fallback: charger depuis localStorage
      const savedPersons = localStorage.getItem('begueBaaraPersons');
      if (savedPersons) {
        try {
          const localData = JSON.parse(savedPersons);
          console.log('📁 Données locales chargées:', localData.length, 'personnes');
          setPersons(localData);
        } catch (e) {
          console.error('❌ Erreur données locales:', e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const addPerson = async (personData) => {
    try {
      setError(null);
      console.log('➕ Tentative d\'ajout:', personData);
      
      // Utilisation du mapping pour Supabase
      const supabaseData = mapPersonToSupabase(personData);

      console.log('📤 Envoi à Supabase:', supabaseData);

      const { data, error } = await supabase
        .from('persons')
        .insert([supabaseData])
        .select();

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('Aucune donnée retournée par Supabase');
      }
      
      // Mapping de la réponse
      const newPerson = mapPersonFromSupabase(data[0]);
      console.log('✅ Personne ajoutée avec succès:', newPerson);
      
      // Mise à jour IMMÉDIATE de l'état local
      setPersons(prev => {
        const updated = [newPerson, ...prev];
        console.log('🔄 Liste mise à jour:', updated.length, 'personnes');
        return updated;
      });
      
      // Sauvegarde locale en backup
      try {
        const updatedPersons = [newPerson, ...persons];
        localStorage.setItem('begueBaaraPersons', JSON.stringify(updatedPersons));
        console.log('💾 Sauvegarde locale réussie');
      } catch (e) {
        console.error('❌ Erreur sauvegarde locale:', e);
      }
      
      return { success: true, data: newPerson };
      
    } catch (error) {
      console.error('❌ Erreur complète lors de l\'ajout:', error);
      
      // Fallback: sauvegarde locale avec mapping
      console.log('🔄 Utilisation du mode fallback local...');
      const newPerson = {
        ...mapPersonFromSupabase({
          id: Date.now().toString(),
          ...mapPersonToSupabase(personData),
          created_at: new Date().toISOString()
        })
      };
      
      const updatedPersons = [newPerson, ...persons];
      setPersons(updatedPersons);
      
      try {
        localStorage.setItem('begueBaaraPersons', JSON.stringify(updatedPersons));
        console.log('✅ Fallback local réussi:', newPerson);
      } catch (e) {
        console.error('❌ Erreur fallback local:', e);
      }
      
      return { success: true, data: newPerson };
    }
  };

  const deletePerson = async (personId) => {
    try {
      const { error } = await supabase
        .from('persons')
        .delete()
        .eq('id', personId);

      if (error) throw error;
      
      // Mise à jour immédiate de l'état local
      setPersons(prev => prev.filter(p => p.id !== personId));
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      return { success: false, error: error.message };
    }
  };

  // ... Le reste du code reste inchangé
  const renderPage = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de l'application Bégué Baara...</p>
        </div>
      );
    }

    if (error && persons.length === 0) {
      return (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Erreur de connexion</h3>
          <p>{error}</p>
          <p>Utilisation du mode hors ligne avec les données locales.</p>
          <button onClick={fetchPersons} className="btn-retry">
            🔄 Réessayer la connexion
          </button>
        </div>
      );
    }

    switch(currentPage) {
      case 'home':
        return <Home persons={persons} />;
      case 'register':
        return <Register onAddPerson={addPerson} persons={persons} />;
      case 'search':
        return <Search persons={persons} onDeletePerson={deletePerson} />;
      default:
        return <Home persons={persons} />;
    }
  };

  return (
    <div className="App">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
      
      {/* Debug info - À activer temporairement pour vérifier 
      <div style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        <div>🔍 Debug: {persons.length} personnes</div>
        <div>📱 Page: {currentPage}</div>
        <div>💍 Situation matrimoniale: {persons[0]?.situationMatrimoniale || 'Non définie'}</div>
      </div>  */}
      
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Bégué Baara</h3>
              <p>Le réseau social de la communauté Allah Don</p>
              <p>Connectant plus de {persons.length} membres</p>
            </div>
            <div className="footer-section">
              <h4>Navigation</h4>
              <button onClick={() => setCurrentPage('home')}>Accueil</button>
              <button onClick={() => setCurrentPage('register')}>S'inscrire</button>
              <button onClick={() => setCurrentPage('search')}>Rechercher</button>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>📧 contact@beguebaara.org</p>
              <p>📞 +223 76 32 64 28 / 75 23 48 44 / 92 87 73 35</p>
              <p>📍 Bougouni, Mali</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Bégué Baara. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;