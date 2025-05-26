import React, { useState } from 'react';
import './SaveVisorModal.css';
import html2canvas from 'html2canvas';

const SaveVisorModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageData, setImageData] = useState(null);

  const captureIframeImage = async () => {
    const iframe = document.querySelector('iframe');
    try {
      const canvas = await html2canvas(iframe.contentDocument.body);
      const image = canvas.toDataURL('image/png');
      setImageData(image);
      alert('Imagen capturada correctamente');
    } catch (err) {
      alert('No se pudo capturar la imagen del visor');
      console.error(err);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return alert('El nombre es obligatorio');
    onSave({ name, description, img: imageData });
    setName('');
    setDescription('');
    setImageData(null);
  };

  if (!isOpen) return null;

  return (
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
      <button onClick={captureIframeImage}>Capturar imagen del visor</button>
      <div className="modal-buttons">
        <button className="save" onClick={handleSubmit}>Guardar</button>
        <button className="cancel" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};


export default SaveVisorModal;
