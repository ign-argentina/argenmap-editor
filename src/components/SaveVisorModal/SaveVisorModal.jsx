import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import './SaveVisorModal.css';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext.jsx';
import { updateVisor, createVisor, getManageGroups } from "../../api/configApi.js"

const SaveVisorModal = ({ isOpen, onClose, visor, editorMode = false, cloneMode = false }) => {

  const [name, setName] = useState(editorMode ? visor?.name : "");
  const [description, setDescription] = useState(editorMode ? visor?.description : "");
  const [imageData, setImageData] = useState(editorMode ? visor?.img : null)

  const [selectedGroup, setSelectedGroup] = useState(editorMode ? visor?.gid : 'no-group')
  const [groupList, setGroupList] = useState([])
  const [isPublic, setIsPublic] = useState(false)
  const { showToast } = useToast()
  const {checkAuth, isAuth} = useUser()
  const navigate = useNavigate();

  const loadGroups = async () => {
    const groups = await getManageGroups()
    setGroupList(groups);
  }

  const handleSelectChange = async (e) => {
    if (e.target.value === "no-group" || e.target.value === "") {
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

  const captureIframeImage = async () => {
    const iframe = document.querySelector('iframe');
    try {
      const canvas = await html2canvas(iframe.contentDocument.body);
      const image = canvas.toDataURL('image/png');
      setImageData(image);
      setSource('captura');
      showToast('Imagen capturada correctamente.', "success");
    } catch (err) {
      showToast('No se pudo capturar la imagen del visor.', "error");
      console.error(err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Validar el tipo de archivo
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
        const resizedImage = canvas.toDataURL(file.type); // Usa el tipo original (jpg o png)
        setImageData(resizedImage);
        setSource('upload');
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
      setSource(null);
      navigate('/');
    } else {
      showToast("El visor debe ser asignado en una ubicación.", "error")
    }
  };

  const saveVisor = async () => {
    {
      let res;
      const currentJsonRaw = localStorage.getItem('visorMetadata');
      const currentJsonParsed = currentJsonRaw ? JSON.parse(currentJsonRaw) : {};
      const configOnly = currentJsonParsed.config;
      if (!currentJsonRaw) {
        showToast('No hay configuración para guardar.', "error");
        return;
      }

      if (editorMode && !cloneMode) {
        res = await updateVisor(visor.id, visor.gid, name, description, configOnly.id, configOnly.json, imageData)
      } else {
        res = await createVisor(selectedGroup, name, description, configOnly.json, imageData, isPublic)
      }

      if (res.success) {
        showToast("Cargado con exito.", "success");
      } else {
        showToast("Ha ocurrido un error.", "error");
      }
    }
  }

  if (!isOpen) return null;

  return (
    <div className="save-visor-modal-overlay">
      <div className="save-visor-modal">
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
          {description.length}/255
        </div>

        {imageData == null ? <div className="image-options">
          <button onClick={captureIframeImage}>
            Capturar imagen del visor
          </button>

          <label className={`upload-image-from-pc`}>
            Subir imagen desde PC
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageUpload}            
              style={{ display: 'none' }}
            />
          </label>
        </div> : <button onClick={() => setImageData(null)}>Limpiar imagen</button>
        }

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
            <select defaultValue="no-group" id="group-select" onChange={handleSelectChange}>
              <option disabled value="no-group">-- Selecciona un grupo --</option>
              {groupList?.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.name}
                </option>
              ))}
              <option key={null} value="">
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
          <button className="save" onClick={handleSubmit}>Guardar</button>
          <button className="cancel" onClick={onClose}>Cancelar</button>
        </div>

      </div>
    </div>
  );
};

export default SaveVisorModal;