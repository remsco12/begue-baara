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
  situationMatrimoniale: person.situation_matrimoniale,
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
  situation_matrimoniale: personData.situationMatrimoniale || null,
  profession: personData.profession || null,
  entreprise: personData.entreprise || null,
  formation: personData.formation || null,
  daara: personData.daara,
  travail: personData.travail
});

// Fonction pour sauvegarder le cache local
const backupToLocal = (persons) => {
  const backup = {
    timestamp: new Date().toISOString(),
    count: persons.length,
    data: persons
  };
  
  localStorage.setItem('backup_begue_baara', JSON.stringify(backup));
  console.log(`💾 Backup: ${persons.length} personnes sauvegardées`);
};

// Vérifier le cache local
const getCachedPersons = () => {
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  const cached = localStorage.getItem('persons_cache');
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      console.log('📁 Utilisation du cache local');
      return data;
    }
  }
  return null;
};

// Sauvegarder dans le cache
const saveToCache = (persons) => {
  const cache = {
    data: persons,
    timestamp: Date.now()
  };
  localStorage.setItem('persons_cache', JSON.stringify(cache));
};

// Surveiller l'état Supabase
const checkSupabaseStatus = async () => {
  try {
    const status = {
      date: new Date().toISOString(),
      project: 'rrmewqgykmebthmjuuul',
      lastActivity: localStorage.getItem('last_supabase_activity') || 'Jamais'
    };
    
    localStorage.setItem('supabase_status', JSON.stringify(status));
    localStorage.setItem('last_supabase_activity', new Date().toISOString());
    
    return { success: true, status };
  } catch (error) {
    return { success: false, error };
  }
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Vérifier la connexion internet
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Ping Supabase pour maintenir le projet actif (toutes les semaines)
  useEffect(() => {
    const pingSupabase = async () => {
      if (!isOnline) return;
      
      try {
        await supabase.from('persons').select('id').limit(1);
        console.log('✅ Ping Supabase - projet actif');
        await checkSupabaseStatus();
      } catch (error) {
        console.log('⚠️ Ping Supabase échoué', error.message);
      }
    };

    // Premier ping au chargement
    pingSupabase();

    // Ping toutes les semaines (7 jours)
    const pingInterval = setInterval(pingSupabase, 7 * 24 * 60 * 60 * 1000);

    // Ping toutes les heures en développement pour tests
    if (process.env.NODE_ENV === 'development') {
      const devPingInterval = setInterval(pingSupabase, 60 * 60 * 1000);
      return () => {
        clearInterval(pingInterval);
        clearInterval(devPingInterval);
      };
    }

    return () => clearInterval(pingInterval);
  }, [isOnline]);

  // Charger les données depuis Supabase
  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Vérifier d'abord le cache
      const cachedData = getCachedPersons();
      if (cachedData) {
        setPersons(cachedData);
        setLoading(false);
        
        // Rafraîchir en arrière-plan
        setTimeout(() => fetchPersonsFromSupabase(), 1000);
        return;
      }

      await fetchPersonsFromSupabase();
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      setError(isOnline ? 'Erreur de connexion à la base de données' : 'Mode hors ligne');
      
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

  const fetchPersonsFromSupabase = async () => {
    if (!isOnline) {
      console.log('🌐 Mode hors ligne - utilisation du cache');
      return;
    }
    
    console.log('🔍 Chargement des données depuis Supabase...');
    
    // OPTIMISATION: Sélectionner uniquement les champs nécessaires pour économiser la bande passante
    const { data, error } = await supabase
      .from('persons')
      .select('id,nom,prenom,telephone,quartier,region,pays,genre,situation_matrimoniale,profession,entreprise,formation,daara,travail,created_at')
      .order('created_at', { ascending: false })
      .limit(100); // Limiter à 100 résultats pour économiser

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      
      // Vérifier si c'est une erreur CORS
      if (error.message?.includes('CORS') || error.message?.includes('fetch')) {
        setError('Erreur de configuration CORS. Vérifiez les paramètres Supabase.');
      }
      throw error;
    }
    
    // APPLICATION DU MAPPAGE
    const mappedData = (data || []).map(mapPersonFromSupabase);
    
    console.log('✅ Données chargées et mappées:', mappedData.length, 'personnes');
    
    // Mettre à jour l'état
    setPersons(mappedData);
    
    // Sauvegarder dans le cache local
    saveToCache(mappedData);
    backupToLocal(mappedData);
    
    // Mettre à jour le statut
    await checkSupabaseStatus();
  };

  const addPerson = async (personData) => {
    try {
      setError(null);
      console.log('➕ Tentative d\'ajout:', personData);
      
      // Vérifier la connexion
      if (!isOnline) {
        console.log('🌐 Mode hors ligne - sauvegarde locale uniquement');
        return addPersonOffline(personData);
      }
      
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
      
      // Sauvegarde locale
      savePersonToLocalStorage(newPerson);
      await checkSupabaseStatus();
      
      return { success: true, data: newPerson, isOnline: true };
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout:', error);
      
      // Fallback: sauvegarde locale
      return addPersonOffline(personData);
    }
  };

  const addPersonOffline = (personData) => {
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
    
    savePersonToLocalStorage(newPerson);
    
    // Stocker dans la file d'attente pour synchronisation future
    const pendingSync = JSON.parse(localStorage.getItem('pending_sync') || '[]');
    pendingSync.push({
      type: 'add',
      data: personData,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('pending_sync', JSON.stringify(pendingSync));
    
    console.log('✅ Personne ajoutée en local:', newPerson);
    return { success: true, data: newPerson, isOnline: false };
  };

  const savePersonToLocalStorage = (newPerson) => {
    try {
      const updatedPersons = [newPerson, ...persons];
      localStorage.setItem('begueBaaraPersons', JSON.stringify(updatedPersons));
      saveToCache(updatedPersons);
      backupToLocal(updatedPersons);
      console.log('💾 Sauvegarde locale réussie');
    } catch (e) {
      console.error('❌ Erreur sauvegarde locale:', e);
    }
  };

  const deletePerson = async (personId) => {
    try {
      if (!isOnline) {
        // Suppression locale uniquement en mode hors ligne
        setPersons(prev => prev.filter(p => p.id !== personId));
        
        // Sauvegarder la suppression pour synchronisation
        const pendingSync = JSON.parse(localStorage.getItem('pending_sync') || '[]');
        pendingSync.push({
          type: 'delete',
          personId: personId,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('pending_sync', JSON.stringify(pendingSync));
        
        return { success: true, isOnline: false };
      }

      const { error } = await supabase
        .from('persons')
        .delete()
        .eq('id', personId);

      if (error) throw error;
      
      // Mise à jour immédiate de l'état local
      setPersons(prev => prev.filter(p => p.id !== personId));
      
      await checkSupabaseStatus();
      
      return { success: true, isOnline: true };
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      return { success: false, error: error.message };
    }
  };

  // Synchroniser les données en attente quand la connexion revient
  const syncPendingData = async () => {
    if (!isOnline) return;
    
    const pendingSync = JSON.parse(localStorage.getItem('pending_sync') || '[]');
    if (pendingSync.length === 0) return;
    
    console.log(`🔄 Synchronisation de ${pendingSync.length} opérations en attente...`);
    
    for (const operation of pendingSync) {
      try {
        if (operation.type === 'add') {
          await supabase.from('persons').insert([mapPersonToSupabase(operation.data)]);
        } else if (operation.type === 'delete') {
          await supabase.from('persons').delete().eq('id', operation.personId);
        }
        console.log(`✅ Opération synchronisée: ${operation.type}`);
      } catch (error) {
        console.error(`❌ Erreur synchronisation ${operation.type}:`, error);
      }
    }
    
    // Vider la file d'attente après synchronisation
    localStorage.removeItem('pending_sync');
    
    // Rafraîchir les données
    await fetchPersonsFromSupabase();
  };

  // Synchroniser automatiquement quand la connexion revient
  useEffect(() => {
    if (isOnline) {
      syncPendingData();
    }
  }, [isOnline]);

  const renderPage = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de l'application Bégué Baara...</p>
          {!isOnline && <p className="offline-notice">🌐 Mode hors ligne</p>}
        </div>
      );
    }

    if (error && persons.length === 0) {
      return (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>{isOnline ? 'Erreur de connexion' : 'Mode hors ligne'}</h3>
          <p>{error}</p>
          <p>{isOnline 
            ? 'Utilisation du mode hors ligne avec les données locales.' 
            : 'Connectez-vous à internet pour synchroniser les données.'}
          </p>
          <button onClick={fetchPersons} className="btn-retry">
            🔄 {isOnline ? 'Réessayer la connexion' : 'Rafraîchir les données locales'}
          </button>
          {!isOnline && (
            <div className="offline-info">
              <p>📱 Données disponibles localement: {persons.length} personnes</p>
            </div>
          )}
        </div>
      );
    }

    // Afficher un indicateur de mode hors ligne
    const offlineIndicator = !isOnline && (
      <div className="offline-banner">
        <span>🌐 Mode hors ligne - Les modifications seront synchronisées plus tard</span>
        <button onClick={syncPendingData} className="btn-sync">
          Synchroniser maintenant
        </button>
      </div>
    );

    switch(currentPage) {
      case 'home':
        return (
          <>
            {offlineIndicator}
            <Home persons={persons} />
          </>
        );
      case 'register':
        return (
          <>
            {offlineIndicator}
            <Register onAddPerson={addPerson} persons={persons} />
          </>
        );
      case 'search':
        return (
          <>
            {offlineIndicator}
            <Search persons={persons} onDeletePerson={deletePerson} />
          </>
        );
      default:
        return (
          <>
            {offlineIndicator}
            <Home persons={persons} />
          </>
        );
    }
  };

  return (
    <div className="App">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
      
      {/* Indicateur de statut (optionnel - pour debug) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="status-indicator">
          <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? '●' : '○'}
          </span>
          <span>Supabase: {isOnline ? 'Connecté' : 'Hors ligne'}</span>
          <span>| Membres: {persons.length}</span>
        </div>
      )}
      
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Bégué Baara</h3>
              <p>Le réseau social de la communauté Allah Don</p>
              <p>Connectant plus de {persons.length} membres</p>
              {!isOnline && <p className="offline-footer">🌐 Mode hors ligne actif</p>}
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
          {/* <p className="footer-note">
              {isOnline 
                ? '✅ Connecté à Supabase (Plan Gratuit - Actif)' 
                : '⚠️ Mode hors ligne - Synchronisation automatique à la reconnexion'}
            </p> */}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;