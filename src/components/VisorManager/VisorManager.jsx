import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleClearStorage } from '../../utils/HandleClearStorage';
/* import { fetchVisores } from '../../utils/FetchVisors'; */
import { updateVisorConfigJson } from '../../utils/visorStorage';
import HandleDownload from '../../utils/HandleDownload';
import { handleFileChange } from '../../utils/HandleJsonUpload';
import { getVisorById, getPublicVisors, getMyVisors, getGrupos, getGroupVisors } from '../../api/configApi';
import useFormEngine from '../../hooks/useFormEngine';
import Preview from '../Preview/Preview';
import './VisorManager.css';
import '../Preview/Preview.css';

const VisorManager = () => {
  const [visores, setVisores] = useState([]);
  const [selectedVisor, setSelectedVisor] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const { setData, uploadSchema } = useFormEngine();
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const defaultData = localStorage.getItem('formDataDefault');
  const parsedDefaultData = JSON.parse(defaultData);

  const [groupList, setGroupList] = useState([]);

  const handleDownload = () => {
    if (!selectedVisor?.config?.json) {
      alert('No hay visor seleccionado con configuración válida');
      return;
    }

    const configJson = typeof selectedVisor.config.json === 'string'
      ? JSON.parse(selectedVisor.config.json)
      : selectedVisor.config.json;

    const { downloadJson } = HandleDownload({ data: configJson, parsedDefaultData });
    downloadJson();
  };

  const handleNewVisor = () => {
    handleClearStorage(setData, uploadSchema);
    navigate('/form');
  };

  const handleFileUpload = (event) => {
    handleFileChange(event, setData, uploadSchema);
    navigate('/form');
  };

  const handleLoadVisor = (visorCompleto) => {
    const configJson = typeof visorCompleto.config.json === 'string'
      ? JSON.parse(visorCompleto.config.json)
      : visorCompleto.config.json;

    visorCompleto.config.json = configJson;
    localStorage.setItem('visorMetadata', JSON.stringify(visorCompleto));
    updateVisorConfigJson(configJson);
  };

  useEffect(() => {
    setIsLoading(true);
    setHasFetched(false);

    uploadStartData()
    /*     fetchVisores((data) => {
          setVisores(data);
          setIsLoading(false);
          setHasFetched(true);
        }); */
  }, []);

  const uploadStartData = async () => {
    const vp = await getPublicVisors()
    setVisores(vp)
    setIsLoading(false);
    setHasFetched(true);

    const gl = await getGrupos()
    setGroupList(gl)
  }
  const handleChange = async (e) => {
    if (e.target.value === "public-visors") {
      const vl = await getPublicVisors()
      setVisores(vl)
    } else if (e.target.value === "my-visors") {
      const vl = await getMyVisors()
      setVisores(vl)
    } else if (e.target.value != ''){
      const vl = await getGroupVisors(e.target.value)
      setVisores(vl)
    }
  }

  return (
    <div className={`${showPreview ? 'container-display-1' : 'container-display-0'}`}>
      <div className={`visor-conent ${showPreview ? 'flex-0' : 'flex-1'}`}>
        <div className="visor-modal">
          <h2>VISOR MANAGER</h2>
          <div className="visor-modal-container">

            <div className="visor-filter">
              <label htmlFor="visor-type">Mostrar: </label>
              <select
                id="visor-type"
                defaultValue={"public-visors"}
                // value={tipoSeleccionado}
                onChange={handleChange}
              >
                <option value="public-visors">Visores Públicos</option>
                <option value="my-visors">Mis Visores</option>
                {groupList?.map(grupo => (
                    <option key={grupo.id} value={grupo.id}>
                      Visores de {grupo.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className='visor-list-container'>
              <div className="visor-list">
                {isLoading && (
                  <div className="loading-message">
                    <span className="spinner" />
                    <span style={{ marginLeft: '10px' }}>Cargando visores...</span>
                  </div>
                )}
                {!isLoading && hasFetched && visores.length === 0 && (
                  <p className="no-visors-message">No hay visores disponibles.</p>
                )}

                {!isLoading && visores.length > 0 && visores.map((visor) => (
                  <div
                    key={visor.id}
                    className={`visor-item ${selectedVisor?.id === visor.id ? 'selected' : ''}`}
                    onClick={async () => {
                      if (selectedVisor?.id === visor.id) {
                        setSelectedVisor(null);
                        setShowPreview(false);
                        return;
                      }
                      try {
                        const visorCompleto = await getVisorById(visor.id);
                        setSelectedVisor(visorCompleto);
                        setShowPreview(true);
                      } catch (error) {
                        console.error('Error al obtener visor completo:', error);
                        alert('No se pudo cargar el visor');
                      }
                    }}
                  >

                    <img
                      src={visor.img || '/assets/no-image.png'}
                      alt="img"
                      className="visor-image"
                    />
                    <div className="visor-info">
                      <h3>{visor.name}</h3>
                      <p>{visor.description}</p>
                    </div>
                  </div>

                ))}

              </div>
            </div>
            <div className="visor-modal-actions">
              <div className="global-buttons">
                <button
                  className="common"
                  onClick={() => {
                    handleNewVisor();
                  }}>
                  <i className="fa-solid fa-plus"></i>
                  Nuevo Visor
                </button>

                <label className="common">
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      handleFileUpload(e);
                    }}
                    style={{ display: "none" }}
                    title="Subir JSON"
                  />
                  <span className="icon">
                    <i className="fa-solid fa-upload" style={{ cursor: "pointer" }}></i>
                  </span>
                  Subir Json
                </label>

                <button
                  className="common"
                  onClick={() => {
                    if (!selectedVisor) return;
                    handleLoadVisor(selectedVisor);
                    navigate('/form', { state: { visor: selectedVisor, editorMode: true } });
                  }}
                  disabled={!selectedVisor}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                  Editar Visor
                </button>

                <button
                  className="delete"
                  // onClick={}
                  title="Borrar Visor">
                  <i className="fa-solid fa-trash-can"></i>
                  Borrar Visor
                </button>

                <button
                  className="download"
                  onClick={handleDownload}
                  title="Descargar JSON">
                  <i className="fa-solid fa-download"></i>
                  Descargar
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className='side-panel'>
          <Preview />
        </div>
      )}
    </div>
  );
};

export default VisorManager;
