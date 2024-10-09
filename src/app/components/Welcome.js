'use client';

import React, { useCallback } from 'react';
import './Welcome.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Welcome({ onJsonUpload, hideLayout }) {
  const handleFileUpload = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedData = JSON.parse(e.target.result);
        onJsonUpload(parsedData); // Llama a la función pasada
        hideLayout(); // Ocultar el Layout después de cargar el JSON
      } catch (error) {
        console.error('Error al leer el archivo. Asegúrate de que el JSON es válido.');
      }
    };

    if (file) {
      reader.readAsText(file);
    }
  }, [onJsonUpload, hideLayout]);

  const handleDrop = (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      handleFileUpload(file);
    } else {
      console.error('Por favor, arrastra un archivo JSON.');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Necesario para permitir la acción de soltar
  };

  const handleCloseWindow = () => {
    console.log("holasd")
    window.close();
  };

  return (
    <div id='welcomePage' className="about-page">
      <button className="" onClick={handleCloseWindow}  title="Limpiar Memoria">
        <i className="fa-solid fa-square-plus"></i>
      </button>
      <div className="modal-container">
        <div className="modal left-modal">
          <h2>Subir JSON</h2>
          <p>Contenido para el modal de la izquierda.</p>
          <div
            className="big-button"
            title="Subir archivo"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.querySelector('.hidden-input').click()} // Abrir diálogo de archivo al hacer clic
          >
            <i className="fa-regular fa-square-plus"></i>
            <input
              type="file"
              className="hidden-input"
              accept=".json"
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
          </div>
        </div>

        <div className="divider"></div>

        <div className="modal right-modal">
          <h2>Modal Derecho</h2>
          <p>Contenido para el modal de la derecha.</p>
        </div>
      </div>
    </div>
  );
}
