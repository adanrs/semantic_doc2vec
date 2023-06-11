import React, { useState } from 'react';
import SearchForm from './SearchForm';
import Results from './Results';
import PreviousSearches from './PreviousSearches';
import ModelsDoc2Vec from './ModelsDoc2Vec';

function App() {
  const [searchResult, setSearchResult] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showPreviousSearches, setShowPreviousSearches] = useState(false);
  const [showModels, setShowModels] = useState(false);
  const [searchTime, setSearchTime] = useState(0);

  const handleSearch = async (query) => {
    try {
      const startTime = new Date();

      const response = await fetch('http://localhost:5000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();

      const endTime = new Date();
      const searchDuration = (endTime - startTime) / 1000;
      setSearchTime(searchDuration);

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
    setSearchTime(0);
  };

  const handleViewModels = () => {
    setShowResults(false);
    setShowPreviousSearches(false);
    setShowModels(true);
  };

  return (
    <div className="app">
      <h1>Buscar Documentos</h1>
      {showResults ? (
        <Results
          searchResult={searchResult}
          viewPreviousSearches={viewPreviousSearches}
          handleNewSearch={handleNewSearch}
          searchTime={searchTime}
        />
      ) : showPreviousSearches ? (
        <PreviousSearches viewSearchResults={viewSearchResults} handleNewSearch={handleNewSearch} />

      ) : showModels ? (
        <ModelsDoc2Vec />
      ) : (
        <SearchForm handleSearch={handleSearch} viewPreviousSearches={viewPreviousSearches} handleViewModels={handleViewModels} />
      )}
    </div>
  );
}

export default App;
