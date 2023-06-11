import React from 'react';
import './Results.css';
import ApexCharts from 'react-apexcharts';

const Results = ({ searchResult, viewPreviousSearches, handleNewSearch, searchTime }) => {
  // Obtener los datos de similaridad y los índices de resultado
  const similarities = searchResult.map((result) => result.similarity);
  const resultIndices = searchResult.map((_, index) => index + 1);

  // Configurar los datos y opciones del gráfico
  const chartOptions = {
    chart: {
      id: 'results-chart',
      type: 'line',
    },
    xaxis: {
      categories: resultIndices,
      title: {
        text: 'Índice de resultado',
      },
    },
    yaxis: {
      title: {
        text: 'Similaridad',
      },
    },
  };

  const chartSeries = [
    {
      name: 'Similaridad',
      data: similarities,
    },
  ];

  return (
    <div className="results">
      <h2>Resultados de la búsqueda</h2>
      {searchResult.length > 0 ? (
        <>
          <div className="search-time">Tiempo de búsqueda: {searchTime} segundos</div>
          {searchResult[0] && (
            <div className="most-similar">
              <div>Documento más similar: {searchResult[0].document}</div>
              <div>Similaridad: {searchResult[0].similarity}</div>
              <div>Ruta: {searchResult[0].path}</div>
            </div>
          )}
          <div className="chart-container">
            <ApexCharts options={chartOptions} series={chartSeries} type="line" height={300} />
          </div>
          <table>
            <thead>
              <tr>
                <th>Índice</th>
                <th>Documento</th>
                <th>Similaridad</th>
                <th>Ruta</th>
              </tr>
            </thead>
            <tbody>
              {searchResult.map((result, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{result.document}</td>
                  <td>{result.similarity}</td>
                  <td>{result.path}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleNewSearch}>Realizar otra búsqueda +</button>
        </>
      ) : (
        <p>No se encontraron resultados.</p>
      )}
      <button onClick={viewPreviousSearches}>Ver búsquedas anteriores</button>
    </div>
  );
};

export default Results;
