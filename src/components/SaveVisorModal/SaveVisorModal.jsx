import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import './SaveVisorModal.css';

const SaveVisorModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageData, setImageData] = useState(null);
  const [source, setSource] = useState(null);
  const navigate = useNavigate();

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

    onSave({ name, description, img: imageData });
    setName('');
    setDescription('');
    setImageData(null);
    setSource(null);
    navigate('/')
  };

  if (!isOpen) return null;

  return (
    <div className="save-visor-modal-overlay">
      <div className="save-visor-modal">
        <h3>Guardar nueva plantilla</h3>

        <input
          type="text"
          placeholder="Nombre de la plantilla"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="image-options">
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
        </div>

        {imageData && (
          <img
            src={imageData}
            alt="Vista previa"
            style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '10px' }}
          />
        )}

        <div className="modal-buttons">
          <button className="save" onClick={handleSubmit}>Guardar</button>
          <button className="cancel" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default SaveVisorModal;
