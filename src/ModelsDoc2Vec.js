import React, { useState, useEffect } from 'react';
import './ModelsDoc2Vec.css';
import ApexCharts from 'apexcharts';
import ModelsChart from './ModelsChart';

const ModelsDoc2Vec = (handleNewSearch) => {
  const [models, setModels] = useState([]);



  useEffect(() => {
    // Realizar la llamada al endpoint de resultados de búsqueda previos
    fetch('http://localhost:5000/models')
      .then((response) => response.json())
      .then((data) => setModels(data.slice(-100).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))) // Obtener solo los últimos cien elementos
      .catch((error) => console.log(error));
  }, []);



  return (
    <div className="ModelsDoc2Vec">
      <h2>Modelos</h2>
      <ModelsChart models={models} />
   
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
              <div id="ModelsDoc2Vec-chart"></div>
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
