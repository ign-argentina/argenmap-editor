import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import ManagementTable from "../components/ManagementTable";
import './Management.css'
import { getManageGroups, getGroup, getGroupUserList, getUserList, addUserToGroup } from "../api/configApi.js"


function AddUserModal({ onClose, groupId, onSuccess, groupUserList }) {

  const [userList, setUserList] = useState([])
  const [userSelected, setUserSelected] = useState(null)

  const handleAdd = async () => {
    const res = await addUserToGroup(userSelected, groupId)
    if (res.success) {
      alert("Usuario agregado al grupo!")
      onSuccess()
    } else {
      alert("No se ha podido agregar el usuario al grupo")
    }
  };

  const handleUserChange = (e) => {
    setUserSelected(e.target.value)
  }

  useEffect(() => {
    const loadUsers = async () => {
      const list = await getUserList();
      const filteredList = list.filter( // Filtramos la lista de usuarios conrespecto a la de usuarios en el grupo. Obteniendo finalmente un listado de usuarios que no están en el grupo
        (user) =>
          !groupUserList.some(
            (groupUser) => groupUser.uid === user.id
          )
      );

      setUserList(filteredList)
    }
    loadUsers();
  }, [groupUserList]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Agregar usuario al grupo</h2>

        <label htmlFor="user-select">Selecciona un usuario:</label>
        <select id="user-select" className="modal-select" onChange={handleUserChange}>
          {userList.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email} {/* Nombre: {user.name} {user.lastname}  */}
            </option>
          ))}
        </select>

        <div className="modal-actions">
          <button onClick={handleAdd} className="modal-button confirm">
            Agregar al grupo
          </button>
          <button onClick={onClose} className="modal-button cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function Management() {

  const navigate = useNavigate();
  const { groupAdmin, superAdmin, loadingUser, user } = useUser();
  const [adminGroup, setAdminGroup] = useState([]);
  const [selectedGroupData, setSelectedGroupData] = useState(null);
  const [selectedGroupUserList, setSelectedGroupUserList] = useState([])

  const [activeTab, setActiveTab] = useState("usuarios");
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const handleSelectChange = async (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return setSelectedGroupData([]);

    try {
      const groupData = await getGroup(selectedId)
      setSelectedGroupData(groupData);
      await updateGroupUserList(selectedId)
    } catch (error) {
      console.error("Error al obtener info del grupo:", error);
      setSelectedGroupData(null);
    }
  };

  const updateGroupUserList = async (id) => {
    const userList = await getGroupUserList(id)  
    setSelectedGroupUserList(userList ? userList : [])
  }
  useEffect(() => {
    const loadGroups = async () => {
      const groupList = await getManageGroups()
      setAdminGroup(groupList);
    }

    if (loadingUser) return; // Esperamos a que termine de cargar el usuario 
    if (!superAdmin && !groupAdmin) {
      navigate('/')
    } else {
      loadGroups()
    }
  }, [loadingUser, superAdmin, groupAdmin, navigate]);


  return (
    <div className="management-container">
      <h1 className="dashboard-title">¡Hola {user?.name}!</h1>

      {(superAdmin || groupAdmin) && (
        <section className="dashboard-section">
          <div className="dashboard-group-select">
            <label htmlFor="group-select">Selecciona el grupo que quieras administrar:</label>
            <select id="group-select" onChange={handleSelectChange}>
              <option value="">-- Selecciona un grupo --</option>
              {adminGroup?.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tabla de informacion */}
          {selectedGroupData && (
            <>
              <div className="group-data-table">
                <h2>Información del grupo</h2>
                <ManagementTable
                  headers={{ name: "Nombre", description: "Descripción", img: "Imagen" }}
                  data={[selectedGroupData]}
                />
              </div>

              <div className="group-data-table">
                <div className="group-tab-menu">
                  <button
                    className={activeTab === "usuarios" ? "active" : ""}
                    onClick={() => setActiveTab("usuarios")}
                  > {/* <i className="fa-solid fa-people-group"></i> */}
                    Lista de Usuarios
                  </button>
                  <button
                    className={activeTab === "visores" ? "active" : ""}
                    onClick={() => setActiveTab("visores")}
                  >
                    Lista de Visores
                  </button>
                </div>

                {activeTab === "usuarios" && (
                  <>
                    <button className="dash-button" onClick={() => setShowAddUserModal(true)} > Agregar Usuario </button>
                    <ManagementTable
                      headers={{ name: "Nombre", lastname: "Apellido", email: "Email", rol: "Rol" }}
                      data={selectedGroupUserList?.filter(user => user.rol !== 'visor')}
                    />
                  </>
                )}

                {activeTab === "visores" && (
                  <>
                    <button className="dash-button" onClick={() => alert("Auch")} > Nuevo Visor </button>
                    <ManagementTable
                      headers={{ name: "Nombre", lastname: "Apellido", email: "Email", rol: "Rol" }}
                      data={selectedGroupUserList?.filter(user => user.rol === 'visor')}
                    />
                  </>
                )}
              </div>
            </>

          )}

          {showAddUserModal ? (<AddUserModal onClose={() => setShowAddUserModal(false)}
            groupId={selectedGroupData.id}
            onSuccess={async () => await updateGroupUserList(selectedGroupData.id)}
            groupUserList={selectedGroupUserList} />) : null}
        </section>
      )}
    </div>
  );
}

export default Management;