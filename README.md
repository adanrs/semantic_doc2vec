# Proyecto de Búsqueda Semántica de Documentos

Este proyecto es una aplicación web para la búsqueda semántica de documentos utilizando el algoritmo Doc2Vec. Permite realizar búsquedas de documentos similares a partir de una consulta ingresada por el usuario.

## Características

- Realización de búsquedas semánticas de documentos.
- Visualización de resultados de búsqueda y modelos previos.
- Representación gráfica de resultados de búsqueda y modelos.
- Interfaz intuitiva y fácil de usar.

## Tecnologías utilizadas

- Frontend: React
- Backend: Flask (Python)
- Base de datos: SQLite
- Bibliotecas adicionales: PyPDF2 (Python), Gensim (Python), ApexCharts
 
Documentación de los Endpoints
==============================

/ready
------

Método: `GET`

Descripción: Este endpoint se utiliza para verificar si el modelo de Doc2Vec está listo para su uso.

Respuesta: Devuelve un objeto JSON con un solo campo "ready" que es `true` si el modelo está listo, y `false` si no lo está.

Ejemplo de respuesta:

jsonCopy code

`{
    "ready": true
}`

/search
-------

Método: `POST`

Descripción: Este endpoint se utiliza para buscar documentos similares a una consulta proporcionada. La consulta se procesa en un vector utilizando el modelo Doc2Vec y luego se utilizan esos vectores para buscar documentos similares.

Cuerpo de la solicitud: Un objeto JSON con un solo campo "query" que contiene la consulta de texto para la que se buscan documentos similares.

Ejemplo de cuerpo de la solicitud:

jsonCopy code

`{
    "query": "inteligencia artificial"
}`

Respuesta: Devuelve un objeto JSON con los documentos más similares a la consulta, junto con sus respectivas similitudes y la duración de la búsqueda.

Ejemplo de respuesta:

jsonCopy code

`{
    "most_similar": {
        "document": "doc1.pdf",
        "similarity": 0.982,
        "path": "E:\\Proyectos\\semantic_doc2vec\\python\\PDF\\Test\\doc1.pdf"
    },
    "similar_docs": [
        {"document": "doc2.pdf", "similarity": 0.976, "path": "E:\\Proyectos\\semantic_doc2vec\\python\\PDF\\Test\\doc2.pdf"},
        {"document": "doc3.pdf", "similarity": 0.972, "path": "E:\\Proyectos\\semantic_doc2vec\\python\\PDF\\Test\\doc3.pdf"}
    ],
    "search_duration": "0:00:02.139000"
}`

/models
-------

Método: `GET`

Descripción: Este endpoint devuelve una lista de todos los modelos que se han creado, junto con sus tamaños, el número de documentos y la marca de tiempo de creación.

Respuesta: Devuelve un array de objetos JSON, cada uno de los cuales representa un modelo y contiene información sobre el tamaño del modelo, la cantidad de documentos y la marca de tiempo.

Ejemplo de respuesta:

jsonCopy code

`[
    {"timestamp": "2023-06-11 12:34:56", "model_size": 12345678, "num_documents": 100},
    {"timestamp": "2023-06-12 01:23:45", "model_size": 23456789, "num_documents": 200}
]`

/results
--------

Método: `GET`

Descripción: Este endpoint devuelve una lista de todos los resultados de búsqueda realizados, junto con la consulta, el documento más similar, la similitud, la duración de la búsqueda y la marca de tiempo de la búsqueda.

Respuesta: Devuelve un array de objetos JSON, cada uno de los cuales representa un resultado de búsqueda e incluye información sobre la consulta, el documento más similar, la similitud, la duración de la búsqueda y la marca de tiempo.

Ejemplo de respuesta:

jsonCopy code

`[
    {
        "query": "inteligencia artificial",
        "most_similar_doc": "doc1.pdf",
        "similarity": 0.982,
        "search_duration": "0:00:02.139000",
        "timestamp": "2023-06-11 12:34:56",
        "path": "E:\\Proyectos\\semantic_doc2vec\\python\\PDF\\Test\\doc1.pdf"
    },
    {
        "query": "machine learning",
        "most_similar_doc": "doc2.pdf",
        "similarity": 0.976,
        "search_duration": "0:00:01.879000",
        "timestamp": "2023-06-12 01:23:45",
        "path": "E:\\Proyectos\\semantic_doc2vec\\python\\PDF\\Test\\doc2.pdf"
    }
]`
