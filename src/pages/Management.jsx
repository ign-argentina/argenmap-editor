import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import ManagementTable from "../components/ManagementTable";
import axios from "axios";

function Management() {

  const navigate = useNavigate();
  const { groupAdmin, superAdmin, loadingUser, user } = useUser();
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
    if (loadingUser) return; // Esperamos a que termine de cargar el usuario 
    if (!superAdmin && !groupAdmin) {
      navigate('/')
    } else {
      getGrupos();
      getManageGroups();
    }
  }, [loadingUser, superAdmin, groupAdmin, navigate]);


  return (
    <>
      <h1>¡Hola {user?.name}!</h1>
      {groupAdmin && (
        <section className="group-management-dashboard" >
          <div className="dashboard-header">
            <h5>Selecciona el grupo que quieras administrar:</h5>
            <select onChange={handleSelectChange}>
              <option value="">-- Seleccioná un grupo --</option>
              {adminGroup.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.name}
                </option>
              ))}
            </select>
          </div>

          <div className="dashboard-body">

            {selectedGroupData && (
              <>
                <h3>Información del grupo seleccionado</h3>
                <ManagementTable headers = {{name: "Nombre", description: "Descripción", created_at: "Fecha de creación" }}
                                 data={selectedGroupData ? [selectedGroupData] : []}>
                </ManagementTable>
              </>
            )}
          </div>
        </section >
      )
      }
    </>
  );
}

export default Management;
