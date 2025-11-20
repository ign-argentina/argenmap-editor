import { useEffect, useState } from 'react';
import { getGroupsMetrics, getAGroupList, searchGroup, changeGroupStatus } from '../../../api/admin';
import ConfirmDialog from '../../ConfirmDialog/ConfirmDialog'
import CreateModal from "../../CreateModal/CreateModal"
import './GroupDashboard.css'

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

function GroupDashboard() {

  useEffect(() => {
    getGroupsMetrics().then(setMetrics)
  }, []);

  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500); // Se aplica el debounce con 500ms
  const [metrics, setMetrics] = useState([])
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  const updateMetrics = async () => {
    const metrica = await getGroupsMetrics()
    setMetrics(metrica)
  }

  useEffect(() => {
    if (debouncedSearch.trim()) {
      searchGroup(debouncedSearch).then(setGroups)
    } else {
      getAGroupList().then(setGroups); // Si no hay búsqueda, mostramos todos
    }
  }, [debouncedSearch]);


  return (
    <div className="group-dashboard">

      {/* <h1>Administrar Grupos</h1> */}


      <section className="gd-body">
        <section className="gd-metricas">
          <div>
            Total: {metrics.total}
          </div>

          <div>
            Inactivos: {metrics.deleted}
          </div>
          {/* 
        <div>
          Administradores: {metrics.admins}
        </div> */}

          {/*         <div>
          Usuarios Registrados:
        </div> */}
        </section>
        <div className='gd-actions'>
          <button
            onClick={() => setShowCreateUserModal(true)}>
            Alta Nuevo Grupo
          </button>

          <input
            type="text"
            placeholder="Buscar grupo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>


        <div className="gd-table-container">
          <table className="gd-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Cantidad de visores</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {groups?.length > 0 ? (
                groups.map((group, index) => (
                  <tr key={index}>
                    <td>{group.name}</td>
                    <td>{group.description}</td>
                    <td>{group.totalviewers}</td>
                    <td>{group.deleted ? "Eliminado" : "Activo"}</td>
                    <td>
                      <button onClick={async () => { await changeGroupStatus(group.id); getAGroupList().then(setGroups); updateMetrics(); }}>
                        {group.deleted ? "Recuperar" : "Eliminar"}
                      </button>
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
          type="group"
          onClose={() => setShowCreateUserModal(false)}
          onSuccess={() => { getAGroupList().then(setGroups); updateMetrics(); setShowCreateUserModal(false); }}
        />
      )}
    </div>
  )
}

export default GroupDashboard