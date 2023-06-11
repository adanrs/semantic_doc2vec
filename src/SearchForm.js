import React, { useState } from 'react';
import './SearchForm.css';
import Results from './Results';
import ModelsDoc2Vec from './ModelsDoc2Vec';

function SearchForm({ handleSearch, viewPreviousSearches, searchResult, searchTime, handleViewModels }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Buscar documentos"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <div className="button-container">
          <button type="submit">Buscar</button>
          <button onClick={viewPreviousSearches}>Ver búsquedas anteriores</button>
          <button onClick={handleViewModels}>Ver modelos</button> {/* Nuevo botón para ver los modelos */}
        </div>
      </form>
      <ModelsDoc2Vec />
      
      {searchResult && searchResult.length > 0 && <Results searchResult={searchResult} searchTime={searchTime} />}
    </div>
  );
}

export default SearchForm;
