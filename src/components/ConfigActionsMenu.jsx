import React, { useState } from 'react';

const ConfigActionsMenu = ({ handleSaveConfig }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className="save-menu-container"
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      <button className="download-button" title="Opciones de guardado">
        <span className="icon">
          <i className="fa-solid fa-database"></i>
        </span>
        Acciones
      </button>

      {showMenu && (
        <div className="save-menu-popup">
          <button className="download-button" onClick={handleSaveConfig}>
            <i className="fa-solid fa-save"></i> Guardar
          </button>
          <button className="download-button" onClick={() => alert("Opción 2 aún no implementada")}>
            <i className="fa-solid fa-code"></i> Actualizar
          </button>
          <button className="download-button" onClick={() => alert("Opción 3 aún no implementada")}>
            <i className="fa-solid fa-gear"></i> Borrar
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfigActionsMenu;