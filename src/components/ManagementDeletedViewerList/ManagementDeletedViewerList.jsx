import "./ManagementDeletedViewerList.css";

function ManagementDeletedViewerList({
  headers,
  data,
  onRestore,
}) {

  if (!data || data.length === 0) {
    return <p>No hay visores eliminados.</p>;
  }

  const keys = Object.keys(headers);

  const handleRestore = (id) => {
    onRestore?.(id);
  };

  return (
    <table className="management-table">
      <thead className="management-table__head">
        <tr>
          {keys.map((key) => (
            <th key={key} className="management-table__header-cell">
              {headers[key]}
            </th>
          ))}
          <th className="management-table__header-cell">Acciones</th>
        </tr>
      </thead>
      <tbody className="management-table__body">
        {data.map((row, idx) => (
          <tr key={idx} className="management-table__row">
            {keys.map((key) => (
              <td key={key} className="management-table__cell">
                {typeof row[key] === "boolean" ? 
                  (row[key] ? "Argenmap" : "Kharta") : 
                  (row[key] ?? "—")
                }
              </td>
            ))}
            <td className="management-table__cell management-table__actions-cell">
              <button
                title="Restaurar"
                className="management-table__btn-delete management-table__btn btn-management"
                onClick={() => handleRestore(row.id)}
              >
                <i className="fas fa-trash-restore"></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ManagementDeletedViewerList;