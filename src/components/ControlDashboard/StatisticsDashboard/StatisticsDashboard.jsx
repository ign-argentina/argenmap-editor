import './StatisticsDashboard.css'
import { useState, useEffect } from 'react';
import { getUserList } from '../../../api/users.js';
import { searchUser, changeUserStatus, getUserMetrics, resetUserPassword } from '../../../api/admin.js';
import CreateModal from "../../CreateModal/CreateModal.jsx"
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

function StatisticsDashboard() {

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

  return (
    <div className="statistics-dashboard">

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

        </section>

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

export default StatisticsDashboard