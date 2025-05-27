function ManagementTable({ headers, data }) {
  if (!data || data.length === 0) {
    return <p>No hay datos para mostrar.</p>;
  }

  const keys = Object.keys(headers); // Headers que provienen del componente padre.

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }} border="1" cellPadding="8">
      <thead style={{ backgroundColor: "#f4f4f4" }}>
        <tr>
          {keys.map((key) => (
            <th key={key} style={{ textAlign: "left" }}>{headers[key]}</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}


export default ManagementTable