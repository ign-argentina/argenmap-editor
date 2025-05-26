import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";

function Management() {
  const { groupAdmin } = useUser()


  const [myGroups, setMyGroups] = useState([]);
  const [adminGroup, setAdminGroup] = useState([]);


  const getGrupos = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/groups/`, {
        withCredentials: true,
      });
      console.log(res.data)
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
      console.log(res.data)
      setAdminGroup(res.data);
    } catch (error) {
      console.error("Error al obtener grupos:", error);
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

        <br />

        <h2>Mis grupos:</h2>
        <ul>
          {myGroups.map((grupo) => (
            <li key={grupo.id}>{grupo.name}</li>
          ))}
        </ul>

        <br />
        <br />

        <h2>Grupos que administro:</h2>
        <select
          onChange={(e) => {
            const selectedId = e.target.value;
            const grupo = adminGroup.find(g => g.id === parseInt(selectedId));
            if (grupo) alert(`Seleccionaste: ${grupo.name}`);
          }}
        >
          <option value="">-- Seleccioná un grupo --</option>
          {adminGroup.map((grupo) => (
            <option key={grupo.id} value={grupo.id}>
              {grupo.name}
            </option>
          ))}
        </select>
      </>
    )}
  </>
);
}

export default Management