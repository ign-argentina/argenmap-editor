import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useToast } from "../context/ToastContext.jsx";
import ManagementTableUserList from "../components/ManagementUserList/ManagementUserList.jsx";
import ManagementDeletedViewerList from "../components/ManagementDeletedViewerList/ManagementDeletedViewerList.jsx";
import { restoreViewer, getDeletedViewers } from "../api/viewers.js";
import { getGroupUserList, addUserToGroup, deleteUserFromGroup, updateUserRolFromGroup, getRoles, updateGroup, deleteGroup, getPermissions } from "../api/groups.js";
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
      onSuccess();
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

function Management({ group }) {
  const [selectedGroupUserList, setSelectedGroupUserList] = useState([]);
  const [deletedViewerList, setDeletedViewerList] = useState([]);
  const [roles, setRoles] = useState([]);
  const [activeTab, setActiveTab] = useState("usuarios");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isAdmin, setIsAdmin] = useState(false);

  const { user } = useUser();
  const { showToast } = useToast();

  // Cargar datos iniciales solo cuando group esté disponible
  useEffect(() => {
    const loadInitialData = async () => {
      if (!group?.id) return; //Validar que group existe

      setIsLoading(true);
      try {
        const [userList, deletedList, rolList, access] = await Promise.all([
          getGroupUserList(group.id),
          getDeletedViewers(group.id),
          getRoles(),
          getPermissions(group.id)
        ]);

        setSelectedGroupUserList(userList || []);
        setDeletedViewerList(deletedList || []);
        setRoles(rolList || []);
        setIsAdmin(access.ga || false)

      } catch (error) {
        console.error("Error al cargar datos:", error);
        showToast("Error al cargar los datos del grupo", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [group?.id, user]);

  // Funciones helper 
  const updateGroupUserList = async () => {
    if (!group?.id) return;
    const userList = await getGroupUserList(group.id);
    setSelectedGroupUserList(userList || []);
  };

  const updateDeletedViewerList = async () => {
    if (!group?.id) return;
    const deletedList = await getDeletedViewers(group.id);
    setDeletedViewerList(deletedList || []);
  };

  const handleDeleteUser = async (uid) => {
    await deleteUserFromGroup(uid, group.id);
    await updateGroupUserList();
    showToast("El usuario ha sido removido del grupo", "warning");
  };

  const handleUpdateRolUser = async (user) => {
    await updateUserRolFromGroup(user.id, user.rol, group.id);
    await updateGroupUserList();
    showToast("El rol del usuario ha sido modificado", "success");
  };

  const handleUpdateGroup = async (groupData) => {
    const { name, description, img } = groupData;
    await updateGroup(name, description, img, group.id);
    showToast("Guardado con Éxito", "success");
  };

  const handleDeleteGroup = async () => {
    if (confirm('¿Estás seguro que querés eliminar este grupo?')) {
      await deleteGroup(group.id);
      window.location.reload();
    }
  };

  const handleRestoreViewer = async (viewerid) => {
    if (confirm('¿Estás seguro que querés restaurar este visor?')) {
      await restoreViewer(viewerid, group.id);
      await updateDeletedViewerList();
    }
  };

  // Mostrar loading hasta que todo esté listo
  if (!group || isLoading) {
    return (
      <div className="management-container">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="management-container">
      <h1 className="dashboard-title">{group.name}</h1>

      <section className="dashboard-section">
        <div className="group-data-table">
          <h2>Información del grupo</h2>
          <ManagementTableUserList
            headers={{ name: "Nombre", description: "Descripción", img: "Imagen" }}
            data={[group]}
            editableFields={["name", "description", "img"]}
            onUpdate={handleUpdateGroup}
            onDelete={handleDeleteGroup}
            hasAccess={isAdmin}
          />
        </div>

        <div className="group-data-table">
          <div className="group-tab-menu">
            <button
              className={activeTab === "usuarios" ? "active" : ""}
              onClick={() => setActiveTab("usuarios")}
            >
              Integrantes del grupo
            </button>
            {isAdmin && (<button
              className={activeTab === "visores" ? "active" : ""}
              onClick={() => setActiveTab("visores")}
            >
              Visores eliminados
            </button>)}
          </div>

          {activeTab === "usuarios" && (
            <>
              {isAdmin && (<button className="dash-button" onClick={() => setShowAddUserModal(true)}>
                Agregar Usuario
              </button>)}
              <ManagementTableUserList
                headers={{ name: "Nombre", lastname: "Apellido", email: "Email", rol: "Rol" }}
                data={selectedGroupUserList}
                onDelete={handleDeleteUser}
                onUpdate={handleUpdateRolUser}
                editableFields={["rol"]}
                rolOptions={roles}
                isUserTable={true}
                hasAccess={(isAdmin)}
              />
            </>
          )}

          {activeTab === "visores" && (
            <ManagementDeletedViewerList
              headers={{ name: "Nombre", isargenmap: "Version" }}
              data={deletedViewerList}
              onRestore={handleRestoreViewer}
            />
          )}
        </div>
      </section>

      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          groupId={group.id}
          onSuccess={updateGroupUserList}
          groupUserList={selectedGroupUserList}
        />
      )}
    </div>
  );
}

export default Management;