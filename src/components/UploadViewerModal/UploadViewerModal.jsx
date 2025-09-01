import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext.jsx';
import { useNavigate } from 'react-router-dom';
import './UploadViewerModal.css';

const UploadViewerModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { showToast } = useToast()
  const [hoverText, setHoverText] = useState("");
  const [khartaFile, setKhartaFile] = useState(null);
  const [khartaError, setKhartaError] = useState("");
  const [preferencesFile, setPreferencesFile] = useState(null);
  const [dataFile, setDataFile] = useState(null);
  const [error, setError] = useState("");

  const handleUploadKhartaFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);

        if (!json.configVersion) {
          throw new Error("El JSON no tiene la propiedad 'configVersion'");
        }

        setKhartaFile({ file, json });
        setKhartaError("");
        navigate('/form', {
          state: {
            externalUpload: {
              type: "isKharta",
              files: {
                config: { json }
              }
            }
          }
        });
      } catch (err) {
        setKhartaFile(null);
        setKhartaError(`❌ ${file.name}: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const validateFile = (file, content) => {
    try {
      const json = JSON.parse(content);

      // Validar preferences.json
      if (file.name.toLowerCase().includes("preferences")) {
        if (!json.mapConfig || !json.table || !json.charts) {
          throw new Error("Estructura inválida en preferences.json");
        }
        setPreferencesFile({ file, json });
        return;
      }

      // Validar data.json
      if (file.name.toLowerCase().includes("data")) {
        if (!Array.isArray(json.items)) {
          throw new Error("Estructura inválida en data.json");
        }
        setDataFile({ file, json });
        return;
      }

      throw new Error("El archivo no es válido para Argenmap");
    } catch (err) {
      setError(`${file.name}: ${err.message}`);
    }
  };

  const handleFiles = (files) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => validateFile(file, e.target.result);
      reader.readAsText(file);
    });
  };

  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   setError("");
  //   handleFiles(e.dataTransfer.files);
  // };

  const handleInputChange = (e) => {
    setError("");
    handleFiles(e.target.files);
  };

  useEffect(() => {
    if (preferencesFile && dataFile) {
      navigate('/form', {
        state: {
          isArgenmap: true,
          externalUpload: {
            files: {
              preferences: preferencesFile.json,
              data: dataFile.json
            }
          }
        }
      });
    }
  }, [preferencesFile, dataFile, navigate]);

  if (!isOpen) return null;

  return (
    <div className="upload-viewer-modal-overlay">
      <div className="upload-viewer-modal">
        <h2 className="create-viewer-title">
          <i className="fa-solid fa-upload upload-title-icon"></i>
          Subir nuevo visor
        </h2>

        <h2 className="create-viewer-subtitle">
          Seleccione un tipo de visor para su proyecto
        </h2>

        <div className="upload-viewer-options">

          <div
            className="upload-option"
            onClick={() => document.getElementById("fileInput").click()}
            onDrop={(e) => {
              e.preventDefault();
              setError("");
              handleFiles(e.dataTransfer.files);
            }}
            onDragOver={(e) => e.preventDefault()}
            onMouseEnter={() =>
              setHoverText("Subir preferences.json y data.json para Argenmap")
            }
            onMouseLeave={() => setHoverText("")}
          >
            <img src="/assets/logoArgenmap.png" alt="Argenmap" />
            <span>Argenmap</span>

            <input
              id="fileInput"
              type="file"
              accept=".json"
              multiple
              onChange={handleInputChange}
              style={{ display: "none" }}
              onDrop={(e) => e.preventDefault()}
            />
          </div>

          <div className="upload-separator"></div>

          <label
            className="upload-option"
            onClick={() => document.getElementById("fileInputKharta").click()}
            onDrop={(e) => {
              e.preventDefault();
              const files = e.dataTransfer.files;
              if (files.length === 0) return;
              handleUploadKhartaFile({ target: { files } });
            }}
            onDragOver={(e) => e.preventDefault()}
            onMouseEnter={() => setHoverText("Subí un archivo JSON válido para Kharta")}
            onMouseLeave={() => setHoverText("")}
          >
            <img src="/assets/logoArgenmap.png" alt="Kharta" />
            <span>Kharta</span>

            <input
              id="fileInputKharta"
              type="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={handleUploadKhartaFile}
              onDrop={(e) => e.preventDefault()}
            />
          </label>

        </div>

        <div className="upload-feedback">
          {preferencesFile && <p>✅ {preferencesFile.file.name} cargado correctamente</p>}
          {dataFile && <p>✅ {dataFile.file.name} cargado correctamente</p>}
          {error && <p className="upload-error">❌Argenmap: {error}</p>}
        </div>

        <div className="upload-feedback">
          {khartaError && <p className="upload-error">❌Kharta: {khartaError}</p>}
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
