import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import './App.css';
import Register from './components/Register';
import Search from './components/Search';
import Header from './components/Header';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [persons, setPersons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données depuis Supabase au démarrage
  useEffect(() => {
    fetchPersons();
    
    // S'abonner aux changements en temps réel
    const subscription = supabase
      .channel('persons-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'persons' }, 
        () => {
          fetchPersons(); // Recharger quand il y a des changements
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchPersons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('persons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setPersons(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError('Erreur de chargement des données: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPerson = async (newPerson) => {
    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('persons')
        .insert([newPerson])
        .select();

      if (error) throw error;
      
      // Les données sont automatiquement mises à jour via l'abonnement
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      setError('Erreur lors de l\'inscription: ' + error.message);
      return { success: false, error: error.message };
    }
  };

  const deletePerson = async (personId) => {
    try {
      const { error } = await supabase
        .from('persons')
        .delete()
        .eq('id', personId);

      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression: ' + error.message);
      return { success: false, error: error.message };
    }
  };

  const renderView = () => {
    if (isLoading && currentView !== 'register') {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des membres...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Erreur</h3>
          <p>{error}</p>
          <button onClick={fetchPersons} className="btn-retry">
            🔄 Réessayer
          </button>
        </div>
      );
    }

    switch (currentView) {
      case 'register':
        return <Register onAddPerson={handleAddPerson} />;
      case 'search':
        return <Search persons={persons} onDeletePerson={deletePerson} />;
      default:
        return (
          <div className="home-page">
            <div className="container">
              <div className="welcome-section">
                <h1>🌍 Réseau des Anciens du Daara</h1>
                <p>Rejoignez notre communauté et restez connectés</p>
                
                <div className="stats-cards">
                  <div className="stat-card">
                    <h3>{persons.length}</h3>
                    <p>Membres inscrits</p>
                  </div>
                  <div className="stat-card">
                    <h3>{persons.filter(p => p.travail).length}</h3>
                    <p>Travailleurs</p>
                  </div>
                  <div className="stat-card">
                    <h3>{persons.filter(p => !p.travail).length}</h3>
                    <p>En recherche</p>
                  </div>
                </div>
                
                <div className="action-buttons">
                  <button 
                    className="btn-primary"
                    onClick={() => setCurrentView('register')}
                  >
                    📝 S'inscrire
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => setCurrentView('search')}
                  >
                    🔍 Rechercher des membres
                  </button>
                </div>

                <div className="network-info">
                  <h4>🌐 Réseau Partagé</h4>
                  <p>Les données sont maintenant partagées entre tous les utilisateurs en temps réel !</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main>
        {renderView()}
      </main>
    </div>
  );
}

export default App;