import React, { useState, useEffect } from 'react';
import './ModelsDoc2Vec.css';
import ApexCharts from 'apexcharts';

const ModelsDoc2Vec = () => {
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('http://localhost:5000/models');
        const data = await response.json();
        setModels(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    if (models.length === 0) return; // Agrega una verificación para evitar renderizar el gráfico si no hay datos

    const chartOptions = {
      chart: {
        type: 'bar',
        height: 350,
      },
      xaxis: {
        categories: models.map((model) => model.timestamp),
        labels: {
          rotate: -45,
        },
      },
      yaxis: {
        title: {
          text: 'Tamaño del modelo',
        },
      },
    };

    const chartSeries = [
      {
        name: 'Tamaño del modelo',
        data: models.map((model) => model.model_size),
      },
    ];

    const chart = new ApexCharts(document.querySelector('#ModelsDoc2Vec-chart'), chartOptions);

    chart.render();

    return () => {
      chart.destroy();
    };
  }, [models]);

  return (
    <div className="ModelsDoc2Vec">
      <h2>Modelos</h2>

      {models ? (
        models.length > 0 ? (
          <>
            <div id="ModelsDoc2Vec-chart"></div>
            <table>
              <thead>
                <tr>
                <th>#</th>
                  <th>Fecha y hora</th>
                  <th>Tamaño del modelo</th>
                  <th>Cantidad de documentos</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{model.timestamp}</td>
                    <td>{(model.model_size / 1024 / 1024).toFixed(2)} MB</td>
                    <td>{model.num_documents}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>No hay modelos disponibles.</p>
        )
      ) : (
        <p>Cargando modelos...</p>
      )}
    </div>
  );
};

export default ModelsDoc2Vec;
