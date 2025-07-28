import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import ShareViewerModal from '../ShareViewerModal/ShareViewerModal';
import { getVisorById, getPublicVisors, getMyVisors, getGrupos, getGroupVisors, deleteVisor, getPermissions, changePublicStatus } from '../../api/configApi';
import Preview from '../Preview/Preview';
import './VisorManager.css';
import '../Preview/Preview.css';
import { useUser } from "../../context/UserContext"
import { useToast } from '../../context/ToastContext';
import { downloadViewer } from '../../utils/ViewerHandler';


const PUBLIC_VISOR_ACCESS = { sa: false, ga: false, editor: false }
const MY_VISOR_ACCESS = { sa: false, ga: true, editor: false, myvisors: true }

const VisorManager = () => {

  // States
  const [visores, setVisores] = useState([]);
  const [selectedVisor, setSelectedVisor] = useState(null);
  const [access, setAccess] = useState(PUBLIC_VISOR_ACCESS)
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [showShareViewerModal, setShowShareViewerModal] = useState(false);


  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => { });
  const [confirmData, setConfirmData] = useState({ title: "", message: "" });

  const [currentFilter, setCurrentFilter] = useState();

  // Hooks, Contexts
  const { isAuth, isAuthLoaded } = useUser();
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

    downloadViewer(configJson, null, selectedVisor.name) // Config, baseConfig nula, nombre
  };

  const handleDeleteVisor = async (visorCompleto) => {
    const visorid = visorCompleto.id;
    const visorgid = visorCompleto.gid;

    try {
      await deleteVisor(visorid, visorgid);
      showToast("Visor eliminado con éxito", "success");
      setSelectedVisor(null);
      setShowPreview(false);
      const vl = await getGroupVisors(visorgid)
      setVisores(vl)
    } catch (error) {
      console.error("Error al eliminar el visor:", error);
      showToast("Error al eliminar el visor", "error");
    }
  };

  const handleUploadViewer = (event) => {
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

  useEffect(() => {
    if (!isAuthLoaded) return;
    const loadInitialData = async () => {
      setIsLoading(true);
      setHasFetched(false);

      const lastPicked = sessionStorage.getItem("lastGroupPicked") || "public-visors";

      if (isAuth) {
        const gl = await getGrupos();
        setGroupList(gl);
      } else {
        setGroupList([]);
        setShowPreview(false)
        setSelectedVisor(null)
      }

      try {
        let vl, access;
        if (lastPicked === "public-visors") {
          vl = await getPublicVisors();
          access = PUBLIC_VISOR_ACCESS;
        } else if (lastPicked === "my-visors") {
          vl = await getMyVisors();
          access = MY_VISOR_ACCESS;
        } else if (isAuth) {
          vl = await getGroupVisors(lastPicked);
          access = await getPermissions(lastPicked);
        }
        setCurrentFilter(lastPicked)
        setVisores(vl);
        setAccess(access);
      } catch (error) {
        console.error("Error cargando visores del grupo:", error);
        showToast("Error al cargar visores del grupo guardado", "error");
        // fallback a visores públicos
        const vl = await getPublicVisors();
        setVisores(vl);
        setAccess(PUBLIC_VISOR_ACCESS);
      }

      setIsLoading(false);
      setHasFetched(true);
    };

    loadInitialData();
  }, [isAuth, isAuthLoaded]);

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
      sessionStorage.setItem("lastGroupPicked", e.target.value)
      setCurrentFilter(e.target.value)
      setAccess(PUBLIC_VISOR_ACCESS);
      const vl = await getPublicVisors()
      setVisores(vl)
    } else if (e.target.value === "my-visors") {
      sessionStorage.setItem("lastGroupPicked", e.target.value)
      setCurrentFilter(e.target.value)
      setAccess(MY_VISOR_ACCESS);
      const vl = await getMyVisors()
      setVisores(vl)
    } else if (e.target.value != '') {
      sessionStorage.setItem("lastGroupPicked", e.target.value)
      setCurrentFilter(e.target.value)
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

          <div className="visor-filter-navbar">
            <div className="visor-filter-buttons">
              <button
                className={currentFilter === "public-visors" ? "active" : ""}
                onClick={() => handleChange({ target: { value: "public-visors" } })}
              >
                PÚBLICOS
              </button>

              {isAuth && (
                <button
                  className={currentFilter === "my-visors" ? "active" : ""}
                  onClick={() => handleChange({ target: { value: "my-visors" } })}
                >
                  PROPIOS
                </button>
              )}

              {groupList?.map(grupo => (
                <button
                  key={grupo.id}
                  className={currentFilter === grupo.id ? "active" : ""}
                  onClick={() => handleChange({ target: { value: grupo.id } })}
                >
                  {grupo.name}
                </button>
              ))}
            </div>

            <div className="viewer-filter-divider" />


            {access !== PUBLIC_VISOR_ACCESS && (
              <div className="viewer-role">
                Tu rol dentro del grupo es: {
                  (access?.ga || access?.sa) ? "Administrador" :
                    access?.editor ? "Editor" :
                      access?.myvisors ? "Dueño" :
                        "Lector"
                }
              </div>
            )}
          </div>

          <div className="visor-modal-container">
            <div className={`visor-list-container ${showPreview ? 'preview-open' : 'preview-closed'}`}>
              <div className="visor-list">
                {isLoading && (
                  <div className="loading-message">
                    <span className="spinner" />
                    <span style={{ marginLeft: '10px' }}>Cargando visores...</span>
                  </div>
                )}
                {!isLoading && hasFetched && visores?.length === 0 && (
                  <p className="no-visors-message">No hay visores disponibles.</p>
                )}

                {!isLoading && visores?.length > 0 && visores?.map((visor) => (
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
                        console.log(visorCompleto)
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
                        {new Date(visor.lastupdate).toLocaleDateString('es-AR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                        {visor.publico == true && (
                          <i
                            className="fas fa-globe-americas viewer-public-icon"
                            title="Público"
                          ></i>
                        )}
                        {visor.publico == false && (
                          <i
                            className="fas fa-lock viewer-private-icon"
                            title="Privado"
                          ></i>
                        )}
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
                    navigate('/form');
                  }}>
                  <i className="fa-solid fa-plus"></i>
                  Crear
                </button>

                <label className="common">
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      handleUploadViewer(e);
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
                    /*             handleLoadViewer(selectedVisor); */
                    navigate('/form', { state: { viewer: selectedVisor, editorMode: true } });
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
                  className="share"
                  onClick={() => {
                    setShowShareViewerModal(true);
                  }} title="Compartir Visor">
                  <i className="fa-solid fa-share"></i>
                  Compartir
                </button>}

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
                    {new Date(selectedVisor.lastupdate).toLocaleDateString('es-AR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="visor-privacy">
                    {selectedVisor.publico ? 'Público' : 'Privado'}
                  </p>
                  <h3>Grupo: {selectedVisor.gname || 'Grupo: Sin grupo'}</h3>
                </div>
                <img
                  src={selectedVisor?.gimg || '/assets/no-image.png'}
                  alt="Imagen del grupo"
                  className="group-image-right"
                />
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

          {showShareViewerModal && (
            <div className="save-visor-modal-overlay">
              <ShareViewerModal
                // editorMode={editorMode}
                // cloneMode={cloneMode}
                visor={selectedVisor}
                isOpen={showShareViewerModal}
                onClose={() => setShowShareViewerModal(false)}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VisorManager;
