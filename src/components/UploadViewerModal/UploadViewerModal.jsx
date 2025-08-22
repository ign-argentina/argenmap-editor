import { useEffect, useState, useRef } from 'react';
import { useToast } from '../../context/ToastContext.jsx';
import { useNavigate } from 'react-router-dom';
import './UploadViewerModal.css';

const UploadViewerModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { showToast } = useToast()
  const [hoverText, setHoverText] = useState("");

  const handleUploadViewerKharta = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const jsonData = JSON.parse(e.target.result);

        // Validar que sea un JSON de Kharta
        // if (!jsonData.hasOwnProperty("khartaConfig") && !jsonData.hasOwnProperty("version")) {
        //   showToast("El archivo no es un visor Kharta válido", "error");
        //   return;
        // }

        navigate('/form', { state: { externalUpload: jsonData /* , editorMode: true  */ } });
      };
      reader.readAsText(file);
    }
  };

  const handleUploadViewerArgenmap = (event) => {
    const files = event.target.files;

    if (!files || files.length !== 2) {
      showToast("Debes seleccionar exactamente 2 archivos JSON para Argenmap", "error");
      return;
    }

    const readers = [];
    const jsonResults = [];

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      readers.push(
        new Promise((resolve, reject) => {
          reader.onload = (e) => {
            try {
              const jsonData = JSON.parse(e.target.result);
              jsonResults[index] = jsonData;
              resolve();
            } catch (error) {
              reject("Error al leer el archivo: " + file.name);
            }
          };
          reader.readAsText(file);
        })
      );
    });

    Promise.all(readers)
      .then(() => {
        navigate('/form', {
          state: {
            externalUpload: {
              type: "argenmap",
              files: jsonResults
            }
          }
        });
      })
      .catch((error) => {
        showToast(error, "error");
      });
  };

  if (!isOpen) return null;

  return (
    <div className="upload-viewer-modal-overlay">
      <div className="upload-viewer-modal">
        <h2 className="upload-viewer-title">Subir Visor</h2>

        <h2 className="share-viewer-title">Seleccione un tipo de visor </h2>
        <div className="upload-viewer-options">
          <label
            className="upload-option"
            onMouseEnter={() => setHoverText("Subí tus 2 archivos JSON para el visor Argenmap")}
            onMouseLeave={() => setHoverText("")}
          >
            <input
              type="file"
              accept=".json"
              multiple
              onChange={handleUploadViewerArgenmap}
              style={{ display: "none" }}
            />
            <img src="/assets/logoArgenmap.png" alt="Argenmap" />
            <span>Argenmap</span>
          </label>

          <div className="upload-separator"></div>

          <label
            className="upload-option"
            onMouseEnter={() => setHoverText("Subí un archivo JSON para el visor Kharta")}
            onMouseLeave={() => setHoverText("")}
          >
            <input
              type="file"
              accept=".json"
              onChange={handleUploadViewerKharta}
              style={{ display: "none" }}
            />
            <img src="/assets/logoArgenmap.png" alt="Kharta" />
            <span>Kharta</span>
          </label>
        </div>

        <div className="upload-hover-area">
          {hoverText && <p className="upload-hover-text">{hoverText}</p>}
        </div>

        <div className="upload-viewer-footer">
          <button className="upload-viewer-close-button" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );

};

export default UploadViewerModal;
