import "./ManagementTable.css"

function ManagementTable({ headers, data, onDelete, onUpdate }) {
  if (!data || data.length === 0) {
    return <p>No hay datos para mostrar.</p>;
  }

  const keys = Object.keys(headers); // Keys del array
  const extendedKeys = [...keys, "acciones"]; // Siempre agrega el theader acciones

  const handleDelete = (id) => {
    onDelete(id)

  }

  const handleUpdate = (id) => {
    onUpdate(id)
  }
  return (
    <>
      {/* Input Buscar que filtre */}
      <table>
        <thead>
          <tr>
            {extendedKeys.map((key) => (
              <th key={key}>
                {key === "acciones" ? "Acciones" : headers[key]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {keys.map((key) => (
                <td key={key}>
                  {key === "created_at"
                    ? row[key]?.slice(0, 10) || "—"
                    : row[key] ?? "—"}
                </td>
              ))}
              <td>
                <button title="Editar" className='btn-management btn-edit' onClick={() => handleUpdate(row.id)}>   <i className="fas fa-pencil-alt"></i> </button>
                <button title="Eliminar" className='btn-management btn-delete' onClick={() => handleDelete(row.id)}> <i className="fas fa-circle-minus" ></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ManagementTable;