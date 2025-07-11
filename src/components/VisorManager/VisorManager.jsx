import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleClearStorage } from '../../utils/HandleClearStorage';
import { updateVisorConfigJson } from '../../utils/visorStorage';
import HandleDownload from '../../utils/HandleDownload';
import { handleFileChange } from '../../utils/HandleJsonUpload';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import { getVisorById, getPublicVisors, getMyVisors, getGrupos, getGroupVisors, deleteVisor, getPermissions, changePublicStatus } from '../../api/configApi';
import useFormEngine from '../../hooks/useFormEngine';
import Preview from '../Preview/Preview';
import './VisorManager.css';
import '../Preview/Preview.css';
import { useUser } from "../../context/UserContext"
import { useToast } from '../../context/ToastContext';

const PUBLIC_VISOR_ACCESS = { sa: false, ga: false, editor: false }
const MY_VISOR_ACCESS = { sa: false, ga: true, editor: false, myvisors: true }

const VisorManager = () => {

  // States
  const [visores, setVisores] = useState([]);
  const [selectedVisor, setSelectedVisor] = useState(null);
  const [access, setAccess] = useState(PUBLIC_VISOR_ACCESS)
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const { setData, uploadSchema } = useFormEngine();
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const defaultData = localStorage.getItem('formDataDefault');
  const parsedDefaultData = JSON.parse(defaultData);
  const [groupList, setGroupList] = useState([]);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => { });
  const [confirmData, setConfirmData] = useState({ title: "", message: "" });

  // Hooks, Contexts
  const { isAuth } = useUser()
  const { showToast } = useToast();

  const pedirConfirmacion = ({ title, message, onConfirm }) => {
    setConfirmData({ title, message });
    setConfirmAction(() => onConfirm);
    setConfirmVisible(true);
  };

  const handleDownload = () => {
    if (!selectedVisor?.config?.json) {
      showToast('No hay visor seleccionado con configuración válida.', "error");
      return;
    }

    const configJson = typeof selectedVisor.config.json === 'string'
      ? JSON.parse(selectedVisor.config.json)
      : selectedVisor.config.json;

    const { downloadJson } = HandleDownload({ data: configJson, parsedDefaultData });
    downloadJson(selectedVisor.name);
  };

  const handleNewVisor = () => {
    handleClearStorage(setData, uploadSchema);
    navigate('/form');
  };

  const handleFileUpload = (event) => {
    handleFileChange(event, setData, uploadSchema);
    navigate('/form');
  };

  const handleDeleteVisor = async (visorCompleto) => {
    const visorid = visorCompleto.id;
    const visorgid = visorCompleto.gid;

    try {
      await deleteVisor(visorid, visorgid);
      showToast("Visor eliminado con éxito", "success");
      uploadStartData();
      setSelectedVisor(null);
      setShowPreview(false);
    } catch (error) {
      console.error("Error al eliminar el visor:", error);
      showToast("Error al eliminar el visor", "error");
    }
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
    uploadStartData();
  }, []);

  useEffect(() => {
    if (!isAuth) {
      setGroupList([])
      setAccess(PUBLIC_VISOR_ACCESS)
      setIsLoading(true);
      setHasFetched(false);
    }
    uploadStartData()
  }, [isAuth]);

  const uploadStartData = async () => {
    if (isAuth) {
      const gl = await getGrupos()
      setGroupList(gl)
    }

    const vp = await getPublicVisors()
    setVisores(vp)
    setIsLoading(false);
    setHasFetched(true);
  }

  const publishVisor = async () => {
    const res = await changePublicStatus(selectedVisor.id, selectedVisor.gid)
    if (res.success) {
      // Tostar bien
      const visorCompleto = await getVisorById(selectedVisor.id);
      setSelectedVisor(visorCompleto);
      const action = selectedVisor.publico ? "despublicado" : "publicado"
      const type = selectedVisor.publico ? "warning" : "success"
      showToast(`Has ${action} el visor correctamente`, type);
    } else {
         showToast(`Ha ocurrido un error`, "error");
    }
  }

  const handleChange = async (e) => {
    setSelectedVisor(null)
    setShowPreview(false)
    if (e.target.value === "public-visors") {
      setAccess(PUBLIC_VISOR_ACCESS);
      const vl = await getPublicVisors()
      setVisores(vl)
    } else if (e.target.value === "my-visors") {
      setAccess(MY_VISOR_ACCESS);
      const vl = await getMyVisors()
      setVisores(vl)
    } else if (e.target.value != '') {
      const vl = await getGroupVisors(e.target.value)
      const access = await getPermissions(e.target.value)
      setAccess(access)
      setVisores(vl)
    }
  }

  return (
    <div className={`${showPreview ? 'container-display-1' : 'container-display-0'}`}>

      {showPreview && (
        <div className='side-panel'>
          <Preview />
        </div>
      )}

      <div className={`visor-content ${showPreview ? 'flex-0' : 'flex-1'}`}>
        <div className="visor-modal">
          <h2>GESTOR DE VISORES</h2>

          <div className="visor-filter">
            <label htmlFor="visor-type">Mostrando: </label>
            <select
              id="visor-type"
              defaultValue={"public-visors"}
              onChange={handleChange}
            >
              <option value="public-visors">Visores Públicos</option>
              {isAuth && <option value="my-visors">Mis Visores</option>}
              {groupList?.map(grupo => (
                <option key={grupo.id} value={grupo.id}>
                  Visores de {grupo.name}
                </option>
              ))}
            </select>
            {access !== PUBLIC_VISOR_ACCESS && (
              <label htmlFor="visor-type">
                Tu rol dentro del grupo es: {
                  (access?.ga || access?.sa) ? "Administrador" :
                    access?.editor ? "Editor" :
                      access?.myvisors ? "Dueño" :
                        "Lector"
                }
              </label>
            )}
          </div>

          <div className="visor-modal-container">
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
                        showToast('No se pudo cargar el visor.', "error");
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
                      <p className="visor-date">
                        Actualizado: {new Date(visor.lastupdate).toLocaleDateString('es-AR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
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
                  Crear
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
                  Subir
                </label>

                {(access?.sa || access?.ga || access?.editor || access?.myvisors) && <button
                  className="common"
                  onClick={() => {
                    if (!selectedVisor) return;
                    handleLoadVisor(selectedVisor);
                    navigate('/form', { state: { visor: selectedVisor, editorMode: true } });
                  }}
                  disabled={!selectedVisor}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                  Editar
                </button>}

                {(access?.sa || access?.ga) && <button
                  className="delete"
                  onClick={() =>
                    pedirConfirmacion({
                      title: "¿Estás seguro?",
                      message: "Esto eliminará el visor.",
                      onConfirm: () => {
                        if (!selectedVisor) return;
                        setConfirmVisible(false);
                        handleDeleteVisor(selectedVisor);
                      },
                    })
                  }
                  disabled={!selectedVisor}
                  title="Borrar Visor">
                  <i className="fa-solid fa-trash-can"></i>
                  Borrar
                </button>}

                <button
                  className="download"
                  onClick={handleDownload}
                  title="Descargar JSON">
                  <i className="fa-solid fa-download"></i>
                  Descargar
                </button>

                {((access?.sa || access?.ga) && !access?.myvisors && selectedVisor) && <button
                  className="publish"
                  onClick={publishVisor}
                  title="Estado de Publicacion">
                  <i className="fa-solid fa-bullhorn"></i>
                  {selectedVisor?.publico ? "Despublicar" : "Publicar"}
                </button>}

              </div>
            </div>
          </div>

          {selectedVisor && (
            <div className="visor-description">
              <div className="visor-info-row">
                <div className="visor-info-text">
                  <h3>{selectedVisor.name}</h3>
                  <p>{selectedVisor.description}</p>
                  <p className="visor-date">
                    Actualizado: {new Date(selectedVisor.lastupdate).toLocaleDateString('es-AR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="visor-privacy">
                    {selectedVisor.publico ? 'Público' : 'Privado'}
                  </p>
                  {(() => {
                    const group = groupList?.find(g => g.id === selectedVisor.gid);
                    return group ? <h3>Grupo: {group.name}</h3> : <h3>Grupo: Sin grupo</h3>;
                  })()}
                </div>
                {(() => {
                  const group = groupList?.find(g => g.id === selectedVisor.gid);
                  const imageSrc = group?.img || '/assets/no-image.png';
                  return (
                    <img
                      src={imageSrc}
                      alt="Imagen del grupo"
                      className="group-image-right"
                    />
                  );
                })()}
              </div>
            </div>
          )}

          <ConfirmDialog
            isOpen={confirmVisible}
            title={confirmData.title}
            message={confirmData.message}
            onConfirm={() => {
              confirmAction();
              setConfirmVisible(false);
            }}
            onCancel={() => setConfirmVisible(false)}
          />

        </div>
      </div>
    </div>
  );
};

export default VisorManager;
