@'
// Gestion du stockage local
export const storage = {
  // Sauvegarder les personnes
  savePersons: (persons) => {
    localStorage.setItem('begueBaaraPersons', JSON.stringify(persons));
  },
  
  // Charger les personnes
  loadPersons: () => {
    const saved = localStorage.getItem('begueBaaraPersons');
    return saved ? JSON.parse(saved) : [];
  },
  
  // Ajouter une personne
  addPerson: (person) => {
    const persons = storage.loadPersons();
    const newPerson = {
      id: Date.now(),
      ...person,
      createdAt: new Date().toISOString()
    };
    persons.push(newPerson);
    storage.savePersons(persons);
    return newPerson;
  },
  
  // Rechercher des personnes
  searchPersons: (filters = {}) => {
    let persons = storage.loadPersons();
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        persons = persons.filter(person => 
          person[key] && person[key].toLowerCase().includes(filters[key].toLowerCase())
        );
      }
    });
    
    return persons;
  }
};
'@ | Out-File -FilePath "src\utils\storage.js" -Encoding UTF8