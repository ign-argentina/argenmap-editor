import "./ManagementTable.css"

function ManagementTable({ headers, data }) {
  if (!data || data.length === 0) {
    return <p>No hay datos para mostrar.</p>;
  }

  const keys = Object.keys(headers); // Keys del array
  const extendedKeys = [...keys, "acciones"]; // Siempre agrega el theader acciones

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
                <button onClick={() => alert("Acción no implementada")}>Editar</button>
                <button onClick={() => alert("Acción no implementada")}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ManagementTable;