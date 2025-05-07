// components/SaveVisorModal.jsx
import React, { useState } from 'react';

const SaveVisorModal = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return alert('El nombre es obligatorio');
    onSave({ name, description });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Guardar como Visor</h2>
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
        <div className="modal-buttons">
          <button onClick={handleSubmit}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default SaveVisorModal;