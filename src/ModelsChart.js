import React from 'react';
import ApexCharts from 'react-apexcharts';
import './ModelsChart.css';

const ModelsChart = ({ models }) => {
  // Extraer los datos de los modelos
  const indices = models.map((_, index) => index + 1);
  const modelSizesMB = models.map((model) => (model.model_size / 1024 / 1024).toFixed(2));

  // Configuración del gráfico
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
    },
    xaxis: {
      categories: indices,
      labels: {
        rotate: -45,
      },
    },
    yaxis: {
      title: {
        text: 'Tamaño del modelo (MB)',
      },
    },
  };

  const chartSeries = [
    {
      name: 'Tamaño del modelo',
      data: modelSizesMB,
    },
  ];

  return (
    <div id="models-chart">
      <ApexCharts options={chartOptions} series={chartSeries} type="bar" height={350} />
    </div>
  );
};

export default ModelsChart;
