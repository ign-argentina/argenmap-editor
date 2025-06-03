import React, { useState } from "react";
import "./ManagementTable.css";
import { useUser } from "../context/UserContext";

function ManagementTable({ headers, data, onDelete, onUpdate, editableFields = [], rolOptions = [] }) {
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
    <table>
      <thead>
        <tr>
          {extendedKeys.map((key) => (
            <th key={key}>{key === "acciones" ? "Acciones" : headers[key]}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {keys.map((key) => (
              <td key={key}>
                {editRowId === row.id && editableFields.includes(key) ? (
                  key === "rol" ? (
                    <select
                      value={editedData[key] ?? ""}
                      onChange={(e) => handleInputChange(key, parseInt(e.target.value))}
                      onKeyDown={handleKeyDown}
                    >
                      {rolOptions.map((rol) => (
                        <option key={rol.id} value={rol.id}>
                          {rol.name}
                        </option>
                      ))}

                    </select>
                  ) : (
                    <input
                      type="text"
                      value={editedData[key] ?? ""}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  )
                ) : key === "created_at" ? (
                  row[key]?.slice(0, 10) || "—"
                ) : key === "rol" ? (
                  rolOptions.find(r => r.id === row[key])?.name ?? row[key]
                ) : (
                  row[key] ?? "—"
                )}
              </td>
            ))}
            <td className="actions-cell">
              {editRowId === row.id ? (
                <button
                  title="Guardar"
                  className="btn-management btn-confirm"
                  onClick={handleUpdate}
                >
                  <i className="fas fa-check"></i>
                </button>
              ) : (
                <button
                  style={{ visibility: row.id === user?.id ? 'hidden' : 'visible' }}
                  title="Editar"
                  className="btn-management btn-edit"
                  onClick={() => handleEditClick(row)}
                >
                  <i className="fas fa-pencil-alt"></i>
                </button>
              )}
              <button
                style={{ visibility: row.id === user?.id ? 'hidden' : 'visible' }}
                title="Eliminar"
                className="btn-management btn-delete"
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

export default ManagementTable;
