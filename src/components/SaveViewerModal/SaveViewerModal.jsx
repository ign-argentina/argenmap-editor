import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SaveViewerModal.css';
import { useUser } from '../../context/UserContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { updateVisor, createVisor, getManageGroups } from "../../api/configApi.js"

const SaveViewerModal = ({ isOpen, onClose, viewer, editorMode = false, cloneMode = false, getWorkingConfig }) => {

  const [name, setName] = useState(editorMode ? viewer?.name : "");
  const [description, setDescription] = useState(editorMode ? viewer?.description : "");
  const [imageData, setImageData] = useState(editorMode ? viewer?.img : null)
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(editorMode ? viewer?.gid : 'no-group')
  const [groupList, setGroupList] = useState([])
  const [isPublic, setIsPublic] = useState(false)
  const { showToast } = useToast()
  const { checkAuth, isAuth } = useUser()
  const navigate = useNavigate();

  const loadGroups = async () => {
    const groups = await getManageGroups()
    setGroupList(groups);
  }

  const handleSelectGroupChange = async (e) => {
    if (e.target.value === "no-group" || e.target.value === "my-visors") {
      setSelectedGroup(null)
      setIsPublic(false)
    } else {
      setSelectedGroup(e.target.value)
    }
  }

  useEffect(() => {
    checkAuth()
    loadGroups()
  }, []);

  const captureViewerImage = async () => {
    const config = getWorkingConfig();

    setIsCapturing(true);

    try {
      // SACAR HARCODEO
      const response = await fetch('http://localhost:4000/kharta/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ config: config })
      });

      if (!response.ok) {
        throw new Error("No se pudo generar la imagen");
      }

      const data = await response.json();
      setImageData(data.img);
      showToast("Imagen capturada correctamente.", "success");

    } catch (err) {
      console.error("Error al capturar imagen:", err);
      showToast("Error al capturar imagen del visor.", "error");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      showToast('Solo se permiten imágenes JPG o PNG.', "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 300;
        const scale = MAX_WIDTH / img.width;
        const canvas = document.createElement('canvas');
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const resizedImage = canvas.toDataURL(file.type);
        setImageData(resizedImage);
        showToast('Imagen subida correctamente', "success");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!name.trim()) return showToast('El nombre es obligatorio', "error");

    if (imageData && !imageData.startsWith('data:image/png') && !imageData.startsWith('data:image/jpeg')) {
      return showToast('Formato de imagen inválido', "error");
    }

    if (selectedGroup != 'no-group') {
      saveVisor()
      setName('');
      setDescription('');
      setImageData(null);
      sessionStorage.setItem("lastGroupPicked", `${(selectedGroup === null ? "my-visors" : selectedGroup)}`);
      navigate('/');
    } else {
      showToast("El visor debe ser asignado en un grupo.", "error")
    }
  };

  const saveVisor = async () => {
    const config = getWorkingConfig()
    if (!config) {
      showToast('No hay configuración para guardar.', "error");
      return;
    }
    let res;
    if (editorMode && !cloneMode) {
      res = await updateVisor(viewer.id, viewer.gid, name, description, viewer.config.id, config, imageData)
    } else {
      res = await createVisor(selectedGroup, name, description, config, imageData, isPublic)
    }

    if (res.success) {
      showToast("Cargado con exito.", "success");
    } else {
      showToast("Ha ocurrido un error.", "error");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="save-viewer-modal-overlay">
      <div className="save-viewer-modal">
        <h3>{editorMode && !cloneMode ? "Guardar Cambios" : "Crear Nuevo Visor"}</h3>
        <span>{cloneMode ? "Crearás un nuevo visor para el grupo a partir de las mismas caracteristicas que este" : null}</span>
        <input
          type="text"
          placeholder="Nombre del visor"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
        />

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={255}
        />
        <div style={{ textAlign: 'right', fontSize: '0.85em', color: '#666' }}>
          {description?.length}/255
        </div>

        {imageData == null ? (
          <div className="image-options">
            {!isCapturing && (
              <button onClick={captureViewerImage}>
                Capturar imagen del visor
              </button>
            )}

            <label className="upload-image-from-pc">
              Subir imagen desde PC
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        ) : (
          <button onClick={() => setImageData(null)}>Limpiar imagen</button>
        )}

        {isCapturing && (
          <div className="loading-indicator">
            <div className="spinner" />
            <span>Generando imagen...</span>
          </div>
        )}

        {imageData && (
          <img
            src={imageData}
            alt="Vista previa"
            style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '10px' }}
          />
        )}

        {(!editorMode && isAuth) ?
          <>
            <h3>Selecciona un grupo al cual quieras agregar este editor</h3>
            <select defaultValue="no-group" id="group-select" onChange={handleSelectGroupChange}>
              <option disabled value="no-group">-- Selecciona un grupo --</option>
              {groupList?.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.name}
                </option>
              ))}
              <option key={null} value="my-visors">
                Mis Visores
              </option>
            </select>
          </> : null}


        {(!editorMode && selectedGroup != null && selectedGroup != 'no-group') ?
          <div className="visibility-option">
            <label>
              ¿Deseas hacer visible este visor?
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
            </label>
            {isPublic && (
              <p className="public-warning">
                <span>Atención: </span>Si haces público este visor, todos podrán verlo.
              </p>
            )}
          </div> : null}
        <div className="modal-buttons">
          <button className="save" onClick={handleSubmit} disabled={isCapturing}>Guardar</button>
          <button className="cancel" onClick={onClose}>Cancelar</button>
        </div>

      </div>
    </div>
  );
};

export default SaveViewerModal;