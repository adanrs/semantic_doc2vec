import React, { useState, useEffect } from 'react';
import './PreviousSearches.css';
import SearchesChart from './SearchesChart';
import ApexCharts from 'react-apexcharts';

const PreviousSearches = ({ viewSearchResults, handleNewSearch }) => {
  const [searches, setSearches] = useState([]);

  useEffect(() => {
    // Realizar la llamada al endpoint de resultados de búsqueda previos
    fetch('http://localhost:5000/results')
      .then((response) => response.json())
      .then((data) => {
        const sortedSearches = data.slice(-100).sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
        setSearches(sortedSearches);
      })
      .catch((error) => console.log(error));
  }, []);
  const formatSearchDuration = (duration) => {
    const milliseconds = parseInt(duration.slice(-6)); // Extract the milliseconds
    const seconds = parseInt(duration.slice(2, 4)); // Extract the seconds
    const minutes = parseInt(duration.slice(0, 1)); // Extract the minutes
    const hours = parseInt(duration.slice(0, 1)); // Extract the hours
  
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')} segundos`;
  };
  return (
    <div className="previous-searches">
      <h2>Búsquedas anteriores</h2>

      {searches.length > 0 ? (
        <>
          <h3>Gráfico de las últimas cien búsquedas por similaridad</h3>
          <SearchesChart searches={searches} />
         

          <table>
            <thead>
              <tr>
                <th>Índice</th>
                <th>Término</th>
                <th>Nombre Documento</th>
                <th>Segundos De Busqueda</th>
                <th>Similaridad</th>
                <th>Fecha y hora</th>
              </tr>
            </thead>
            <tbody>
              {searches.map((search, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{search.query}</td>
 
                  <td><a href="{{ search.path] }}">{search.most_similar_doc}</a></td>
                  

                  <td>{formatSearchDuration(search.search_duration)}</td>


                  <td>{search.similarity}</td>
                  <td>{search.timestamp}</td>
        
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>No hay búsquedas anteriores.</p>
      )}
    </div>
  );
};

export default PreviousSearches;
