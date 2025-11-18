import './UserDashboard.css'
import { useState, useEffect } from 'react';
import { getUserList } from '../../../api/users';
import { searchUser, changeUserStatus, getUserMetrics, resetUserPassword } from '../../../api/admin.js';
import CreateModal from "../../CreateModal/CreateModal"
import ConfirmDialog from '../../ConfirmDialog/ConfirmDialog';
import { useUser } from "/src/context/UserContext";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timeout cuando el componente se desmonte o el valor cambie
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

function UserDashboard() {

  useEffect(() => {
    getUserMetrics().then(setMetrics)
  }, []);

  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500); // Se aplica el debounce con 500ms
  const [metrics, setMetrics] = useState([])
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const { checkAuth } = useUser();

  const updateMetrics = async () => {
    const metrica = await getUserMetrics()
    setMetrics(metrica)
  }

  useEffect(() => {
    if (debouncedSearch.trim()) {
      searchUser(debouncedSearch).then(setUsuarios)
    } else {
      getUserList().then(setUsuarios); // Si no hay búsqueda, mostramos todos
    }
  }, [debouncedSearch]);

  /*   const handleRegisterSuccess = () => {
      checkAuth();
      setShowCreateUserModal(false);
    };
   */
  return (
    <div className="user-dashboard">

      {/* <h1>Administrar Usuarios</h1> */}


      <section className="ud-body">
        <section className="ud-metricas">
          <div>
            Total: {metrics.total}
          </div>

          <div>
            Inactivos: {metrics.unabled}
          </div>

          <div>
            Administradores: {metrics.admins}
          </div>

          {/*         <div>
          Usuarios Registrados:
        </div> */}
        </section>
        <div className='ud-actions'>
          <button
            onClick={() => setShowCreateUserModal(true)}>
            Alta Nuevo Usuario
          </button>
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="ud-table-container">
          <table className="ud-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((usuario, index) => (
                  <tr key={index}>
                    <td>{usuario.email}</td>
                    <td>{usuario.name}</td>
                    <td>{usuario.lastname}</td>
                    <td>{usuario.active ? "Activo" : "Inactivo"}</td>
                    <td>
                      <button onClick={async () => { await changeUserStatus(usuario.id), getUserList().then(setUsuarios), updateMetrics() }}>{usuario.active ? "Deshabilitar" : "Habilitar"}</button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Estás seguro de que querés blanquear la clave de ${usuario.name} ${usuario.lastname}?`)) {
                            resetUserPassword(usuario.id);
                          }
                        }}>

                        Blanquear Clave
                      </button>
                      {/*    <button>Hacer Administrador?</button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No se encontraron resultados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showCreateUserModal && (
        <CreateModal
          type="user"
          onClose={() => setShowCreateUserModal(false)}
          onRegisterSuccess={() => { }}
        />
      )}
    </div>
  )
}

export default UserDashboard