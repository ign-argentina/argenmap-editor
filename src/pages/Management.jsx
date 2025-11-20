import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useToast } from "../context/ToastContext.jsx";
import { useNavigate } from "react-router-dom";
import ManagementTableUserList from "../components/ManagementUserList/ManagementUserList.jsx";
import ManagementDeletedViewerList from "../components/ManagementDeletedViewerList/ManagementDeletedViewerList.jsx";
import { restoreViewer, getDeletedViewers } from "../api/viewers.js";
import { getManageGroups, getGroup, getGroupUserList, addUserToGroup, deleteUserFromGroup, updateUserRolFromGroup, getRoles, updateGroup, deleteGroup } from "../api/groups.js";
import { getUserList } from "../api/users.js";
import './Management.css'

function AddUserModal({ onClose, groupId, onSuccess, groupUserList }) {
  const [userList, setUserList] = useState([])
  const [userSelected, setUserSelected] = useState(null)
  const { showToast } = useToast()
  const handleAdd = async () => {
    const res = await addUserToGroup(userSelected, groupId)
    if (res.success) {
      showToast("Usuario agregado al grupo!", "success");
      onSuccess()
    } else {
      showToast("No se ha podido agregar el usuario al grupo", "error");
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
            (groupUser) => groupUser.id === user.id
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
        <select defaultValue="DEFAULT" id="user-select" className="modal-select" onChange={handleUserChange}>
          <option disabled value="DEFAULT">
            Seleccione un usuario...
          </option>
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
  const [deletedViewerList, setDeletedViewerList] = useState([])

  const [activeTab, setActiveTab] = useState("usuarios");
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const [roles, setRoles] = useState([])
  const { showToast } = useToast()

  const handleSelectChange = async (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return setSelectedGroupData([]);

    try {
      const groupData = await getGroup(selectedId)
      setSelectedGroupData(groupData);
      await updateGroupUserList(selectedId)
      await getDeletedViewerList(selectedId)
    } catch (error) {
      console.error("Error al obtener info del grupo:", error);
      setSelectedGroupData(null);
    }
  };

  const updateGroupUserList = async (id) => {
    const userList = await getGroupUserList(id)
    setSelectedGroupUserList(userList ? userList : [])
  }

  const getDeletedViewerList = async(id) => {

    const deletedList = await getDeletedViewers(id)
    console.log(deletedList)
    setDeletedViewerList(deletedList ? deletedList : [])
  }

  const loadGroups = async () => {
    const groupList = await getManageGroups()
    const rolList = await getRoles()
    setRoles(rolList)
    setAdminGroup(groupList);
  }

  // Si no tenes accesos te saca (MEJORAR CON PRIVATEDROUTES)
  useEffect(() => {
    if (loadingUser) return; // Esperamos a que termine de cargar el usuario 
    if (!superAdmin && !groupAdmin) {
      navigate('/')
    } else {
      loadGroups()
    }
  }, [loadingUser, superAdmin, groupAdmin, navigate]);

  const handleDeleteUser = async (uid) => {
    await deleteUserFromGroup(uid, selectedGroupData.id)
    await updateGroupUserList(selectedGroupData.id)
    showToast("El usuario ha sido removido del grupo", "warning")
  }

  const handleUpdateRolUser = async (user) => {
    await updateUserRolFromGroup(user.id, user.rol, selectedGroupData.id)
    await updateGroupUserList(selectedGroupData.id)
    showToast("El rol del usuario ha sido modificado", "success")
  }

  const handleUpdateGroup = async (groupData) => {
    const { name, description, img } = groupData
    await updateGroup(name, description, img, selectedGroupData.id)
    const groupInfo = await getGroup(selectedGroupData.id)
    setSelectedGroupData(groupInfo);
    showToast("Guardado con Exito", "success")
  }

  const handleDeleteGroup = async () => {
    if (confirm('Estas seguro que queres eliminar este grupo?')) {
      await deleteGroup(selectedGroupData.id)
      window.location.reload()
    }
  }

  const handleRestoreViewer = async (viewerid) => {
    if (confirm('Estas seguro que queres restaurar este visor?')) {
      await restoreViewer(viewerid, selectedGroupData.id)
      await getDeletedViewerList(selectedGroupData.id)
    }
  }

  return (
    <div className="management-container">
      <h1 className="dashboard-title">¡Hola {user?.name}!</h1>

      {(superAdmin || groupAdmin) && (
        <section className="dashboard-section">
          <div className="dashboard-group-select">
            <label htmlFor="group-select">Selecciona el grupo que quieras administrar:</label>
            <select defaultValue="no-group" id="group-select" onChange={handleSelectChange}>
              <option disabled value="no-group">-- Selecciona un grupo --</option>
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
                <ManagementTableUserList
                  headers={{ name: "Nombre", description: "Descripción", img: "Imagen" }}
                  data={[selectedGroupData]}
                  editableFields={["name", "description", "img"]}
                  onUpdate={handleUpdateGroup} // Actualizar Grupo
                  onDelete={handleDeleteGroup} // Eliminar grupo

                />
              </div>

              <div className="group-data-table">
                <div className="group-tab-menu">
                  <button
                    className={activeTab === "usuarios" ? "active" : ""}
                    onClick={() => setActiveTab("usuarios")}
                  > {/* <i className="fa-solid fa-people-group"></i> */}
                    Integrantes del grupo
                  </button>
                  <button
                    className={activeTab === "visores" ? "active" : ""}
                    onClick={() => setActiveTab("visores")}
                  >
                    Vistores eliminados
                  </button>
                </div>

                {activeTab === "usuarios" && (
                  <>
                    <button className="dash-button" onClick={() => setShowAddUserModal(true)} > Agregar Usuario </button>
                    <ManagementTableUserList
                      headers={{ name: "Nombre", lastname: "Apellido", email: "Email", rol: "Rol" }}
                      data={selectedGroupUserList}
                      onDelete={handleDeleteUser}
                      onUpdate={handleUpdateRolUser}
                      editableFields={["rol"]}
                      rolOptions={roles}
                      isUserTable={true}
                    />
                  </>
                )}

                {activeTab === "visores" && (
                  <>
                  {/*   <button className="dash-button"> Nuevo Visor </button> */}
                    <ManagementDeletedViewerList
                      headers={{ name: "Nombre", isargenmap: "Version"}}
                      data={deletedViewerList}
                      onRestore={handleRestoreViewer}
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