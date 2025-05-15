import React, { useState } from 'react';
import './SaveVisorModal.css';

const SaveVisorModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return alert('El nombre es obligatorio');
    onSave({ name, description });
    setName('');
    setDescription('');
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
      <div className="modal-buttons">
        <button className="save" onClick={handleSubmit}>Guardar</button>
        <button className="cancel" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default SaveVisorModal;
