import { useEffect, useState, useRef } from 'react';
import { useToast } from '../../context/ToastContext.jsx';
import './UploadViewerModal.css';

const UploadViewerModal = ({ isOpen, onClose }) => {
  const { showToast } = useToast()

  const handleUploadViewerKharta = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const jsonData = JSON.parse(e.target.result);
        navigate('/form', { state: { externalUpload: jsonData /* , editorMode: true  */ } });
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="share-viewer-modal-overlay">
      <div className="share-viewer-modal">
        <h2 className="share-viewer-title">Subir alto visor</h2>

        <label className="btn-common">
          <input
            type="file"
            accept=".json"
            onChange={(e) => {
              handleUploadViewerKharta(e);
            }}
            style={{ display: "none" }}
            title="Subir JSON"
          />
          <span className="icon">
            <i className="fa-solid fa-upload" style={{ cursor: "pointer" }}></i>
          </span>
          Visor Argenmap
        </label>

        <label className="btn-common">
          <input
            type="file"
            accept=".json"
            onChange={(e) => {
              handleUploadViewerKharta(e);
            }}
            style={{ display: "none" }}
            title="Subir JSON"
          />
          <span className="icon">
            <i className="fa-solid fa-upload" style={{ cursor: "pointer" }}></i>
          </span>
          Visor Kharta
        </label>

        <div className="share-viewer-footer">
          <button className="share-viewer-close-button" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadViewerModal;
