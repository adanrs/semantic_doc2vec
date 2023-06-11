import React from 'react';
import ApexCharts from 'react-apexcharts';
const SearchesChart = ({ searches }) => {
  // Extraer los datos de las consultas
  const queries = searches.map((search) => search.query);
  const similarities = searches.map((search) => search.similarity);

  // Configuración del gráfico
  const chartOptions = {
    chart: {
      type: 'scatter',
      height: 350,
    },
    xaxis: {
      categories: queries,
      labels: {
        rotate: -45,
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
    <div id="searches-chart">
      <ApexCharts options={chartOptions} series={chartSeries} type="scatter" height={350} />
    </div>
  );
};

export default SearchesChart;
