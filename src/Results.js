import React from 'react';
import './Results.css';
import ApexCharts from 'react-apexcharts';

const Results = ({ searchResult, viewPreviousSearches, handleNewSearch, searchTime }) => {
  // Obtener los datos de similaridad y los índices de resultado
  const similarities = searchResult.map((result) => result[1]);
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
          <div className="table-container"> {/* Agrega un contenedor para la tabla */}
          <div className="chart-container">
            <ApexCharts options={chartOptions} series={chartSeries} type="line" height={300} />
            <button onClick={handleNewSearch}>Realizar otra búsqueda</button>
          </div>
            <table>
              <thead>
                <tr>
                  <th>Índice</th>
                  <th>Documento más similar</th>
                  <th>Similaridad</th>
                </tr>
              </thead>
              <tbody>
                {searchResult.map((result, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{result[0]}</td>
                    <td>{result[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </>
      ) : (
        <p>No se encontraron resultados.</p>
      )}
      <button onClick={viewPreviousSearches}>Ver búsquedas anteriores</button>
     
    </div>
  );
};

export default Results;
