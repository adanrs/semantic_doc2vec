import React, { useState, useEffect } from 'react';
import './PreviousSearches.css';
import SearchesChart from './SearchesChart';
import ApexCharts from 'react-apexcharts';

const PreviousSearches = ({ viewSearchResults ,handleNewSearch}) => {
  const [searches, setSearches] = useState([]);

  useEffect(() => {
    // Realizar la llamada al endpoint de resultados de búsqueda previos
    fetch('http://localhost:5000/results')
      .then((response) => response.json())
      .then((data) => setSearches(data.slice(-100))) // Obtener solo los últimos cien elementos
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="previous-searches">
      <h2>Búsquedas anteriores</h2>

      {searches.length > 0 ? (
        <>
        <h3>Grafico de las ultimas cien busquedas por similaridad</h3>
          <SearchesChart searches={searches} />
          <button onClick={() => handleNewSearch()}>Realizar otra búsqueda</button>

          <table>
            <thead>
              <tr>
                <th>Indice</th>
                <th>Termino</th>
                <th>Nombre Documento</th>
                
                <th>Similaridad</th>
                <th>Fecha y hora</th>
              </tr>
            </thead>
            <tbody>
              {searches.map((search, index) => (
                <tr key={index}>
                   <td>{index + 1}</td>
                  <td>{search.query}</td>
                  <td>{search.most_similar_doc}</td>
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
