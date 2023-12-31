from flask import Flask, request, jsonify, render_template
from PyPDF2 import PdfFileReader
from pdfminer.high_level import extract_text
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from gensim.utils import simple_preprocess
from gensim.models import Doc2Vec, FastText
from threading import Thread
import os
import sqlite3
import hashlib
import datetime
import time
from threading import Lock
from flask import Flask
from flask_cors import CORS
import datetime


INITIAL_PATH = "E:\\Proyectos\\semantic_doc2vec\\python"

PDF_PATH = INITIAL_PATH+"\\PDF\\Test"
MODEL_PATH = INITIAL_PATH+"\\model"
DB_PATH = INITIAL_PATH+"\\documents.sqlite"

app = Flask(__name__)
CORS(app)
# Inicialización del modelo y del candado para sincronizar el acceso al modelo

model = None
model_lock = Lock()  # Crear un candado para sincronizar el acceso al modelo

# Función para calcular el hash de un archivo
def get_file_hash(file):
    BLOCK_SIZE = 65536  # The size of each read from the file
    file_hash = hashlib.sha256()  # Create the hash object, can use something other than `.sha256()` if you wish
    with open(file, 'rb') as f:  # Open the file to read its bytes
        fb = f.read(BLOCK_SIZE)  # Read from the file. Take in the amount declared above
        while len(fb) > 0:  # While there is still data being read from the file
            file_hash.update(fb)  # Update the hash
            fb = f.read(BLOCK_SIZE)  # Read the next block from the file
    return file_hash.hexdigest()

# Función para eliminar los archivos PDF que no se pueden leer
def remove_unreadable_files():
    for file in os.listdir(PDF_PATH):
        if file.endswith(".pdf"):
            file_path = os.path.join(PDF_PATH, file)
            try:
                pdf = PdfFileReader(file_path)
                pdf.getNumPages()  # Intenta leer el número de páginas para verificar si es legible
            except Exception as e:
                print(f"Archivo no legible: {file_path}. Eliminando archivo...")
                os.remove(file_path)
                print(f"Archivo eliminado: {file_path}")

# Función para leer el texto de un archivo PDF
def read_pdf(file):
    text = ""
    try:
        pdf = PdfFileReader(file)
        for page in range(pdf.getNumPages()):
            text += pdf.getPage(page).extractText()
    except (KeyError, NotImplementedError):
        text = extract_text(file)
    return text

# Función para crear las tablas en la base de datos
def create_tables():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("DROP TABLE IF EXISTS files")  # Eliminar la tabla files si ya existe
    c.execute('''CREATE TABLE IF NOT EXISTS files
                 (name TEXT PRIMARY KEY, hash TEXT, path TEXT, model_size INTEGER)''')
    #c.execute("DROP TABLE IF EXISTS models")  # Eliminar la tabla models si ya existe
    c.execute('''CREATE TABLE IF NOT EXISTS models
                 (timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, model_size INTEGER,num_documents INTEGER)''')
    #c.execute("DROP TABLE IF EXISTS searches")  # Eliminar la tabla searches si ya existe
    c.execute('''CREATE TABLE IF NOT EXISTS searches
                 (query TEXT, most_similar_doc TEXT, similarity REAL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, search_duration TEXT)''')
    conn.commit()
    conn.close()




# Función para entrenar el modelo
def train_model():
    global model
    create_tables()

    documents = []
    needs_update = False
    start_time = time.time()  # Registro del tiempo de inicio
    model_size = 0  # Variable para almacenar el tamaño del modelo
    num_documents = 0  # Variable para almacenar la cantidad de documentos
    for file in os.listdir(PDF_PATH):
        if file.endswith(".pdf"):
            file_path = os.path.join(PDF_PATH, file)
            file_hash = get_file_hash(file_path)
            conn = sqlite3.connect(DB_PATH)
            c = conn.cursor()
            c.execute("SELECT hash FROM files WHERE name = ?", (file,))
            result = c.fetchone()
            if result is None or result[0] != file_hash:
                needs_update = True
                text = read_pdf(file_path)
                documents.append(TaggedDocument(simple_preprocess(text), [file]))
                file_path = os.path.join(PDF_PATH, file)
                c.execute("REPLACE INTO files (name, hash, path) VALUES (?, ?, ?)", (file, file_hash, file_path))
                model_size += os.path.getsize(file_path)  # Actualizar el tamaño del modelo
                num_documents += 1  # Incrementar la cantidad de documentos
            conn.commit()
            conn.close()
    if needs_update:
        model = Doc2Vec(documents, vector_size=50, min_count=2, epochs=40)
        end_time = time.time()  # Registro del tiempo de finalización
        print(f"Modelo entrenado en {end_time - start_time:.2f} segundos")  # Muestra el tiempo de ejecución

        # Registrar el tamaño del modelo y la cantidad de documentos en la tabla models
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("INSERT INTO models (timestamp, model_size, num_documents) VALUES (?, ?, ?)",
                  (datetime.datetime.now(), model_size, num_documents))
        conn.commit()
        conn.close()

# Ruta para verificar si el modelo está listo
@app.route("/ready", methods=["GET"])
def ready():
    return jsonify({"ready": model is not None})

@app.route("/search", methods=["POST"])
def search():
    global model
    query = request.json.get("query", "")

    with model_lock:
        while model is None:  # Esperar hasta que el modelo esté listo
            pass

        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()

        # Obtener el tiempo de inicio de la búsqueda
        start_time = datetime.datetime.now()

        query_vector = model.infer_vector(simple_preprocess(query))
        similar_docs = model.dv.most_similar([query_vector], topn=10)

        # Obtener la ruta del documento más similar
        most_similar_doc = similar_docs[0][0]
        c.execute("SELECT path FROM files WHERE name = ?", (most_similar_doc,))
        most_similar_doc_path = c.fetchone()[0]

        c.execute("INSERT INTO searches (query, most_similar_doc, similarity, search_duration) VALUES (?, ?, ?, ?)",
                  (query, most_similar_doc, similar_docs[0][1], str(datetime.datetime.now() - start_time)))

        similar_docs_with_path = []
        for doc_id, similarity in similar_docs:
            c.execute("SELECT path FROM files WHERE name = ?", (doc_id,))
            doc_path = c.fetchone()[0]
            similar_docs_with_path.append({
                "document": doc_id,
                "similarity": similarity,
                "path": doc_path
            })

        conn.commit()
        conn.close()

        return jsonify({
            "most_similar": {
                "document": most_similar_doc,
                "similarity": similar_docs[0][1],
                "path": most_similar_doc_path
            },
            "similar_docs": similar_docs_with_path,
            "search_duration": str(datetime.datetime.now() - start_time)
        })

        
# Ruta para obtener los modelos
@app.route("/models", methods=["GET"])
def get_models():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT timestamp, model_size ,num_documents FROM models")
    models = c.fetchall()
    conn.close()
    models_json = [{"timestamp": str(model[0]), "model_size": model[1], "num_documents":model[2]} for model in models]
    return jsonify(models_json)



@app.route("/results", methods=["GET"])
def show_results():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT searches.query, searches.most_similar_doc, searches.similarity, searches.search_duration, searches.timestamp, files.path FROM searches LEFT JOIN files ON searches.most_similar_doc = files.name")
    results = c.fetchall()
    conn.close()
    results_json = []
    for result in results:
        result_data = {
            "query": result[0],
            "most_similar_doc": result[1],
            "similarity": result[2],
            "search_duration": result[3],
            "timestamp": result[4],
            "path": result[5]  # Agrega la ruta del archivo a los resultados
        }
        results_json.append(result_data)
    return jsonify(results_json)



# Inicio de la aplicación
if __name__ == "__main__":
    # Eliminar archivos no legibles antes de iniciar la aplicación
    remove_unreadable_files()
    # Iniciar el entrenamiento del modelo en un hilo separado
    Thread(target=train_model).start()
    # Iniciar la aplicación Flask
    app.run(debug=True)