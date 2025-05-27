import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import ManagementTable from "../components/ManagementTable";
import './Management.css'
import axios from "axios";

function Management() {

  const navigate = useNavigate();
  const { groupAdmin, superAdmin, loadingUser, user } = useUser();
  const [myGroups, setMyGroups] = useState([]);
  const [adminGroup, setAdminGroup] = useState([]);
  const [selectedGroupData, setSelectedGroupData] = useState(null);
  const [selectedGroupUserList, setSelectedGroupUserList] = useState(null)

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

      const userList = await axios.get(`http://localhost:3001/groups/management/userlist/${selectedId}`, {
        withCredentials: true,
      });
      setSelectedGroupData(res.data);
      setSelectedGroupUserList(userList.data)
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
    <div className="management-container">
      <h1 className="dashboard-title">¡Hola {user?.name}!</h1>

      {groupAdmin && (
        <section className="dashboard-section">
          <div className="dashboard-group-select">
            <label htmlFor="group-select">Selecciona el grupo que quieras administrar:</label>
            <select id="group-select" onChange={handleSelectChange}>
              <option value="">-- Selecciona un grupo --</option>
              {adminGroup.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tabla de informacion */}
          {selectedGroupData && (
            <div className="group-data-table">
              <h2>{selectedGroupData.name}</h2>
              <ManagementTable
                headers={{ name: "Nombre", description: "Descripción", img: "Imagen" }}
                data={[selectedGroupData]}
              />
            </div>
          )}

          {/* Tabla de usuarios */}
          {selectedGroupData && (
            <div className="group-data-table">
              <h2>Usuarios del grupo: {selectedGroupData.name}</h2>
              <ManagementTable
                headers={{ name: "Nombre", lastname: "Apellido", email: "Email", rol: "Rol" }}
                data={selectedGroupUserList}
              />
            </div>
          )}

          <div className="users-table-placeholder">
            {/* TODO: Tabla de usuarios del grupo */}
          </div>
        </section>
      )}
    </div>
  );
}

export default Management;
