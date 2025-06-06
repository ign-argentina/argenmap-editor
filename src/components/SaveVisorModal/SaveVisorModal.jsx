import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import './SaveVisorModal.css';
import { useUser } from '../../context/UserContext';
import { updateVisor, createVisor, getManageGroups } from "../../api/configApi.js"
import Toast from "../Toast/Toast.jsx"

const SaveVisorModal = ({ isOpen, onClose, visor, editorMode = false, cloneMode = false }) => {

  const [name, setName] = useState(editorMode ? visor?.name : "");
  const [description, setDescription] = useState(editorMode ? visor?.description : "");
  const [imageData, setImageData] = useState(editorMode ? visor?.img : null)
  const [source, setSource] = useState(null);

  const [selectedGroup, setSelectedGroup] = useState([])
  const [groupList, setGroupList] = useState([])

  const navigate = useNavigate();

  const loadGroups = async () => {
    const groups = await getManageGroups()
    setGroupList(groups);
  }

  const handleSelectChange = async (e) => {
    const groupId = (e.target.value === "no-group" || e.target.value === "") ? null : e.target.value
    setSelectedGroup(groupId)
  }

  useEffect(() => {
    loadGroups()
  }, []);

  const captureIframeImage = async () => {
    const iframe = document.querySelector('iframe');
    try {
      const canvas = await html2canvas(iframe.contentDocument.body);
      const image = canvas.toDataURL('image/png');
      setImageData(image);
      setSource('captura');
      alert('Imagen capturada correctamente');
    } catch (err) {
      alert('No se pudo capturar la imagen del visor');
      console.error(err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Validar el tipo de archivo
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Solo se permiten imágenes JPG o PNG');
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
        alert('Imagen subida correctamente');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!name.trim()) return alert('El nombre es obligatorio');

    if (imageData && !imageData.startsWith('data:image/png') && !imageData.startsWith('data:image/jpeg')) {
      return alert('Formato de imagen inválido');
    }

    saveVisor()
    setName('');
    setDescription('');
    setImageData(null);
    setSource(null);
    navigate('/')
  };

  const saveVisor = async () => {
    {
      let res;
      const currentJsonRaw = localStorage.getItem('visorMetadata');
      const currentJsonParsed = currentJsonRaw ? JSON.parse(currentJsonRaw) : {};
      const configOnly = currentJsonParsed.config;

      if (!currentJsonRaw) {
        alert('No hay configuración para guardar');
        return;
      }

      if (editorMode && !cloneMode) {
        res = await updateVisor(visor.id, visor.gid, name, description, configOnly.json, imageData)
      } else {
        res = await createVisor(selectedGroup, name, description, configOnly.json, imageData)
      }

      if (res.success) {
        alert("Cargado con exito")
        /*  return <Toast
            message={"Capo"}
            type={"success"}
            duration={3000}
            onClose={() => setToast(null)}
          /> */
      } else {
        alert("Error")
        /*        return <Toast
                  message={"Capo lo fundiste"}
                  type={"error"}
                  duration={3000}
                  onClose={() => setToast(null)}
                /> */
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
        />

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {imageData == null ? <div className="image-options">
          <button onClick={captureIframeImage} disabled={source === 'upload'}>
            Capturar imagen del visor
          </button>

          <label className={`upload-button ${source === 'captura' ? 'disabled' : ''}`}>
            Subir imagen desde PC
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageUpload}
              disabled={source === 'captura'}
              style={{ display: 'none' }}
            />
          </label>
        </div> : <button onClick={() => setImageData(null)}>Limpiar imagen</button>}

        {imageData && (
          <img
            src={imageData}
            alt="Vista previa"
            style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '10px' }}
          />
        )}

        {!editorMode ? <select defaultValue="no-group" id="group-select" onChange={handleSelectChange}>
          <option disabled value="no-group">-- Selecciona un grupo --</option>
          {groupList?.map((grupo) => (
            <option key={grupo.id} value={grupo.id}>
              {grupo.name}
            </option>
          ))}
          <option key={null} value="">
            Mis Visores
          </option>
        </select> : null}

        <div className="modal-buttons">
          <button className="save" onClick={handleSubmit}>Guardar</button>
          <button className="cancel" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default SaveVisorModal;