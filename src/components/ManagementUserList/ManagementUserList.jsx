import React, { useState } from "react";
import "./ManagementUserList.css";
import { useUser } from "../../context/UserContext";

function ManagementTableUserList({
  headers,
  data,
  onDelete,
  onUpdate,
  editableFields = [],
  rolOptions = [],
  isUserTable = false,
}) {
  const [editRowId, setEditRowId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const { user } = useUser();

  if (!data || data.length === 0) {
    return <p>No hay datos para mostrar.</p>;
  }

  const keys = Object.keys(headers);
  const extendedKeys = [...keys, "acciones"];

  const handleDelete = (id) => {
    onDelete?.(id);
  };

  const handleEditClick = (row) => {
    setEditRowId(row.id);
    setEditedData({ ...row });
  };

  const handleInputChange = (key, value) => {
    setEditedData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      alert("Solo se permiten imágenes JPG o PNG.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 300;
        const scale = MAX_WIDTH / img.width;
        const canvas = document.createElement("canvas");
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const resizedImage = canvas.toDataURL(file.type);
        setEditedData((prev) => ({ ...prev, img: resizedImage }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = () => {
    onUpdate?.(editedData);
    setEditRowId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleUpdate();
    } else if (e.key === "Escape") {
      setEditRowId(null);
    }
  };

  return (
    <table className="management-table">
      <thead className="management-table__head">
        <tr>
          {extendedKeys.map((key) => (
            <th key={key} className="management-table__header-cell">
              {key === "acciones" ? "Acciones" : headers[key]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="management-table__body">
        {data.map((row, idx) => (
          <tr key={idx} className="management-table__row">
            {keys.map((key) => (
              <td key={key} className="management-table__cell">
                {editRowId === row.id && editableFields.includes(key) ? (
                  key === "rol" ? (
                    <select
                      value={editedData[key] ?? ""}
                      onChange={(e) =>
                        handleInputChange(key, parseInt(e.target.value))
                      }
                      onKeyDown={handleKeyDown}
                      className="management-table__select"
                    >
                      {rolOptions.map((rol) => (
                        <option key={rol.id} value={rol.id}>
                          {rol.name}
                        </option>
                      ))}
                    </select>
                  ) : key === "img" ? (
                    <div className="management-table__image-upload-container">
                      {editedData.img && (
                        <div className="management-table__image-wrapper">
                          <img
                            src={editedData.img}
                            alt="Vista previa"
                            className="management-table__image"
                          />
                          <button
                            className="management-table__btn-remove-image management-table__btn icon-button"
                            title="Quitar imagen"
                            onClick={() => handleInputChange("img", null)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleImageUpload}
                        className="management-table__file-input"
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={editedData[key] ?? ""}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="management-table__input-text"
                    />
                  )
                ) : key === "created_at" ? (
                  row[key]?.slice(0, 10) || "—"
                ) : key === "rol" ? (
                  rolOptions.find((r) => r.id === row[key])?.name ?? row[key]
                ) : key === "img" && row[key] ? (
                  <img
                    src={row[key]}
                    alt="Imagen"
                    className="management-table__image"
                  />
                ) : (
                  row[key] ?? "—"
                )}
              </td>
            ))}
            <td className="management-table__cell management-table__actions-cell">
              {editRowId === row.id ? (
                <button
                  title="Guardar"
                  className="management-table__btn-confirm management-table__btn btn-management"
                  onClick={handleUpdate}
                >
                  <i className="fas fa-check"></i>
                </button>
              ) : (
                <button
                  style={{
                    visibility:
                      isUserTable && row.id === user?.id
                        ? "hidden"
                        : "visible",
                  }}
                  title="Editar"
                  className="management-table__btn-edit management-table__btn btn-management"
                  onClick={() => handleEditClick(row)}
                >
                  <i className="fas fa-pencil-alt"></i>
                </button>
              )}
              <button
                style={{
                  visibility:
                    isUserTable && row.id === user?.id ? "hidden" : "visible",
                }}
                title="Eliminar"
                className="management-table__btn-delete management-table__btn btn-management"
                onClick={() => handleDelete(row.id)}
              >
                <i className="fas fa-circle-minus"></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ManagementTableUserList;
