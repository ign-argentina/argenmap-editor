import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import ShareViewerModal from '../ShareViewerModal/ShareViewerModal';
import UploadViewerModal from '../UploadViewerModal/UploadViewerModal';
import { getVisorById, getPublicVisors, getMyVisors, getGrupos, getGroupVisors, deleteVisor, getPermissions, changePublicStatus } from '../../api/configApi';
import './ViewerManager.css';
import '../Preview/Preview.css';
import { useUser } from "../../context/UserContext"
import { useToast } from '../../context/ToastContext';
import { downloadViewer } from '../../utils/ViewerHandler';


const PUBLIC_VISOR_ACCESS = { sa: false, ga: false, editor: false }
const MY_VISOR_ACCESS = { sa: false, ga: true, editor: false, myvisors: true }

const ViewerManager = () => {
  // States
  const [viewers, setViewers] = useState([]);
  const [selectedViewer, setSelectedViewer] = useState(null);
  const [access, setAccess] = useState(PUBLIC_VISOR_ACCESS)
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [showShareViewerModal, setShowShareViewerModal] = useState(false);
  const [showUploadViewerModal, setShowUploadViewerModal] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => { });
  const [confirmData, setConfirmData] = useState({ title: "", message: "" });
  const [contextMenuVisorId, setContextMenuVisorId] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showDescriptionModal, setShowDescriptionModal] = useState(null);
  const [currentFilter, setCurrentFilter] = useState(() => {
    // Inicializamos el estado al montar el componente, no en cada render. 
    return sessionStorage.getItem("lastGroupPicked") || "public-visors";
  });

  const closeContextMenu = () => {
    setContextMenuVisorId(null);
  };

  useEffect(() => {
    const handleClickOutside = () => closeContextMenu();
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Hooks, Contexts
  const { isAuth, isAuthLoaded } = useUser();
  const { showToast } = useToast();

  const pedirConfirmacion = ({ title, message, onConfirm }) => {
    setConfirmData({ title, message });
    setConfirmAction(() => onConfirm);
    setConfirmVisible(true);
  };

  const handleDownload = () => {
    if (!selectedViewer?.config?.json) {
      showToast('No hay visor seleccionado con configuración válida.', "error");
      return;
    }

    const configJson = typeof selectedViewer.config.json === 'string'
      ? JSON.parse(selectedViewer.config.json)
      : selectedViewer.config.json;

    downloadViewer(configJson, null, selectedViewer.name) // Config, baseConfig nula, nombre
  };

  const handleDeleteVisor = async (visorCompleto) => {
    const visorid = visorCompleto.id;
    const visorgid = visorCompleto.gid;

    try {
      await deleteVisor(visorid, visorgid);
      showToast("Visor eliminado con éxito", "success");
      setSelectedViewer(null);
      const vl = await getGroupVisors(visorgid)
      setViewers(vl)
    } catch (error) {
      console.error("Error al eliminar el visor:", error);
      showToast("Error al eliminar el visor", "error");
    }
  };

  useEffect(() => {
    if (!isAuthLoaded) return;
    const loadInitialData = async () => {
      setIsLoading(true);
      setHasFetched(false);

      if (isAuth) {
        const gl = await getGrupos();
        setGroupList(gl);
      } else {
        setGroupList([]);
        setSelectedViewer(null);
      }

      try {
        let vl, access;
        if (currentFilter === "public-visors") {
          vl = await getPublicVisors();
          access = PUBLIC_VISOR_ACCESS;
        } else if (currentFilter === "my-visors") {
          vl = await getMyVisors();
          access = MY_VISOR_ACCESS;
        } else if (isAuth) {
          vl = await getGroupVisors(currentFilter);
          access = await getPermissions(currentFilter);
        }
        setViewers(vl);
        setAccess(access);
      } catch (error) {
        console.error("Error loading viewers:", error);
        showToast("Error loading viewers", "error");
        // Fallback to public viewers
        const vl = await getPublicVisors();
        setViewers(vl);
        setAccess(PUBLIC_VISOR_ACCESS);
        setCurrentFilter("public-visors");
        sessionStorage.setItem("lastGroupPicked", "public-visors");
      }

      setIsLoading(false);
      setHasFetched(true);
    };

    loadInitialData();
  }, [isAuth, isAuthLoaded]);

  const publishVisor = async () => {
    const res = await changePublicStatus(selectedViewer.id, selectedViewer.gid)
    if (res.success) {
      // Tostar bien
      const visorCompleto = await getVisorById(selectedViewer.id);
      setSelectedViewer(visorCompleto);
      const action = selectedViewer.publico ? "despublicado" : "publicado"
      const type = selectedViewer.publico ? "warning" : "success"
      showToast(`Has ${action} el visor correctamente`, type);
    } else {
      showToast(`Ha ocurrido un error`, "error");
    }
  }

  const handleChange = async (value) => {
    setSelectedViewer(null);
    setShowDescriptionModal(false);
    setCurrentFilter(value);
    sessionStorage.setItem("lastGroupPicked", value);

    if (value === "public-visors") {
      setAccess(PUBLIC_VISOR_ACCESS);
      const vl = await getPublicVisors();
      setViewers(vl);
    } else if (value === "my-visors") {
      setAccess(MY_VISOR_ACCESS);
      const vl = await getMyVisors();
      setViewers(vl);
    } else if (value !== '') {
      const vl = await getGroupVisors(value);
      const access = await getPermissions(value);
      setAccess(access);
      setViewers(vl);
    }
  };

  return (
    <>
      <div className='container-display-0'>
        <div className="viewer-content flex-1">
          <div className="viewer-modal">
            <h2>GESTOR DE VISORES</h2>

            {hasFetched && !isLoading && (<div className="viewer-filter-navbar">
              <div className="viewer-filter-buttons">
                <button
                  className={currentFilter === "public-visors" ? "active" : ""}
                  onClick={() => handleChange("public-visors")}
                >
                  PÚBLICOS
                </button>

                {isAuth && (
                  <button
                    className={currentFilter === "my-visors" ? "active" : ""}
                    onClick={() => handleChange("my-visors")}
                  >
                    PROPIOS
                  </button>
                )}

                {groupList?.map(grupo => (
                  <button
                    key={grupo.id}
                    className={currentFilter == grupo.id ? "active" : ""}
                    onClick={() => handleChange(grupo.id)}
                  >
                    {grupo.name.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="viewer-filter-divider" />

              <div className="viewer-role">
                {access !== PUBLIC_VISOR_ACCESS ? (
                  <>
                    Tu rol dentro del grupo es:{' '}
                    {(access?.ga || access?.sa) ? "Administrador" :
                      access?.editor ? "Editor" :
                        access?.myvisors ? "Dueño" :
                          "Lector"}
                  </>
                ) : (
                  "Listado de visores públicos"
                )}
              </div>
            </div>
            )}

            <div className="viewer-modal-container">
              <div className={`viewer-list-container ${showDescriptionModal ? 'viewer-description-open' : 'viewer-description-closed'}`}>
                <div className="background-overlay" />
                <div className="viewer-list">
                  {isLoading ? (
                    <div className="loading-message">
                      <span className="spinner" />
                      <span style={{ marginLeft: '10px' }}>Cargando visores...</span>
                    </div>
                  ) : !Array.isArray(viewers) || viewers.length === 0 ? (
                    <p className="no-viewers-message">No hay visores disponibles.</p>
                  ) : (
                    viewers.map((visor) => (
                      <div
                        key={visor.id}
                        className={`viewer-item ${selectedViewer?.id === visor.id ? 'selected' : ''}`}
                        onClick={async () => {
                          if (selectedViewer?.id === visor.id) {
                            setSelectedViewer(null);
                            setShowDescriptionModal(false);
                            return;
                          }
                          try {
                            const visorCompleto = await getVisorById(visor.id);
                            setSelectedViewer(visorCompleto);
                            setShowDescriptionModal(true);
                          } catch (error) {
                            showToast('No se pudo cargar el visor.', "error");
                          }
                        }}
                      >
                        <div
                          className="viewer-context-button"
                          title="Más opciones"
                          onClick={async (e) => {
                            if (contextMenuVisorId === visor.id) {
                              closeContextMenu();
                            } else {
                              e.stopPropagation();
                              setContextMenuVisorId(visor.id);
                              setContextMenuPosition({ x: e.clientX, y: e.clientY });
                              try {
                                const visorCompleto = await getVisorById(visor.id);
                                setSelectedViewer(visorCompleto);
                              } catch (error) {
                                showToast('No se pudo cargar el visor.', "error");
                              }
                            }
                          }}
                        >
                          <i className="fas fa-ellipsis-v"></i>
                        </div>

                        <img
                          src={visor.img || '/assets/no-image.png'}
                          alt="img"
                          className="viewer-image"
                        />
                        <div className="viewer-info">
                          <h3>{visor.name}</h3>
                          <p>{visor.description}</p>
                          <p className="viewer-date">
                            {new Date(visor.lastupdate).toLocaleDateString('es-AR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                            {visor.publico ? (
                              <i className="fas fa-globe-americas viewer-public-icon" title="Público"></i>
                            ) : (
                              <i className="fas fa-lock viewer-private-icon" title="Privado"></i>
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  )}

                </div>
              </div>
              <div className="viewer-modal-actions">
                <div className="global-buttons">
                  <button
                    className="btn-common"
                    title="Crear nuevo visor"
                    onClick={() => {
                      navigate('/form');
                    }}>
                    <i className="fa-solid fa-plus"></i>
                    Crear
                  </button>

                  <button
                    className="btn-common"
                    title="Subir visor"
                    onClick={() => {
                      setShowUploadViewerModal(true);
                    }}>
                    <i className="fa-solid fa-upload"></i>
                    Subir Nuevo
                  </button>

                </div>
              </div>
            </div>

            {showDescriptionModal && (
              <div className="viewer-description">
                <div className="viewer-info-row">
                  <div className="viewer-info-text">
                    <h3>{selectedViewer.name}</h3>
                    <p>{selectedViewer.description}</p>
                    <p className="viewer-date">
                      {new Date(selectedViewer.lastupdate).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="viewer-privacy">
                      {selectedViewer.publico ? 'Público' : 'Privado'}
                    </p>
                    <h3>Grupo: {selectedViewer.gname || 'Grupo: Sin grupo'}</h3>
                  </div>
                  <img
                    src={selectedViewer?.gimg || '/assets/no-image.png'}
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
              <div className="save-viewer-modal-overlay">
                <ShareViewerModal
                  // editorMode={editorMode}
                  // cloneMode={cloneMode}
                  visor={selectedViewer}
                  isOpen={showShareViewerModal}
                  onClose={() => setShowShareViewerModal(false)}
                />
              </div>
            )}

            {showUploadViewerModal && (
              <div className="save-viewer-modal-overlay">
                <UploadViewerModal
                  isOpen={showUploadViewerModal}
                  onClose={() => setShowUploadViewerModal(false)}
                />
              </div>
            )}

          </div>
        </div>

        {contextMenuVisorId && (
          <div
            className="viewer-context-menu"
            style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {(access?.sa || access?.ga || access?.editor || access?.myvisors) && <button
                onClick={() => {
                  if (!selectedViewer) return;
                  navigate('/form', { state: { viewer: selectedViewer, editorMode: true } });
                }}
                disabled={!selectedViewer}
              >
                <i className="fa-solid fa-pen-to-square"></i>
                Editar
              </button>}

              {((access?.sa || access?.ga) && !access?.myvisors && selectedViewer) && <button
                onClick={publishVisor}
                title="Estado de Publicacion">
                <i className="fa-solid fa-bullhorn"></i>
                {selectedViewer?.publico ? "Despublicar" : "Publicar"}
              </button>}

              {((access?.sa || access?.ga) && !access?.myvisors && selectedViewer) && <button
                onClick={() => {
                  setShowShareViewerModal(true);
                  closeContextMenu();
                }} title="Compartir Visor">
                <i className="fa-solid fa-share"></i>
                Compartir
              </button>}

              <button
                className="btn-download"
                onClick={handleDownload}
                title="Descargar JSON">
                <i className="fa-solid fa-download"></i>
                Descargar
              </button>

              {(access?.sa || access?.ga) && <button
                className="btn-delete"
                onClick={() =>
                  pedirConfirmacion({
                    title: "¿Estás seguro?",
                    message: "Esto eliminará el visor.",
                    onConfirm: () => {
                      if (!selectedViewer) return;
                      setConfirmVisible(false);
                      handleDeleteVisor(selectedViewer);
                    },
                  })
                }
                disabled={!selectedViewer}
                title="Borrar Visor">
                <i className="fa-solid fa-trash-can"></i>
                Borrar
              </button>}

            </div>
          </div>
        )}
      </div>
      {/* )} */}
    </>
  );
};

export default ViewerManager;
