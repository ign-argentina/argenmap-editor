import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";

function Management() {
  const { groupAdmin } = useUser();

  const [myGroups, setMyGroups] = useState([]);
  const [adminGroup, setAdminGroup] = useState([]);
  const [selectedGroupData, setSelectedGroupData] = useState(null);

  const getGrupos = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/groups/`, {
        withCredentials: true,
      });
      setMyGroups(res.data);
    } catch (error) {
      console.error("Error al obtener grupos:", error);
    }
  };

  const getManageGroups = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/groups/management`, {
        withCredentials: true,
      });
      setAdminGroup(res.data);
    } catch (error) {
      console.error("Error al obtener grupos:", error);
    }
  };

  const handleSelectChange = async (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return setSelectedGroupData(null);

    try {
      const res = await axios.get(`http://localhost:3001/groups/management/${selectedId}`, {
        withCredentials: true,
      });
      setSelectedGroupData(res.data);
    } catch (error) {
      console.error("Error al obtener info del grupo:", error);
      setSelectedGroupData(null);
    }
  };

  useEffect(() => {
    getGrupos();
    getManageGroups();
  }, []);

  return (
    <>
      {groupAdmin && (
        <>
          <h1>Hola Usuario admin de grupo</h1>

          <h2>Mis grupos:</h2>
          <ul>
            {myGroups.map((grupo) => (
              <li key={grupo.id}>{grupo.name}</li>
            ))}
          </ul>

          <h2>Grupos que administro:</h2>
          <select onChange={handleSelectChange}>
            <option value="">-- Seleccioná un grupo --</option>
            {adminGroup.map((grupo) => (
              <option key={grupo.id} value={grupo.id}>
                {grupo.name}
              </option>
            ))}
          </select>

          <br /><br />

          {selectedGroupData && (
            <>
              <h3>Información del grupo seleccionado</h3>
              <table border="1" cellPadding="8">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Fecha de creación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{selectedGroupData.id}</td>
                    <td>{selectedGroupData.name}</td>
                    <td>{selectedGroupData.description || "Sin descripción"}</td>
                    <td>{selectedGroupData.created_at?.slice(0, 10) || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </>
  );
}

export default Management;
