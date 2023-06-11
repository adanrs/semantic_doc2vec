import React, { useState } from 'react';
import SearchForm from './SearchForm';
import Results from './Results';
import PreviousSearches from './PreviousSearches';

function App() {
  const [searchResult, setSearchResult] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showPreviousSearches, setShowPreviousSearches] = useState(false);
  const [searchTime, setSearchTime] = useState(0); // Nuevo estado para almacenar el tiempo de búsqueda

  const handleSearch = async (query) => {
    // Realizar la llamada al endpoint de búsqueda y obtener los resultados
    try {
      const startTime = new Date(); // Registrar el tiempo de inicio de la búsqueda

      const response = await fetch('http://localhost:5000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();

      const endTime = new Date(); // Registrar el tiempo de finalización de la búsqueda
      const searchDuration = (endTime - startTime) / 1000; // Calcular la duración de la búsqueda en segundos
      setSearchTime(searchDuration); // Actualizar el estado del tiempo de búsqueda

      setSearchResult(data.similar_docs);
      setShowResults(true);
    } catch (error) {
      console.log(error);
    }
  };

  const viewPreviousSearches = () => {
    setShowResults(false);
    setShowPreviousSearches(true);
  };

  const viewSearchResults = () => {
    setShowPreviousSearches(false);
    setShowResults(true);
  };

  const handleNewSearch = () => {
    setSearchResult([]);
    setShowResults(false);
    setSearchTime(0); // Reiniciar el tiempo de búsqueda
  };

  return (
    <div className="app">
      <h1>Buscar Documentos</h1>
      {showResults ? (
        <Results
          searchResult={searchResult}
          viewPreviousSearches={viewPreviousSearches}
          handleNewSearch={handleNewSearch}
          searchTime={searchTime} // Pasar el tiempo de búsqueda como prop a Results
        />
      ) : showPreviousSearches ? (
        <PreviousSearches viewSearchResults={viewSearchResults} />
      ) : (
        <SearchForm handleSearch={handleSearch} viewPreviousSearches={viewPreviousSearches} />
      )}
    </div>
  );
}

export default App;
